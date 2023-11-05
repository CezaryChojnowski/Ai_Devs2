"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TaskDirections_1 = require("./enum/TaskDirections");
var TaskBlogger_1 = require("./tasks/TaskBlogger");
var TaskHelloApi_1 = require("./tasks/TaskHelloApi");
var TaskModeration_1 = require("./tasks/TaskModeration");
var TaskChooserConfig = /** @class */ (function () {
    function TaskChooserConfig() {
    }
    TaskChooserConfig.prototype.preparteTasksConfig = function () {
        return new Map([
            [TaskDirections_1.default.BLOGGER, new TaskBlogger_1.default],
            [TaskDirections_1.default.HELLO_API, new TaskHelloApi_1.default],
            [TaskDirections_1.default.MODERATION, new TaskModeration_1.default]
        ]);
    };
    return TaskChooserConfig;
}());
exports.default = TaskChooserConfig;
