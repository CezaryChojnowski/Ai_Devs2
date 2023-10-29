class Answer {
    static sendAnswer(answer: Object, taskUuid: string) {
        return fetch('https://zadania.aidevs.pl/answer/' + taskUuid, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            body: JSON.stringify(answer)
        }).then(data => {
            return data.json();
        }).catch(error => {
            console.log(error);
            return error;
        })
    }
}

export default Answer