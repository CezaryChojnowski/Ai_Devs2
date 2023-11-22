import Auth from "../../core/Auth";
import Task from "../../core/Task";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";
import { RoleConstants } from "../../model/conts/RoleConstants";
import OpenApi from "../../core/OpenApi";
import CompletionsResponse from "../../model/completions/CompletionsResponse";
import { ModelConstants } from "../../model/conts/ModelConstants";
import TextContent from "../../model/completions/vision/TextContent";
import ImageUrlContent from "../../model/completions/vision/ImageUrlContent";
import { RequestObject } from "../../model/completions/vision/RequestObject";
import Message from "../../model/completions/vision/Message";
import AnswerRequest from "../../model/AnswerRequest";
import Answer from "../../core/Answer";

const TASK_NAME = TaskDirections.GNOME;

class TaskGnome implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const textContent: TextContent = {
            type: 'text',
            text: `What is color of a gnome hat on his head?. As result return only color or "error" if dont be a drawing of a gnome.`,
          };
          
          const imageUrlContent1: ImageUrlContent = {
            type: 'image_url',
            image_url: {
              url: `${taskResponse.url}`,
            },
          };
          const message: Message = {
            role: RoleConstants.USER,
            content: [textContent, imageUrlContent1],
          };
          
          const completionsRequest: RequestObject = {
            model: ModelConstants.GPT_4_VISION_PREVIEW,
            messages: [message],
            max_tokens: 300,
          };
          const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
          const answerRequest: AnswerRequest = {
              answer: completionsResponse.choices[0].message.content
          }
          await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskGnome;