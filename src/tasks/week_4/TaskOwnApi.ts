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

const TASK_NAME = TaskDirections.OWNAPI;

class TaskOwnApi implements TaskSolver {
    async solve() {
        const authResponse = await Auth.authorize(TASK_NAME) as AuthResponse;
        const taskResponse = await Task.getTask(authResponse.token) as TaskResponse
        const answerRequest: AnswerRequest = { answer: "https://maluch2.mikr.us:40062/" };
        await Answer.sendAnswer(answerRequest, authResponse.token) as AnswerResponse;
        
    }
    async answerToQuestion(req: Request<{}, {}, OwnApiRequest>, res: Response<OwnApiResponse>) {
        const questions = req.body.question.join(" ");

        const messages: Message[] = [
            {
                content: `You answer questions`,
                role: RoleConstants.SYSTEM
            },
            {
                content: questions,
                role: RoleConstants.USER
            }
        ];

        const completionsRequest: CompletionsRequest = {
            messages: messages,
            model: ModelConstants.GPT_4,
            max_tokens: 500
        };

        try {
            const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
          
            if (completionsResponse.choices && completionsResponse.choices.length > 0) {
              const answer = completionsResponse.choices[0].message.content;
          
              const apiResponse: OwnApiResponse = {
                reply: answer,
              };
          
              res.json(apiResponse);
            } else {
              res.status(404).json({ error: 'No choices available' });
            }
          } catch (error) {
            console.error('Error during API call:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
        }
      }

export default TaskOwnApi;