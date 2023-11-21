import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import OpenApi from "../../core/OpenApi";
import EmbeddingsResponse from "../../model/embeddings/EmbeddingsResponse";
import { ModelConstants } from '../../model/conts/ModelConstants'
import TaskDirections from "../../enum/TaskDirections";

const TASK_NAME = TaskDirections.WHISPER;

class TaskWhisper implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const extractedLinkWithPathToFile = "mateusz.mp3"
        const transcriptionResponse = await OpenApi.transcriptions(extractedLinkWithPathToFile, ModelConstants.WHISPER) as EmbeddingsResponse;
        const answerRequest: AnswerRequest = {
            answer: transcriptionResponse
        }
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskWhisper;