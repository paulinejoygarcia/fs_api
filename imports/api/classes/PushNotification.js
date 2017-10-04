
const apiUrl = 'https://fcm.googleapis.com/fcm/';

export default class PushNotification {
    constructor(server_key, registration_id) {
        this.server_key = server_key;
        this.registration_id = registration_id;
    }
    sendNotif(json){
        console.log(json.action);
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
        if(result.statusCode === 200) {
            let pp = JSON.parse(result.data);
            if(pp.success) {
                return {
                    success: true,
                    data: pp.results[0]
                };
            }
            return {
                success: false,
                data: pp.results[0]['error']
            };
        }
        return {
            success: false,
            data: 'Unable to send notification'
        };
    }

}