import Message from '../Message.js';
import MM4 from '../MM4.js';

export default class ScreenshotCtrl {
    constructor(db, params = {}, accoundId, send, smppSend, processRequestUrl, updateAccountBalance, isAccountBillable, getAccountBalance, didAccountOwner, id = null) {
        this.databaseConnection = db;
        this.params = params;
        this.accountId = accoundId;
        this.id = id;
        this.record = null;
        this.user = null;
        this.smtpSend = send;
        this.didAccountOwner = didAccountOwner;
        this.chargeBalance = updateAccountBalance;
        this.isAccountBillable = isAccountBillable;
        this.getAccountBalance = getAccountBalance;
        this.processRequestUrl = processRequestUrl;
        this.price = Meteor.settings.pricing.mms.out;
    }

    insert() {
        let p = this.params;
        if (!this.getAccountBalance > this.price)
            return {
                success: false,
                code: 400,
                data: 'Insufficient funds'
            };
        let record = new Message(p);
        record.account_id = this.accountId;
        const insert = record.insert();
        if (insert.success) {
            this.record = Message.getById(insert.data);
        }
        return insert;
    }

    send() {
        if (!this.record) return {
            success: false,
            data: 'Message record not found'
        };

        const record = this.record;
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
            path: PATH.UPLOAD
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
            this.chargeBalance(this.price);

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