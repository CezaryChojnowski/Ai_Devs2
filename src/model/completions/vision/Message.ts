import { ContentItem } from "./ContentItem";

export default interface Message {
    role: string;
    content: ContentItem[];
    [key: string]: any;
  }