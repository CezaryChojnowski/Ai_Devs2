"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Auth_1 = require("../core/Auth");
var Task_1 = require("../core/Task");
var Answer_1 = require("../core/Answer");
var OpenApi_1 = require("../core/OpenApi");
var TASK_NAME = "blogger";
var TaskBlogger = /** @class */ (function () {
    function TaskBlogger() {
    }
    TaskBlogger.prototype.solve = function () {
        return __awaiter(this, void 0, void 0, function () {
            var authResponse, taskResponse, messages, completionsRequest, completionsResponse, answerRequest, answerResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, Auth_1.default.authorize(TASK_NAME)];
                    case 1:
                        authResponse = _a.sent();
                        return [4 /*yield*/, Task_1.default.getTask(authResponse.token)];
                    case 2:
                        taskResponse = _a.sent();
                        console.log(taskResponse);
                        messages = [{
                                content: "Prepare one JSON file with blog text based to every one given chapter title. \n            JSON should be array of string. Every one element in array will be chapter text. \n            JSON object should not have root object. As input, you will receive chapter titles separated by a comma.\n            For each chapter title, write the blog text and write it on the board. From result remove title of chapter. \n            Every one chapter should have maximum 50 words.\n            example```\n            ['chapter 1','chapter 2','chapter 3','chapter 4]",
                                role: "system"
                            },
                            {
                                content: taskResponse.blog.join(",\n"),
                                role: "user"
                            }];
                        console.log(messages);
                        completionsRequest = {
                            messages: messages,
                            model: "gpt-3.5-turbo",
                            max_tokens: 3000
                        };
                        console.log("Completions request");
                        console.log(completionsRequest);
                        return [4 /*yield*/, OpenApi_1.default.completions(completionsRequest)];
                    case 3:
                        completionsResponse = _a.sent();
                        console.log("Completions choise");
                        console.log(completionsResponse.choices[0].message);
                        answerRequest = {
                            answer: JSON.parse(completionsResponse.choices[0].message.content.replace("'", "").replace("\n", ""))
                        };
                        console.log("Answer request");
                        console.log(answerRequest);
                        return [4 /*yield*/, Answer_1.default.sendAnswer(answerRequest, authResponse.token)];
                    case 4:
                        answerResponse = _a.sent();
                        console.log(answerResponse);
                        return [2 /*return*/];
                }
            });
        });
    };
    return TaskBlogger;
}());
exports.default = TaskBlogger;
