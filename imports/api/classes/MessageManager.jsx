import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';
import MM4 from './MM4';
import { MessageDB } from '../message';

export default class MessageManager {
    constructor(accountId, isAccountBillable, updateAccountBalance) {
        this.accountId = accountId;
        this.didApp = server.didApp;
        this.isAccountBillable = isAccountBillable;
        this.processRequestUrl = server.processRequestUrl;
        this.smtpSend = server.smtpSend;
        this.smppSend = server.smppSend;
        this.updateAccountBalance = updateAccountBalance;
        this.price = 0;
        this.json = {
            status: 0,
            price: 0,
            direction: "",
            body: "",
            from: "",
            result: null,
            message_id: null,
            attachment: null,
            to: "12345",
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

    flush() {
        if (this.json._id) {
            if (MessageDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = MessageDB.insert(this.json));
    }

    checkBalance() {
        if (this.json.attachment) {
            this.price = Meteor.settings.pricing.mms.out;
        } else {
            this.price = Meteor.settings.pricing.sms.out * Message.getParts(this.json.body || '');
        }
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

        if (a = record.attachment) {
            const from = MM4.getSender(record.from);
            const to = MM4.getRcpt(record.to);
            const originator = MM4.getOriginator(record.from);
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
            }
        } else {
            send = this.smppSend(record.from, record.to, record.body);
            if (send.success) {
                record.message_id = send.data;
                record.price = this.price;
                this.parseJSON(record);
                this.flush();
            }
        }

        if (send.success) {
            if (!this.isAccountBillable(this.price)) {
                return {
                    success: false,
                    code: 400,
                    error: 'Insufficient funds'
                };
            }
            this.updateAccountBalance(this.price, "debit");
            const app = this.didApp(this.accountId, record.from);

            if (!app.success) return send;

            if (app.data.msg_url || app.data.msg_fb_url) {
                const v = this.json;
                delete v._id;
                delete v.result;
                this.processRequestUrl(v, app.data.msg_url, app.data.msg_method, app.data.msg_fb_url, app.data.msg_fb_method);
            }
        }
        return send;
    }
}
