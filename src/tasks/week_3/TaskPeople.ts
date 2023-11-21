import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";
import PeopleResponse from "../../model/people/PeopleResponse";
import Message from "../../model/completions/Message";
import { RoleConstants } from "../../model/conts/RoleConstants";
import CompletionsRequest from "../../model/completions/CompletionsRequest";
import { ModelConstants } from "../../model/conts/ModelConstants";
import OpenApi from "../../core/OpenApi";
import CompletionsResponse from "../../model/completions/CompletionsResponse";

const TASK_NAME = TaskDirections.PEOPLE;

class TaskPeople implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse;
        console.log(taskResponse);

        const response = await fetch(taskResponse.data, {
            method: 'GET'
        });

        const peoples = await response.json() as PeopleResponse[];
        const completionsResponse = await this.buildCompletionsResponse(taskResponse, peoples);

        const fullName: string = completionsResponse.choices[0].message.content;
        const nameRegex = /^(\S+)\s(.+)$/;

        const match = fullName.match(nameRegex);

        if (match) {
            const [_, firstName, lastName] = match;
            const personDataList: PeopleResponse[] = peoples.filter(person => person.imie === firstName && person.nazwisko === lastName);

            const contextMessage = this.buildContextMessage(personDataList);
            await this.sendCompletionAndAnswer(taskResponse, contextMessage, authResponse.token);
        } else {
            console.log("Failed to match the first name and last name.");
        }
    }

    private async buildCompletionsResponse(taskResponse: TaskResponse, peoples: PeopleResponse[]): Promise<CompletionsResponse> {
        const messages: Message[] = [
            {
                content: `You should return only the first name and last name from the question`,
                role: RoleConstants.SYSTEM
            },
            {
                content: `${taskResponse.question}`,
                role: RoleConstants.USER
            }
        ];

        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model: ModelConstants.GPT_4,
            max_tokens: 500
        };

        return await OpenApi.completions(completionsRequest) as CompletionsResponse;
    }

    private buildContextMessage(people: PeopleResponse[]): string {
        return `Your answer is based on information in context
            context\`\`\`
            ${this.formatPeople(people)}`;
    }

    private formatPeople(people: PeopleResponse[]): string {
        return people.map(person => Object.entries(person)
            .map(([key, value]) => `${key}: ${value}`)
            .join(', '))
            .join('\n');
    }

    private async sendCompletionAndAnswer(taskResponse: TaskResponse, contextMessage: string, authToken: string): Promise<void> {
        const messages: Message[] = [
            {
                content: contextMessage,
                role: RoleConstants.SYSTEM
            },
            {
                content: `${taskResponse.question}`,
                role: RoleConstants.USER
            }
        ];

        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model: ModelConstants.GPT_4,
            max_tokens: 500
        };

        const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
        const answer: string = completionsResponse.choices[0].message.content;
        const answerRequest: AnswerRequest = { answer };
        await Answer.sendAnswer(answerRequest, authToken);
    }
}

export default TaskPeople;
