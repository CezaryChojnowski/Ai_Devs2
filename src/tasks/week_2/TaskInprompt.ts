import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import Message from "../../model/completions/Message";
import CompletionsRequest from "../../model/completions/CompletionsRequest";
import OpenApi from "../../core/OpenApi";
import CompletionsResponse from "../../model/completions/CompletionsResponse";
import { ModelConstants } from '../../model/conts/ModelConstants'
import TaskDirections from "../../enum/TaskDirections";
import { RoleConstants } from '../../model/conts/RoleConstants'

const TASK_NAME = TaskDirections.INPROMPT
const regexToRemoveNonAlphabetic = /[^a-zA-Z]/g;

class TaskInprompt implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        let firstName = taskResponse.question.split(' ').pop().replace(regexToRemoveNonAlphabetic, '');
        const sentenceWithFirstName: string[] = taskResponse.input.filter((fact) =>
            fact.toLowerCase().includes(firstName.toLowerCase())
        );

        const messages : Message[] = [{
            content: `You answer the question asked without unnecessary comments.
            context\`\`\`
            ${sentenceWithFirstName}`,
            role: RoleConstants.SYSTEM
        },
        {
            content: taskResponse.question,
            role: RoleConstants.USER
        }];
        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model: ModelConstants.GPT_3_5_TURBO,
            max_tokens:500
        };
        const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
        const answerRequest: AnswerRequest = {
            answer: completionsResponse.choices[0].message.content
        }
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskInprompt;