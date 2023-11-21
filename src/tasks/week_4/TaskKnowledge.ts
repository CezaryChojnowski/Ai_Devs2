import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";
import Message from "../../model/completions/Message";
import { RoleConstants } from "../../model/conts/RoleConstants";
import CompletionsRequest from "../../model/completions/CompletionsRequest";
import { ModelConstants } from "../../model/conts/ModelConstants";
import OpenApi from "../../core/OpenApi";
import CompletionsResponse from "../../model/completions/CompletionsResponse";
import CurrencyResponse from "../../model/knowledge/CurrencyResponse";
import PopulationResponse from "../../model/knowledge/PopulationResponse";

const TASK_NAME = TaskDirections.KNOWLEDGE;
const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

class TaskKnowledge implements TaskSolver {
    private apiUrl: string | null = null;
    private countryUrl: string | null = null;
    private authResponse: AuthResponse | null = null;
    private taskResponse: TaskResponse | null = null;

    private extractDomain(value: string): string | null {
        const match = value.match(/(https?:\/\/[^\s/$.?#]+)/i);
        return match ? match[0] : null;
    }

    async solve(): Promise<void> {
        if (!this.authResponse) {
            this.authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        }

        if (!this.taskResponse) {
            this.taskResponse = await Task.getTask(this.authResponse.token) as TaskResponse;
        }

        // Wydobywanie domeny z wartości database #1 i database #2
        this.apiUrl = this.extractDomain(this.taskResponse["database #1"]);
        this.countryUrl = this.extractDomain(this.taskResponse["database #2"]);

        const messages: Message[] = [
            {
                content: `${this.taskResponse.msg}, If question is about information one of them ${this.apiUrl}, ${this.countryUrl} build correct url based on context. When question is not about theme from first or second url just return answer.
                context\`\`\`
                - when question is about population build given ulr ${this.countryUrl}?fields=population, but instead 'france' use country from question
                - when question is about currency use ${this.apiUrl}/rates/A/eur, but instead 'eur' use correct currency code
                example\'\'\'
                - for question "Podaj aktualny kurs EURO" return ${this.apiUrl}/rates/A/eur
                - for question "Podaj obecnoą populację niemiecy" return ${this.countryUrl}?fields=population`,
                role: RoleConstants.SYSTEM
            },
            {
                content: this.taskResponse.question,
                role: RoleConstants.USER
            }
        ];

        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model: ModelConstants.GPT_3_5_TURBO,
            max_tokens: 500
        };

        const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
        const answer = completionsResponse.choices[0].message.content;

        if (regex.test(answer)) {
            await this.handleApiRequest(answer);
        } else {
            await this.handleRegularAnswer(answer);
        }
    }

    private async handleApiRequest(answer: string): Promise<void> {
        if (this.apiUrl && answer.indexOf(this.apiUrl) !== -1) {
            await this.handleNbpApiRequest(answer);
        } else if (this.countryUrl && answer.indexOf(this.countryUrl) !== -1) {
            await this.handleRestCountriesApiRequest(answer);
        }
    }

    private async handleNbpApiRequest(apiUrl: string): Promise<void> {
        const response = await fetch(apiUrl, { method: 'GET', headers: {} });
        const responseStatus = response.status;

        if (responseStatus === 200) {
            const html = await response.json() as CurrencyResponse;
            const answerRequest: AnswerRequest = { answer: html.rates[0].mid };
            await Answer.sendAnswer(answerRequest, this.authResponse!.token);
        } else {
            console.warn(`Request failed with status ${response.status}`);
        }
    }

    private async handleRestCountriesApiRequest(apiUrl: string): Promise<void> {
        const response = await fetch(apiUrl, { method: 'GET', headers: {} });
        const responseStatus = response.status;

        if (responseStatus === 200) {
            const html = await response.json() as PopulationResponse[];
            const answerRequest: AnswerRequest = { answer: html[0].population };
            await Answer.sendAnswer(answerRequest, this.authResponse!.token);
        } else {
            console.warn(`Request failed with status ${response.status}`);
        }
    }

    private async handleRegularAnswer(answer: string): Promise<void> {
        const answerRequest: AnswerRequest = { answer: answer };
        await Answer.sendAnswer(answerRequest, this.authResponse!.token);
    }
}

export default TaskKnowledge;
