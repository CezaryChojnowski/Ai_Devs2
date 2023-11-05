import 'dotenv/config'
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
}
export default OpenApi