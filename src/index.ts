import TaskHelloApi from "./tasks/TaskHelloApi";
import TaskModeration from "./tasks/TaskModeration";

function solveTask(){

    const taskModeration = new TaskModeration();
    taskModeration.solve().then(response => console.log(response));
}

solveTask();




