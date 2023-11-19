import {AuthRequest} from "../model/AuthRequest";
import 'dotenv/config';

class Auth {
    static authorize(taskName: string){
        const authRequest: AuthRequest = {
            apikey: process.env.AI_DEVS_API_KEY
        };
        return fetch('https://zadania.aidevs.pl/token/' + taskName, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify(authRequest)
        }).then(data => {
            return data.json();
        }).catch(error => {
            console.log(error);
            return error;
        })
    }
}

export default Auth