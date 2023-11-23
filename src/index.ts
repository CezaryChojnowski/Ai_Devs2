import OpenApi from "./core/OpenApi";
import TaskDirections from "./enum/TaskDirections";
import CompletionsRequest from "./model/completions/CompletionsRequest";
import CompletionsResponse from "./model/completions/CompletionsResponse";
import Message from "./model/completions/Message";
import OwnApiRequest from "./model/ownapi/OwnApiRequest";
import OwnApiResponse from "./model/ownapi/OwnApiResponse";
import TaskChooserConfig from "./TaskChooserConfig";
import {config} from "dotenv"
import * as express from 'express';
import { Request, Response } from 'express';

config()
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 40062;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

app.post("/", async (req: Request<{}, {}, OwnApiRequest>, res: Response<OwnApiResponse>) => {
    const questions = req.body.question.join(" ");
    console.log(questions)
    const messages: Message[] = [
        {
            content: `You answer questions`,
            role: "system"
        },
        {
            content: questions,
            role: "user"
        }
    ];

    const completionsRequest: CompletionsRequest = {
        messages: messages,
        model: "gpt-4",
        max_tokens: 500
    };

    try {
      console.log(completionsRequest)
        const completionsResponse = await OpenApi.completions(completionsRequest) as CompletionsResponse;
        console.log(completionsResponse.choices[0])
        console.log(completionsResponse.choices[0].message)
        console.log(completionsResponse.choices[0].message.content)
        if (completionsResponse.choices && completionsResponse.choices.length > 0) {
          const answer = completionsResponse.choices[0].message.content;
      
          const apiResponse: OwnApiResponse = {
            reply: answer,
          };
          console.log(apiResponse)
          res.json(apiResponse);
        } else {
          res.status(404).json({ error: 'No choices available' });
        }
      } catch (error) {
        console.error('Error during API call:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    })

const taskChooserConfig = new TaskChooserConfig;

function solveTask(){
    const taskDirection = process.argv[2] as TaskDirections;
    const tasksConfig = taskChooserConfig.preparteTasksConfig();
    const solver = tasksConfig.get(taskDirection);
    if(solver != undefined){
        solver.solve();
    }
}





