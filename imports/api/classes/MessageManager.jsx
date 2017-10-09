import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import MM4 from './MM4';
import { MessageDB } from '../message';
import splitSms from 'split-sms';
export default class MessageManager {
    constructor(accountId, from, to, message, direction, attachment) {
        this.json = {
            from: from || '',
            to: to || '',
            body: message || '',
            direction: direction == 'outbound' ? 'outbound' : 'inbound',
            attachment: attachment || null,
            status: 0,
            price: 0,
            result: null,
            internal_id: '',
            message_id: '',
            account_id: accountId || null,
            created_dt: moment().valueOf()
        };
    }

    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }

    calculatePrice() {
        if (this.json.attachment) {
            switch (this.json.direction) {
                case 'inbound':
                    this.json.price = Meteor.settings.pricing.mms.in || 0.01;
                    break;
                case 'outbound':
                    this.json.price = Meteor.settings.pricing.mms.out || 0.01;
                    break;
            }
        } else {
            let smsParts = splitSms.split(this.json.body);
            switch (this.json.direction) {
                case 'inbound':
                    this.json.price = (Meteor.settings.pricing.sms.in || 0.001) * smsParts.parts.length;
                    break;
                case 'outbound':
                    this.json.price = (Meteor.settings.pricing.sms.out || 0.003) * smsParts.parts.length;
                    break;
            }
        }
        return this.json.price;
    }

    setInternalId(id) {
        this.json.internal_id = id;
    }

    setMessageId(id) {
        this.json.message_id = id;
    }

    setResult(result) {
        this.json.result = result;
    }

    toApiJson() {
        let json = {
            id: this.json._id._str,
            to: this.json.to,
            from: this.json.from,
            direction: this.json.direction,
            body: this.json.body,
            price: this.json.price,
            result: this.json.result,
            messageId: this.json.message_id,
            createdDt: moment(this.json.createdDt).format('YYYY-MM-DD HH:mm:ss')
        };
        if (this.json.attachment)
            json.attachment = this.json.attachment;

        return json;
    }

    flush() {
        if (this.json._id) {
            if (MessageDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = MessageDB.insert(this.json));
    }
}
