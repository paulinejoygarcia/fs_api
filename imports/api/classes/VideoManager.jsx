import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import Message from './Message.js';
import MM4 from './MM4';

export default class VideoManager {
    constructor(accountId, smtpSend, smppSend, isAccountBillable, updateAccountBalance, didAccountOwner, processRequestUrl) {
        this.accountId = accountId;
        this.didAccountOwner = didAccountOwner;
        this.isAccountBillable = isAccountBillable;
        this.processRequestUrl = processRequestUrl;
        this.smtpSend = smtpSend;
        this.smppSend = smppSend;
        this.updateAccountBalance = updateAccountBalance;
        this.price = Meteor.settings.pricing.mms.out;
        this.json = {
            _id: null,
            status: 0,
            price: 0,
            direction: "",
            body: "",
            from: "",
            result: null,
            message_id: null,
            attachment: null,
            to: "",
            account_id: accountId || null,
            created_dt: moment().valueOf()
        };
        this.partial = {
            to: '',
            from: '',
            body: '',
            attachment: null
        }
    }

    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }

    parsePartial(json) {
        this.partial = {
            ...this.partial,
            ...json
        };
    }

    flush() {
        let record = new Message(this.partial);
        record.account_id = this.accountId;
        const insert = record.insert();
        if (insert.success) {
            this.parseJSON(Message.getById(insert.data));
            return {
                success: true,
                data: insert.data
            };
        }
        return insert;
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

    send() {
        if (!this.json) return {
            success: false,
            data: 'Message record not found'
        };

        const record = this.json;
        let send = {
            success: false,
            data: 'Failed sending message'
        };

        const from = MM4.getSender(record.from);
        const to = MM4.getRcpt(record.to);
        const originator = MM4.getOriginator(record.from);
        const a = record.attachment;
        const att = {
            filename: a.filename,
            type: a.mime_type.split('/')[0],
            contentType: a.mime_type,
            path: PATH.UPLOAD + a.filename
        };
        const body = record.body;
        send = this.smtpSend(from, to, originator, att, body, MM4.getHost(), MM4.getPort());

        if (send.success) {
            record.result = { internalId: send.data };
            record.price = this.price;
            record.update();
            if (!this.isAccountBillable(this.price)) {
                return {
                    success: false,
                    code: 400,
                    error: 'Insufficient funds'
                };
            }
            this.updateAccountBalance(this.price);

            const app = this.didAccountOwner(record.from);
            if (!app.success) return send;

            if (app.data.msg_url || app.data.msg_fb_url) {
                const v = record.getValues();
                delete v.result;
                this.processRequestUrl(v, app.data.msg_url, app.data.msg_method, app.data.msg_fb_url, app.data.msg_fb_method);
            }
        }

        return send;
    }
}
