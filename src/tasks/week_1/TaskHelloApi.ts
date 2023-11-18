import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";

const TASK_NAME = "helloapi";
class TaskHelloApi implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const answerRequest: AnswerRequest = {
            answer: taskResponse.cookie
        };
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskHelloApi;