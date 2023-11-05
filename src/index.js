"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskChooserConfig_1 = require("./TaskChooserConfig");
var taskChooserConfig = new TaskChooserConfig_1.default;
function solveTask() {
    var taskDirection = process.argv[2];
    var tasksConfig = taskChooserConfig.preparteTasksConfig();
    var solver = tasksConfig.get(taskDirection);
    if (solver != undefined) {
        solver.solve();
    }
}
solveTask();
