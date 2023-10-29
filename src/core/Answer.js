"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Answer = /** @class */ (function () {
    function Answer() {
    }
    Answer.sendAnswer = function (answer, taskUuid) {
        return fetch('https://zadania.aidevs.pl/answer/' + taskUuid, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify(answer)
        }).then(function (data) {
            return data.json();
        }).catch(function (error) {
            console.log(error);
            return error;
        });
    };
    return Answer;
}());
exports.default = Answer;
