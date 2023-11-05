import Auth from "../core/Auth";
import Task from "../core/Task";
import AuthResponse from "../model/AuthResponse";
import TaskResponse from "../model/TaskResponse";
import TaskSolver from "./TaskSolver";
import CompletionsRequest from "../model/completions/CompletionsRequest";
import Message from "../model/completions/Message";
import Answer from "../core/Answer";
import OpenApi from "../core/OpenApi";
import CompletionsResponse from "../model/completions/CompletionsResponse";
import AnswerRequest from "../model/AnswerRequest";
const TASK_NAME = "blogger";

class TaskBlogger implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse;
        const messages : Message[] = [{
            content: `Prepare one JSON file with blog text based to every one given chapter title. 
            JSON should be array of string. Every one element in array will be chapter text. 
            JSON object should not have root object. As input, you will receive chapter titles separated by a comma.
            For each chapter title, write the blog text and write it on the board. From result remove title of chapter. 
            Every one chapter should have maximum 50 words.
            example\`\`\`
            ['chapter 1','chapter 2','chapter 3','chapter 4]`,
            role:"system"
        },
        {
            content: taskResponse.blog.join(",\n"),
            role:"user"
        }];
        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model:"gpt-3.5-turbo",
            max_tokens:3000
        };
        const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
        const answerRequest: AnswerRequest = {
            answer: JSON.parse(completionsResponse.choices[0].message.content.replace("'","").replace("\n",""))
        }
        const answerResponse = await Answer.sendAnswer(answerRequest, authResponse.token);
    }
}
export default TaskBlogger;
