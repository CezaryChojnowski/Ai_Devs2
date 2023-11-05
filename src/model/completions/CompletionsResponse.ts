import CompletionsChoise from "./CompletionsChoise";

export default interface CompletionsResponse {
    array: any;
    choices: CompletionsChoise[];
}