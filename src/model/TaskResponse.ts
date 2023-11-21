export default interface TaskResponse {
    code: number;
    msg: string;
    cookie?: string;
    input?: any;
    blog?: any;
    question?: string;
    answer?: string;
    'database #1'?:string;
    'database #2'?:string;
    hint?: string;
    data?: string;
}