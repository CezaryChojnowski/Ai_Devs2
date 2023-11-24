import Auth from "../../core/Auth";
import Task from "../../core/Task";
import AuthResponse from "../../model/AuthResponse";
import TaskResponse from "../../model/TaskResponse";
import TaskSolver from "../TaskSolver";
import OpenApi from "../../core/OpenApi";
import { ModelConstants } from '../../model/conts/ModelConstants'
import TaskDirections from "../../enum/TaskDirections";
import Message from "../../model/completions/Message";
import { RoleConstants } from "../../model/conts/RoleConstants";
import CompletionsRequest from "../../model/completions/CompletionsRequest";
import CompletionsResponse from "../../model/completions/CompletionsResponse";
import { Request, Response } from 'express';
import OwnApiRequest from "../../model/ownapi/OwnApiRequest";
import OwnApiResponse from "../../model/ownapi/OwnApiResponse";
import AnswerRequest from "../../model/AnswerRequest";
import Answer from "../../core/Answer";
import AnswerResponse from "../../model/AnswerResponse";

const TASK_NAME = TaskDirections.OWNAPIPRO;

class TaskOwnApiPro implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const answerRequest: AnswerRequest = { answer: "https://maluch2.mikr.us:40062/" };
        let answer = await Answer.sendAnswer(answerRequest, authResponse.token) as AnswerResponse;
        console.log(answer)
    }
}
export default TaskOwnApiPro;