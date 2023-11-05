import Message from "./Message";

export default interface CompletionsRequest {
    messages: Message[];
    model: string;
    max_tokens:number;
}