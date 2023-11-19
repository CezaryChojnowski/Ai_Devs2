import Auth from "../../core/Auth";
import Task from "../../core/Task";
import Answer from "../../core/Answer";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import AnswerRequest from "../../model/AnswerRequest";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";
import Message from "../../model/completions/Message";
import { RoleConstants } from "../../model/conts/RoleConstants";
import CompletionsRequest from "../../model/completions/CompletionsRequest";
import { ModelConstants } from "../../model/conts/ModelConstants";
import OpenApi from "../../core/OpenApi";
import CompletionsResponse from "../../model/completions/CompletionsResponse";

const TASK_NAME = TaskDirections.SCRAPER;

class TaskScraper implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const url = taskResponse.input;
        let responseStatus = 500;
        let html = ''
        do {
              const response = await fetch(url, {
                method: 'GET',
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                },
              });
              responseStatus = response.status
          
              if (responseStatus === 200) {
                html = await response.text();
              } else {
                console.warn(`Request failed with status ${response.status}`);
              }
          } while (responseStatus !== 200);
          const messages : Message[] = [{
            content: `${html}`,
            role: RoleConstants.SYSTEM
        },
        {
            content: taskResponse.question,
            role: RoleConstants.USER
        }];
        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model: ModelConstants.GPT_3_5_TURBO,
            max_tokens:500
        };
        const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
        const answerRequest: AnswerRequest = {
            answer: completionsResponse.choices[0].message.content
        }
        await Answer.sendAnswer(answerRequest, authResponse.token)
    }
}
export default TaskScraper;