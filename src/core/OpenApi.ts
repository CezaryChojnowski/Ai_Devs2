import 'dotenv/config'
import { readFileSync } from 'fs';

class OpenApi {

    static moderation(moderationRequest: Object) {
        return fetch('https://api.openai.com/v1/moderations', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + process.env.OPENAI_API_KEY,
            },
            body: JSON.stringify(moderationRequest)
        }).then(data => {
            return data.json();
        }).catch(error => {
            console.log(error);
            return error;
        })
    }
    
    static completions(completionsRequest: Object) {
        return fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + process.env.OPENAI_API_KEY,
            },
            body: JSON.stringify(completionsRequest)
        }).then(data => {
            return data.json();
        }).catch(error => {
            console.log(error);
            return error;
        })
    }

    static embeddings(embeddingsRequest: Object) {
        return fetch('https://api.openai.com/v1/embeddings', {
            method: 'POST',
            headers: {
                'content-type': 'application/json',
                Authorization: "Bearer " + process.env.OPENAI_API_KEY,
            },
            body: JSON.stringify(embeddingsRequest)
        }).then(data => {
            return data.json();
        }).catch(error => {
            console.log(error);
            return error;
        })
    }

    static transcriptions(pathToFile: string, model: string) {
        const formData = new FormData();
        formData.append('file', pathToFile);
        formData.append('model', model);
        formData.append('response_format', 'text');
        console.log(formData)
        return fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
                Authorization: "Bearer " + process.env.OPENAI_API_KEY,
                'Content-Type': 'multipart/form-data',
            },
            body: formData
        }).then(data => {
            return data.json();
        }).catch(error => {
            console.log(error);
            return error;
        })
    }
}
export default OpenApi