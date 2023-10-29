import TaskHelloApi from "./tasks/TaskHelloApi";

function solveTask(){

    const taskHelloApi = new TaskHelloApi();
    taskHelloApi.solve().then(response => console.log(response));
}

solveTask();




