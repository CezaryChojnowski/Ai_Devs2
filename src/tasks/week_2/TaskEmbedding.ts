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

const TASK_NAME = 'embedding';
class TaskEmbedding implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        console.log(taskResponse)
        const phrase: string = "Hawaiian pizza"

        const embeddingsRequest : EmbeddingsRequest = {
            input: phrase,
            model:"text-embedding-ada-002"
        }
        const embeddingsResponse = await OpenApi.embeddings(embeddingsRequest) as EmbeddingsResponse;
        console.log(embeddingsResponse)
        const answerRequest: AnswerRequest = {
            answer: embeddingsResponse.data[0].embedding
        }
        console.log(answerRequest)
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskEmbedding;