import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";

const TASK_NAME = TaskDirections.RODO;

class TaskRodo implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        let sentece = "Based on sentences you anonymize personal data. Use placeholder on personal information. When find first name use %imie% placeholder. When find last name use %nazwisko% placeholder. When find occupation name use %zawod% placeholder. When find city or agglomeration use %miasto% placeholder."
        const answerRequest: AnswerRequest = {
            answer: sentece
        }
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskRodo;