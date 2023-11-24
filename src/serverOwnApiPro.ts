import OpenApi from "./core/OpenApi";
import CompletionsRequest from "./model/completions/CompletionsRequest";
import CompletionsResponse from "./model/completions/CompletionsResponse";
import Message from "./model/completions/Message";
import OwnApiRequest from "./model/ownapi/OwnApiRequest";
import OwnApiResponse from "./model/ownapi/OwnApiResponse";
import { config } from "dotenv";
import * as express from 'express';
import { Request, Response } from 'express';
import { RoleConstants } from "../src/model/conts/RoleConstants";
import { ModelConstants } from "../src/model/conts/ModelConstants";
import * as https from 'https';
import * as fs from 'fs';

class ConversationHandler {
  private app: express.Application;
  private PORT: number;
  private httpsServer: https.Server;
  private conversationState: { [key: string]: { [key: string]: string } };

  constructor() {
    config();
    this.app = express();
    this.app.use(express.json());
    this.PORT = process.env.PORT ? parseInt(process.env.PORT) : 40062;
    this.conversationState = {};

    const privateKey = fs.readFileSync('klucz-prywatny.pem', 'utf8');
    const certificate = fs.readFileSync('certyfikat.pem', 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    this.httpsServer = https.createServer(credentials, this.app);
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.app.post("/", this.handleConversation.bind(this));
  }

  private async handleConversation(req: Request<{}, {}, OwnApiRequest>, res: Response<OwnApiResponse>): Promise<void> {
    const conversationId = req.body.conversationId;
    const question = req.body.question;
    console.log(`Received question in conversation ${conversationId}: ${question}`);

    const conversationMemory = this.conversationState[conversationId] || {};

    const messages: Message[] = [
      {
        content: `You answer questions`,
        role: RoleConstants.SYSTEM
      },
      {
        content: question,
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

        conversationMemory[question] = answer;
        this.conversationState[conversationId] = conversationMemory;

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

  public startServer(): void {
    this.httpsServer.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}

const conversationHandler = new ConversationHandler();
conversationHandler.startServer();
