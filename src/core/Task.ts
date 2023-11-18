class Task {
    static getTask(uuid: string): Promise<any>;
    static getTask(uuid: string, question: string): Promise<any>;
  
    static getTask(uuid: string, question?: string): Promise<any> {
      if (question) {
        const formData = new FormData();
        formData.append('question', question);
  
        return fetch('https://zadania.aidevs.pl/task/' + uuid, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
          },
          body: formData,
        })
          .then((data) => data.json())
          .catch((error) => {
            console.log(error);
            return error;
          });
      } else {
        return fetch('https://zadania.aidevs.pl/task/' + uuid, {
          method: 'GET',
          headers: {
            Accept: 'application/json',
          },
        })
          .then((data) => data.json())
          .catch((error) => {
            console.log(error);
            return error;
          });
      }
    }
  }
  
  export default Task;