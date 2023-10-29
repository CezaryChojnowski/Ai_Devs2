"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Task = /** @class */ (function () {
    function Task() {
    }
    Task.getTask = function (uuid) {
        return fetch('https://zadania.aidevs.pl/task/' + uuid, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then(function (data) {
            return data.json();
        }).catch(function (error) {
            console.log(error);
            return error;
        });
    };
    return Task;
}());
exports.default = Task;
