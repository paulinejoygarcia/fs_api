import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { PushNotifDB } from '../pushNotifications';

export default class PushNotifManager {
    constructor(body) {
        this.json = {
            server_key: body.server_key || null,
            registration_id: body.registration_id || null,
            title: body.title,
            body: body.body,
            icon: body.icon || '',
            click_action: body.action || '',
            priority: body.priority || 10,
            createdTimestamp: moment().valueOf(),
            price:0,
            result:""
        };
        this.apiUrl = 'https://fcm.googleapis.com/fcm/';
        this.isSet = false;
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }
    sendNotif(){
        let params = {
            to: this.json.registration_id,
            notification: {
                title: this.json.title,
                body: this.json.body,
                icon: this.json.icon || '',
                click_action: this.json.action || ''
            },
            priority: this.json.priority || 10
        };
        let result = Util.httpRequest(this.apiUrl + 'send', 'POST', null, params, {
            'Content-Type': 'application/json',
            Authorization: 'key=' + this.json.server_key
        });
        if(JSON.parse(result.data) && JSON.parse(result.data).results && JSON.parse(result.data).results[0].error)
            return {
                success: false,
                data: JSON.parse(result.data).results[0].error
            };
        return {
            success: true,
            data: JSON.parse(result.data.results[0])
        };
    }
    setPrice(price){
        this.json.price = parseFloat(price) || 0;
    }
    setResult(result) {
        this.json.result = result;
    }
    hasPost() {
        return this.isSet;
    }
    flush() {
        if (this.json._id) {
            if (PushNotifDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = PushNotifDB.insert(this.json));
    }
}
