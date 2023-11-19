import Auth from "../../core/Auth";
import Task from "../../core/Task";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";
import FlexibleFunction from "../../model/completions/function/FlexibleFunction";
import Property from "../../model/completions/function/Property";
import AnswerRequest from "../../model/AnswerRequest";
import Answer from "../../core/Answer";

const TASK_NAME = TaskDirections.FUNCTIONS;

class TaskFunctions implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        console.log(taskResponse)
        const functionObject = this.createFunctionObject("addUser", "Add user based on name, surname, and year of born", {
            name: {
              type: "string",
              description: "User name",
            },
            surname: {
              type: "string",
              description: "User surname",
            },
            year: {
              type: "number",
              description: "Year of born",
            },
          });
        const answerRequest: AnswerRequest = {
            answer: functionObject
        }
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
    private createFunctionObject(name: string, description: string, properties: Record<string, Property>): FlexibleFunction<any> {
        return {
          name,
          description,
          parameters: {
            type: "object",
            properties,
          },
        };
      }
}
export default TaskFunctions;