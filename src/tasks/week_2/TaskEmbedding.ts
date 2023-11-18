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

const TASK_NAME = TaskDirections.EMBEDDING;

class TaskEmbedding implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        console.log(taskResponse)
        const phrase: string = "Hawaiian pizza"

        const embeddingsRequest : EmbeddingsRequest = {
            input: phrase,
            model: ModelConstants.TEXT_EMBEDDING_ADA_202
        }
        const embeddingsResponse = await OpenApi.embeddings(embeddingsRequest) as EmbeddingsResponse;
        const answerRequest: AnswerRequest = {
            answer: embeddingsResponse.data[0].embedding
        }
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskEmbedding;