import TaskDirections from "./enum/TaskDirections";
import TaskChooserConfig from "./TaskChooserConfig";

const taskChooserConfig = new TaskChooserConfig;

function solveTask(){
    const taskDirection = process.argv[2] as TaskDirections;
    const tasksConfig = taskChooserConfig.preparteTasksConfig();
    const solver = tasksConfig.get(taskDirection);
    if(solver != undefined){
        solver.solve();
    }
}

solveTask();




