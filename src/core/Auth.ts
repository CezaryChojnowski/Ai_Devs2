import {AuthRequest} from "../model/AuthRequest";
import 'dotenv/config'

class Auth {
    static authorize<AuthResponse>(taskName: string) : Promise<AuthResponse>{
        const authRequest: AuthRequest = {
            apikey: process.env.API_KEY
        };
        return fetch('https://zadania.aidevs.pl/token/' + taskName, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify(authRequest)
        }).then(data => {
            return data.json() as AuthResponse;
        }).catch(error => {
            console.log(error);
            return error;
        })
    }
}

export default Auth