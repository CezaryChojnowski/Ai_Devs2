import Auth from "../../core/Auth";
import Task from "../..//core/Task";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import TaskSolver from "../TaskSolver";
import OpenApi from "../../core/OpenApi";
import ModerationResponse from "../../model/moderation/ModerationResponse";
import AnswerRequest from "../../model/AnswerRequest";
import Answer from "../../core/Answer";
import ModerationRequest from "../../model/moderation/ModerationRequest";
import TaskDirections from "../../enum/TaskDirections";

const TASK_NAME = TaskDirections.MODERATION;

class TaskModeration implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse;
        let request: ModerationRequest = {
            input: taskResponse.input
        }
        const resultOfModeration = await OpenApi.moderation(request) as ModerationResponse;
        let flaggedModeration: boolean[] = resultOfModeration.results.map(result => result.flagged)
        const answerRequest: AnswerRequest = {
            answer: flaggedModeration
        };
        console.log(answerRequest)
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskModeration;