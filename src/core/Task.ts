class Task {
    static getTask(uuid: string) {

        return fetch('https://zadania.aidevs.pl/task/' + uuid, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
            },
        }).then(data => {
            return data.json();
        }).catch(error => {
            console.log(error);
            return error;
        })
    }
}

export default Task