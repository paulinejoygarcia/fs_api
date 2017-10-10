import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import MM4 from './MM4';
import { MessageDB } from '../message';
export default class VideoManager {
    constructor(accountId, from, to, message, direction, attachment) {
        this.accountId = accountId;
        this.price = Meteor.settings.pricing.mms.out;
        this.json = {
            status: 0,
            price: 0,
            from: from || '',
            to: to || '',
            body: message || '',
            direction: direction == 'outbound' ? 'outbound' : 'inbound',
            attachment: attachment || null,
            result: null,
            message_id: '',
            account_id: accountId || null,
            created_dt: moment().valueOf()
        };
    }
    getPrice(){
        return this.price;
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }

    flush() {
        if (this.json._id) {
            if (MessageDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = MessageDB.insert(this.json));
    }
    checkBalance() {
        if (!this.isAccountBillable(this.price))
            return {
                success: false,
                code: 400,
                error: 'Insufficient funds'
            };
        return {
            success: true
        }
    }
}
