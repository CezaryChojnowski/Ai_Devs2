import TaskDirections from "./enum/TaskDirections";
import TaskBlogger from "./tasks/week_1/TaskBlogger";
import TaskHelloApi from "./tasks/week_1/TaskHelloApi";
import TaskModeration from "./tasks/week_1/TaskModeration";
import TaskSolver from "./tasks/TaskSolver";
import TaskLiar from "./tasks/week_1/TaskLiar";

class TaskChooserConfig{
    preparteTasksConfig(){
        return new Map<TaskDirections, TaskSolver>([
            [TaskDirections.BLOGGER, new TaskBlogger],
            [TaskDirections.HELLO_API, new TaskHelloApi],
            [TaskDirections.MODERATION, new TaskModeration],
            [TaskDirections.LIAR, new TaskLiar]
        ]);
    }
}
export default TaskChooserConfig