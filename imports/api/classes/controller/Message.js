import Message from '../Message.js';
import MM4 from '../MM4';

export default class MessageCtrl {
    constructor(db, params ={}, accoundId, send, smppSend, processRequestUrl, updateAccountBalance, isAccountBillable, didAccountOwner, id = null) {
        this.databaseConnection = db;
        this.params = params;
        this.accountId = accoundId;
        this.id = id;
        this.record = null;
        this.smtpSend = send;
        this.smppSend = smppSend;
        this.processRequestUrl = processRequestUrl;
        this.updateAccountBalance = updateAccountBalance;
        this.isAccountBillable = isAccountBillable;
        this.didAccountOwner = didAccountOwner;
        this.user = null;
        if(id = this.id) {
            const r = Message.getById(id);
            if(r) this.record = r;
        }
        if(this.params.attachment) {
            this.price = Meteor.settings.pricing.mms.out;
        } else {
            this.price = Meteor.settings.pricing.sms.out * Message.getParts(this.params.body || '');
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
        let query = 'SELECT * FROM astpp.accounts WHERE number = ?';
        this.user = this.databaseConnection.selectOne(query, [this.accountId]);
        if(!this.user.balance > this.price)
            return {
                success: false,
                data: 'Insufficient funds'
            };

        let record = new Message(p);
        record.account_id = this.accountId;
        const insert = record.insert();
        console.log(insert);
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
            send = this.smtpSend(from, to, originator, att, body, MM4.getHost(), MM4.getPort());
            if(send.success) {
                record.result = {internalId: send.data};
                record.price = this.price;
                record.update();
            }
        } else {
            send = this.smppSend(record.from, record.to, record.body);
            if(send.success) {
                record.message_id = send.data;
                record.price = this.price;
                record.update();
            }
        }

        if(send.success) {
            let available_bal = (this.user.balance) + this.user.posttoexternal * (this.user.credit_limit);
            if(this.user)
                if (!available_bal >= this.price)
                    return {
                        success: false,
                        data: 'Insufficient funds'
                    };

            if(!this.isAccountBillable(this.price)){
                return {
                    success: false,
                    code: 400,
                    error: 'Insufficient funds'
                };
            }
            this.updateAccountBalance(this.price, "debit");
            const app = this.didAccountOwner(record.from);

            if(!app.success) return send;

            if(app.data.msg_url || app.data.msg_fb_url) {
                const v = record.getValues();
                delete v._id;
                delete v.result;
                this.processRequestUrl(v, app.data.msg_url, app.data.msg_method, app.data.msg_fb_url, app.data.msg_fb_method);
            }
        }
        return send;
    }
}
