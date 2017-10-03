import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import { PushNotifDB } from '../pushNotifications';

export default class PushNotifManager {
    constructor(body) {
        this.json = {
            title: body.title,
            body: body.body,
            icon: body.icon || '',
            click_action: body.action || '',
            priority: body.priority || 10,
            createdTimestamp: moment().valueOf(),
            price:0,
            result:""
        };
        this.isSet = false;
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
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
