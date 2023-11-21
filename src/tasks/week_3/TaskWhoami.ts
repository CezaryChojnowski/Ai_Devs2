import Auth from "../../core/Auth";
import Task from "../../core/Task";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import TaskSolver from "../TaskSolver";
import TaskDirections from "../../enum/TaskDirections";
import Message from "../../model/completions/Message";
import { RoleConstants } from "../../model/conts/RoleConstants";
import CompletionsRequest from "../../model/completions/CompletionsRequest";
import { ModelConstants } from "../../model/conts/ModelConstants";
import OpenApi from "../../core/OpenApi";
import AnswerRequest from "../../model/AnswerRequest";
import CompletionsResponse from "../../model/completions/CompletionsResponse";
import Answer from "../../core/Answer";

const TASK_NAME = TaskDirections.WHOAMI;
const USER_MESSAGE: string = "Guess who I am";
const SYSTEM_MESSAGE = "Return first name and last name described person. If you don't have whole confidence to you answer return 'HINT' number as answer. If you dont know person dont return unessesery comment and text, just return 'HINT' word"
class TaskWhoami implements TaskSolver {
    async solve() {
        let hints = ""
        let finish = false;
        
            do{
            const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
            const taskResponse = await Task.getTask(authResponse.token) as TaskResponse;
            hints += " " + taskResponse.hint;        
            const messages: Message[] = [
                {
                    content: `${SYSTEM_MESSAGE}
                    context\`\`\`
                    ${hints}
                    example\`\`\`
                    - if you know person for example : Johny Deep,
                    - if you dont know person : HINT`,
                    role: RoleConstants.SYSTEM
                },
                {
                    content: `${USER_MESSAGE}`,
                    role: RoleConstants.USER
                }
            ];
            const completionsRequest: CompletionsRequest = {
                messages: messages,
                model: ModelConstants.GPT_4,
                max_tokens: 500
            };

            const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
            let answer: string = completionsResponse.choices[0].message.content

            if(answer !== "HINT"){
                const answerRequest: AnswerRequest = { answer };
                await Answer.sendAnswer(answerRequest, authResponse.token)
                finish= true
            }
        }while(!finish)
    }
}

export default TaskWhoami;