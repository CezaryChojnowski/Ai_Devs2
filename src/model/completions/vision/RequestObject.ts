import Message from "../vision/Message";

export interface RequestObject {
    model: string;
    messages: Message[];
    max_tokens: number;
    [key: string]: any;
  }