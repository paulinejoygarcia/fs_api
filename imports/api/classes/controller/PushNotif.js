import PushNotification from '../../PushNotification';
import Fcm from '../../Fcm';

export default class PushNotifCtrl {
    constructor(request = {}, urlParams = {}, validator = {}) {
        this.validator = validator;
        this.accountId = urlParams.accountId;
        this.id = urlParams.id;
        this.params = request.__valid_params || {};
        this.astpp = request.__astpp;
        this.record = null;
        this.price = Meteor.GV.PRICING.push_notification;

        if(id = this.id) {
            const r = PushNotification.getById(id);
            if(r) this.record = r;
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
                data: 'Push Notification record not found'
            };
        }

        const records = PushNotification.getAll({
            account_id: this.accountId,
        }, {
            sort: {created_dt: 1}
        });
        return records;
    }

    insert() {
        const p = this.params;
        const billable = this.astpp.checkBalance(this.price);
        if(!billable.success) return billable;

        let record = new PushNotification(p);
        record.account_id = this.accountId;
        const insert = record.insert();
        if(insert.success) {
            this.record = PushNotification.getById(insert.data);
        }
        return insert;
    }

    push(pnId) {
        if(!this.record) return {
            success: false,
            data: 'Push Notification record not found'
        };

        const record = this.record;
        let push = {
            success: false,
            data: 'Failed pushing notification'
        };

        const pn = new Fcm(record.server_key, record.registration_id);
        push = pn.sendNotification(record.title, record.body, record.icon, record.action, record.priority);
        if(push.success) {
            record.message_id = push.data;
            record.price = this.price;
            record.update();

            this.astpp.accountCharge(this.price);
        }
        return push;
    }
}