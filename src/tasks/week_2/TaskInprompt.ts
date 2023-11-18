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

const TASK_NAME = "inprompt";
const regexToRemoveNonAlphabetic = /[^a-zA-Z]/g;
class TaskInprompt implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        let firstName = taskResponse.question.split(' ').pop().replace(regexToRemoveNonAlphabetic, '');
        const sentenceWithFirstName: string[] = taskResponse.input.filter((zdanie) =>
            zdanie.toLowerCase().includes(firstName.toLowerCase())
        );

        const messages : Message[] = [{
            content: `You answer the question asked without unnecessary comments.
            context\`\`\`
            ${sentenceWithFirstName}`,
            role:"system"
        },
        {
            content: taskResponse.question,
            role:"user"
        }];
        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model:"gpt-3.5-turbo",
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