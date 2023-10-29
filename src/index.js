"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskModeration_1 = require("./tasks/TaskModeration");
function solveTask() {
    var taskModeration = new TaskModeration_1.default();
    taskModeration.solve().then(function (response) { return console.log(response); });
}
solveTask();
