
const apiUrl = 'https://fcm.googleapis.com/fcm/';

export default class PushNotification {
    constructor(server_key, registration_id) {
        this.server_key = server_key;
        this.registration_id = registration_id;
    }
    sendNotif(json){
        let params = {
            to: this.registration_id,
            notification: {
                title: json.title,
                body: json.body,
                icon: json.icon || '',
                click_action: json.action || ''
            },
            priority: json.priority || 10
        };
        let result = Util.httpRequest(apiUrl + 'send', 'POST', null, params, {
            'Content-Type': 'application/json',
            Authorization: 'key=' + this.server_key
        });
        if(result.data){
            let parsedResult = JSON.parse(result.data);
            if(parsedResult && parsedResult.results && parsedResult.results[0].error)
                return {
                    success: false,
                    data: parsedResult.results[0].error
                };
        } else
            return {
                success: false,
                data: result
            };
        return {
            success: true,
            data: JSON.parse(result.data)?JSON.parse(result.data).results[0]:{}
        };
    }

}