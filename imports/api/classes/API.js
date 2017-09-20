import { Enc } from './Encryption';
import moment from 'moment';
import Joi from './Joi';
import {CallsDB} from '../calls';
import {PushNotifDB} from '../pushNotifications';

export default class API {
    constructor(account, code, ipAddress) {
        this.enc = Enc((this.account = account).apiSecret);
        this.accessCode = code;
        this.ipAddress = ipAddress;
    }

    checkAccessCode() {
        if (this.accessCode) {
            let code = this.enc.Decrypt(this.accessCode);
            if (code && (code = code.split(':')).length == 4) {
                let accountId = code[0];
                let apiSecret = code[1];
                let ipAddress = code[2];
                let time = parseInt(code[3]);
                if (accountId === this.account.accountId && this.account.apiSecret === apiSecret && this.ipAddress === ipAddress) {
                    return (time - moment().valueOf()) > 0;
                }
            }
        }
        return false;
    }
    createCode(unli) {
        let time = moment().add(3, 'hour').valueOf();
        return this.enc.Encrypt([this.account.accountId, this.account.apiSecret, this.ipAddress, time].join(':'));
    }

    test(param1, param2) {
        let schema = {
            param1: Joi.string(true, 'alphanum', ['test01', 'test02'], ['test03']),
            param2: Joi.number(true)
        };
        let validate = Joi.validate({ param1, param2 }, schema);
        if (!validate.valid)
            return {
                success: false,
                data: validate.data
            };

        return {
            success: true,
            data: {
                test: 'Test DATA',
                param1,
                param2,
                validate
            }
        };
    }

	getCalls(params) {
        //this.astpp.callList(params.limit || 20);
        let schema = {
            limit: Joi.number(false)
        };
        let validate = Joi.validate({ limit:params.limit }, schema);
        if (!validate.valid)
            return {
                success: false,
                data: validate.data
            };
        let query = {account_id:this.account.accountId};
        let options = {};
        if(params.limit)
            options.limit = parseInt(params.limit);
        return {
            success: true,
            data: CallsDB.find(query,options).fetch()
        };
    }

    sendPushNotification(params) {
        //this.account.accountId
        //this.astpp.callList(params.limit || 20);
        let schema = {
            registration_id: Joi.string(true,"alphanum"),
            server_key: Joi.string(true,"token"),
            title: Joi.string(true,"alphanum"),
            body: Joi.string(true,"alphanum"),
            icon: Joi.string(false,"uri"),
            action: Joi.string(false,"uri"),
        };
        let validate = Joi.validate({
            registration_id:params.registration_id,
            server_key:params.server_key,
            title:params.title,
            body:params.body,
            icon:params.icon,
            action:params.action,
        }, schema);
        if (!validate.valid)
            return {
                success: false,
                data: validate.data
            };
        if(!params.icon)
            params.icon = null;
        if(!params.action)
            params.action = null;
        params.account_id = this.account.accountId;
        return {
            success: true,
            data: [
                {
                    "_id" : PushNotifDB.insert(params)
                }
            ]
        };
    }

    getPushNotifications(params) {
        //this.astpp.callList(params.limit || 20);
        let schema = {
            limit: Joi.number(false),
            subendpoint: Joi.string(false,'alphanum')
        };
        let validate = Joi.validate({ limit:params.limit, subendpoint:params.subendpoint }, schema);
        if (!validate.valid)
            return {
                success: false,
                data: validate.data
            };
        let query = {account_id:this.account.accountId};
        let options = {sort:{createdTimestamp:-1}};
        if(params.subendpoint)
            query._id = new Mongo.ObjectID(params.subendpoint);
        if(params.limit)
            options.limit = parseInt(params.limit);
        return {
            success: true,
            data: PushNotifDB.find(query,options).fetch()
        };
    }
}