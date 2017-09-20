import Message from '../Message.js';
import MM4 from '../MM4.js';

export default class ScreenshotCtrl {
    constructor(request = {}, urlParams = {}, validator = {}) {
        this.validator = validator;
        this.accountId = urlParams.accountId;
        this.id = urlParams.id;
        this.params = request.__valid_params || {};
        this.astpp = request.__astpp;
        this.record = null;
        this.price = Meteor.GV.PRICING.mms.out;
    }

    insert() {
        let p = this.params;
        if(validator = this.validator.post) {
            const v = Meteor.UTILS.joiValidate(p, validator());
            if(!v.valid) return {
                success: false,
                data: v.data
            };

            p = v.data;
        }

        const billable = this.astpp.checkBalance(this.price);
        if(!billable.success) return billable;

        let record = new Message(p);
        record.account_id = this.accountId;
        const insert = record.insert();
        if(insert.success) {
            this.record = Message.getById(insert.data);
        }
        return insert;
    }

    send() {
        if(!this.record) return {
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
            path: Meteor.GV.UPLOAD_PATH
        };
        const body = record.body;
        send = Meteor._SERVER.smtpSend(from, to, originator, att, body, MM4.getHost(), MM4.getPort());

        if(send.success) {
           record.result = {internalId: send.data};
           record.price = this.price;
           record.update();

           this.astpp.accountCharge(this.price);

           const app = this.astpp.didApp(record.from);
           if(!app.success) return send;

           if(app.data.msg_url || app.data.msg_fb_url) {
               const v = record.getValues();
               delete v.result;
               Meteor.SERVER.processRequestUrl(v, app.data.msg_url, app.data.msg_method, app.data.msg_fb_url, app.data.msg_fb_method);
           }
        }

        return send;
    }
}
