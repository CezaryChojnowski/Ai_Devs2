import TaskDirections from "./enum/TaskDirections";
import TaskBlogger from "./tasks/week_1/TaskBlogger";
import TaskHelloApi from "./tasks/week_1/TaskHelloApi";
import TaskModeration from "./tasks/week_1/TaskModeration";
import TaskSolver from "./tasks/TaskSolver";
import TaskLiar from "./tasks/week_1/TaskLiar";
import TaskInprompt from "./tasks/week_2/TaskInprompt";
import TaskEmbedding from "./tasks/week_2/TaskEmbedding";
import TaskWhisper from "./tasks/week_2/TaskWhisper";
import TaskFunctions from "./tasks/week_2/TaskFunctions";
import TaskRodo from "./tasks/week_3/TaskRodo";
import TaskScraper from "./tasks/week_3/TaskScraper";
import TaskKnowledge from "./tasks/week_4/TaskKnowledge";
import TaskWhoami from "./tasks/week_3/TaskWhoami";
import TaskPeople from "./tasks/week_3/TaskPeople";
import TaskTools from "./tasks/week_3/TaskTools";

class TaskChooserConfig{
    preparteTasksConfig(){
        return new Map<TaskDirections, TaskSolver>([
            [TaskDirections.BLOGGER, new TaskBlogger],
            [TaskDirections.HELLO_API, new TaskHelloApi],
            [TaskDirections.MODERATION, new TaskModeration],
            [TaskDirections.LIAR, new TaskLiar],
            [TaskDirections.INPROMPT, new TaskInprompt],
            [TaskDirections.EMBEDDING, new TaskEmbedding],
            [TaskDirections.WHISPER, new TaskWhisper],
            [TaskDirections.FUNCTIONS, new TaskFunctions],
            [TaskDirections.RODO, new TaskRodo],
            [TaskDirections.SCRAPER, new TaskScraper],
            [TaskDirections.KNOWLEDGE, new TaskKnowledge()],
            [TaskDirections.WHOAMI, new TaskWhoami()],
            [TaskDirections.PEOPLE, new TaskPeople()],
            [TaskDirections.TOOLS, new TaskTools()]
        ]);
    }
}
export default TaskChooserConfig