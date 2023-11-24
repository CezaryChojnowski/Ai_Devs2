import OpenApi from "./core/OpenApi";
import CompletionsRequest from "./model/completions/CompletionsRequest";
import CompletionsResponse from "./model/completions/CompletionsResponse";
import Message from "./model/completions/Message";
import OwnApiRequest from "./model/ownapi/OwnApiRequest";
import OwnApiResponse from "./model/ownapi/OwnApiResponse";
import {config} from "dotenv"
import * as express from 'express';
import { Request, Response } from 'express';
import { RoleConstants } from "./model/conts/RoleConstants";
import { ModelConstants } from "./model/conts/ModelConstants";
import * as https from 'https';
import * as fs from 'fs';

config()
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 40062;

const privateKey = fs.readFileSync('klucz-prywatny.pem', 'utf8');
const certificate = fs.readFileSync('certyfikat.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

app.post("/", async (req: Request<{}, {}, OwnApiRequest>, res: Response<OwnApiResponse>) => {
    const questions = req.body.question;
    console.log(questions)
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
    })