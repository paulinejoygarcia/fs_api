import { ENDPOINT, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import {CallsDB} from '../calls';
import {PushNotifDB} from '../pushNotifications';
import moment from 'moment';

export default class API {
    constructor(accountId, api, secret, accessCode, ipAddress) {
        this.api = api;
        this.secret = secret;
        this.accountId = accountId;
        this.accessCode = accessCode;
        this.ipAddress = ipAddress;
        this.endpoint = this.subEndpoint = this.extEndpoint = ENDPOINT.AUTH;
        this.enc = Enc(this.secret);
    }
    setEndpoint(endpoint, sub, ext) {
        this.endpoint = endpoint;
        this.subEndpoint = sub;
        this.extEndpoint = ext;
    }
    checkAccessCode() {
        if (this.accessCode) {
            let code = this.enc.Decrypt(this.accessCode);
            if (code && (code = code.split(':')).length == 4) {
                let accountId = code[0];
                let apiSecret = code[1];
                let time = parseInt(code[2]);
                let ipAddress = code[3];
                if (accountId === this.accountId && this.secret === apiSecret && this.ipAddress === ipAddress) {
                    return (time - moment().valueOf()) > 0;
                }
            }
        }
        return false;
    }
    doProcess(body) {
        switch (this.endpoint) {
            case ENDPOINT.AUTH:
                let time = moment().add(MAX_API_LIFETIME, 'hour').valueOf();
                return {
                    success: true,
                    code: 200,
                    data: {
                        code: this.enc.Encrypt([this.accountId, this.secret, time, this.ipAddress].join(':'))
                    }
                }
            case ENDPOINT.APP:
                return {
                    success: true,
                    code: 200,
                    data: {

                    }
                }
			case ENDPOINT.VOICE:
				let queryVoice = {account_id:this.accountId};
				let optionsVoice = {};
				if(body.limit)
                    optionsVoice.limit = parseInt(body.limit);
                return {
                    success: true,
                    code: 200,
                    data: CallsDB.find(queryVoice,optionsVoice).fetch()
                }
			case ENDPOINT.PUSH:
                let queryPush = {account_id:this.accountId};
                let optionsPush = {sort:{createdTimestamp:-1}};
                if(this.subEndpoint)
                    queryPush._id = new Mongo.ObjectID(this.subEndpoint);
                if(body.limit)
                    optionsPush.limit = parseInt(body.limit);
               return {
                   success: true,
                   code: 200,
                   data: PushNotifDB.find(queryPush,optionsPush).fetch()
               }
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }
}