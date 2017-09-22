import Util from './Utilities';

let apiUrl = 'https://fcm.googleapis.com/fcm/';

export default class Fcm {
    constructor(serverKey, registrationId) {
        let self = this;
        self.serverKey = serverKey;
        self.registrationId = registrationId;
    }

    sendNotification(title, body, icon, action, priority) {
        let params = {
            to: this.registrationId,
            notification: {
                title: title,
                body: body,
                icon: icon || '',
                click_action: action || ''
            },
            priority: priority || 10
        };

        let res = Util.httpRequest(apiUrl + 'send', 'POST', null, params, {
            'Content-Type': 'application/json',
            Authorization: 'key=' + this.serverKey
        });

        if (res.statusCode == 200) {
            let pp = JSON.parse(res.data);
            if (pp.success) {
                return {
                    success: true,
                    data: pp.results[0]['message_id']
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