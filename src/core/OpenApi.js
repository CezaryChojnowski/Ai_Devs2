"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var OpenApi = /** @class */ (function () {
    function OpenApi() {
    }
    OpenApi.moderation = function (moderationRequest) {
        return fetch('https://api.openai.com/v1/moderations', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + process.env.OPENAI_API_KEY,
            },
            body: JSON.stringify(moderationRequest)
        }).then(function (data) {
            return data.json();
        }).catch(function (error) {
            console.log(error);
            return error;
        });
    };
    OpenApi.completions = function (completionsRequest) {
        return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + process.env.OPENAI_API_KEY,
            },
            body: JSON.stringify(completionsRequest)
        }).then(function (data) {
            return data.json();
        }).catch(function (error) {
            console.log(error);
            return error;
        });
    };
    return OpenApi;
}());
exports.default = OpenApi;
