"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var Auth = /** @class */ (function () {
    function Auth() {
    }
    Auth.authorize = function (taskName) {
        var authRequest = {
            apikey: process.env.API_KEY
        };
        return fetch('https://zadania.aidevs.pl/token/' + taskName, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify(authRequest)
        }).then(function (data) {
            return data.json();
        }).catch(function (error) {
            console.log(error);
            return error;
        });
    };
    return Auth;
}());
exports.default = Auth;
