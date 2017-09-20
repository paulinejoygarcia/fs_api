import Message from '../Message.js';
import MM4 from '../MM4';

export default class MessageCtrl {
    constructor(request = {}, urlParams = {}, validator = {}) {
        this.validator = validator;
        this.accountId = urlParams.accountId;
        this.id = urlParams.id;
        this.params = request.__valid_params || {};
        this.astpp = request.__astpp;
        this.record = null;

        if(id = this.id) {
            const r = Message.getById(id);
            if(r) this.record = r;
        }

        if(this.params.attachment) {
            this.price = Meteor.GV.PRICING.mms.out;
        } else {
            this.price = Meteor.GV.PRICING.sms.out * Message.getParts(this.params.body || '');
        }
    }

    list() {
        if(this.id) {
            if(r = this.record) return {
                success: true,
                data: r.getValues()
            };
            else return {
                success: false,
                data: 'Message record not found'
            };
        }

        const records = Message.getAll({
            account_id: this.accountId,
        }, {
            sort: {created_dt: 1}
        });
        return records;
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

        if(a = record.attachment) {
            const from = MM4.getSender(record.from);
            const to = MM4.getRcpt(record.to);
            const originator = MM4.getOriginator(record.from);
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
            }
        } else {
            send = Meteor._SERVER.smppSend(record.from, record.to, record.body);
            if(send.success) {
                record.message_id = send.data;
                record.price = this.price;
                record.update();
            }
        }

        if(send.success) {
            this.astpp.accountCharge(this.price);

            const app = this.astpp.didApp(record.from);

            if(!app.success) return send;

            if(app.data.msg_url || app.data.msg_fb_url) {
                const v = record.getValues();
                delete v._id;
                delete v.result;
                Meteor.SERVER.processRequestUrl(v, app.data.msg_url, app.data.msg_method, app.data.msg_fb_url, app.data.msg_fb_method);
            }
        }


        return send;
    }
}
