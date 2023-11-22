import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";
import RenderFormData from "../../model/RenderFormData";
import RenderResponse from "../../model/RenderResponse";
import AnswerResponse from "../../model/AnswerResponse";

const TASK_NAME = TaskDirections.MEME;

class TaskMeme implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const templateId = "funny-bookworms-stumble-promptly-1600";
        const formData: RenderFormData = {
        template: templateId,
        data: {
            'title.text': `${taskResponse.text}`,
            'image.src': `${taskResponse.image}`,
        },
        };
        this.renderForm(process.env.RENDER_FORM_API_KEY, templateId, formData)
        .then(async (result) => {
            const answerRequest: AnswerRequest = {
                answer: result.href
            }
            console.log(answerRequest)
            let answer = await Answer.sendAnswer(answerRequest, authResponse.token) as AnswerResponse;
            console.log(answer)
        })
        .catch((error) => {
            console.error('Error during render:', error);
        });
    }

    async renderForm(apiKey: string, templateId: string, formData: RenderFormData): Promise<any> {
        const url = 'https://get.renderform.io/api/v2/render';
      
        const requestOptions: RequestInit = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': apiKey,
          },
          body: JSON.stringify(formData),
        };
      
        try {
          const response = await fetch(url, requestOptions);
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          const responseData = await response.json() as RenderResponse;
          return responseData;
        } catch (error) {
          console.error('Error:', error);
          throw error;
        }
      }
}
export default TaskMeme;