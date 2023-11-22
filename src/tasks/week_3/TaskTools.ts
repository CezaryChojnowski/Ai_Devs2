import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import OpenApi from "../../core/OpenApi";
import EmbeddingsRequest from "../../model/embeddings/EmbeddingsRequest";
import EmbeddingsResponse from "../../model/embeddings/EmbeddingsResponse";
import { ModelConstants } from '../../model/conts/ModelConstants'
import TaskDirections from "../../enum/TaskDirections";
import Message from "../../model/completions/Message";
import { RoleConstants } from "../../model/conts/RoleConstants";
import CompletionsRequest from "../../model/completions/CompletionsRequest";
import CompletionsResponse from "../../model/completions/CompletionsResponse";

const TASK_NAME = TaskDirections.TOOLS;

class TaskTools implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const messages: Message[] = [
            {
                content: `
                context\`\`\`
                - ${taskResponse.hint},
                - today is wednesday 22.11.2023
                - you are always response json object without root {"tool":"ToDo","desc":"Kup mleko" } for ToDo, or {"tool":"Calendar","desc":"Spotkanie z Marianem","date":"2023-11-23"} for Calendar
                example\'\'\'
                - ${taskResponse["example for Todo"]},
                - ${taskResponse["example fo Calendar"]}`,
                role: RoleConstants.SYSTEM
            },
            {
                content: taskResponse.question,
                role: RoleConstants.USER
            }
        ];

        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model: ModelConstants.GPT_4,
            max_tokens: 500
        };

        const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
        const answerRequest: AnswerRequest = {
            answer: JSON.parse(completionsResponse.choices[0].message.content.replace("'","").replace("\n",""))
        }
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskTools;