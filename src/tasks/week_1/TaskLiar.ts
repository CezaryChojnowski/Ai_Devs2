import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";

const TASK_NAME = "liar";
class TaskLiar implements TaskSolver {
    async solve() {
        let question = "What is capital of Poland?"
        let checkAnswer = "answer is about Warsaw."
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token, `${question}. Return YES when ${checkAnswer}`) as TaskResponse
        const answerRequest: AnswerRequest = {
            answer: taskResponse.answer.includes("YES") ? "YES" : "NO"
        };
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskLiar;