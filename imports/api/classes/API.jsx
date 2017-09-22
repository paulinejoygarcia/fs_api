import { ENDPOINT, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import Util from './Utilities';
import {PushNotifDB} from '../pushNotifications';
import moment from 'moment';

export default class API {
    constructor(accountId, api, secret, accessCode, ipAddress) {
        this.api = api;
        this.secret = secret;
        this.accountId = accountId; // api account id
        this.accountData = null; // account id
        this.accessCode = accessCode;
        this.ipAddress = ipAddress;
        this.endpoint = this.subEndpoint = this.extEndpoint = ENDPOINT.AUTH;
        this.enc = Enc(this.secret);
        this.databaseConnection = null;
    }
    setDBConnection(wrapper) {
        if (wrapper && wrapper.isConnected())
            this.databaseConnection = wrapper;
    }
    setEndpoint(endpoint, sub, ext) {
        this.endpoint = endpoint;
        this.subEndpoint = sub;
        this.extEndpoint = ext;
    }
    checkAccessCode() {
        if (this.accessCode && this.databaseConnection && this.databaseConnection.isConnected()) {
            let code = this.enc.Decrypt(this.accessCode);
            if (code && (code = code.split(':')).length == 4) {
                let accountId = code[0];
                let apiSecret = code[1];
                let query = "SELECT * FROM `accounts` WHERE `account_id`=? AND `secret`=?";
                let result = this.databaseConnection.selectOne(query, [accountId, apiSecret]);
                if (result) {
                    let time = parseInt(code[2]);
                    let ipAddress = this.enc.XoR(code[3], time);
                    this.accountData = result;
                    if (accountId === this.accountId && this.secret === apiSecret && this.ipAddress === ipAddress) {
                        return (time - moment().valueOf()) > 0;
                    }
                }
            }
        }
        return false;
    }
    getAccountBalance() {
        let balance = 0;
        if (this.accountData)
            balance = parseFloat(this.accountData.balance) + parseFloat(this.accountData.posttoexternal) * parseFloat(this.accountData.credit_limit);

        return balance;
    }
    isAccountBillable(price) {
        if (this.getAccountBalance() >= parseFloat(price)) {
            return true;
        }
        return false;
    }
    updateAccountBalance(amount, paymentType = 'debit') {
        if (this.accountData && parseFloat(amount)) {
            let balance = parseFloat(this.accountData.balance) - parseFloat(amount);
            if (paymentType == 'credit')
                balance = parseFloat(this.accountData.balance) + parseFloat(amount);
            return this.databaseConnection.update('accounts', { balance }, `id=${this.accountData.id}`);
        }
    }
    chargeAccount(price) {
        let result = {
            success: false,
            error: 'Insufficient funds to process payment'
        };
        if (this.isAccountBillable(price)) {
            let charge = this.updateAccountBalance(price);
            if (charge) {
                result.success = true;
                result.error = '';
                result.data = 'Payment processed successfully';
            }
        }
        return result;
    }
    doProcess(method, body) {
        delete body.accessCode;
        switch (this.endpoint) {
            case ENDPOINT.AUTH: {
                let query = "SELECT `api`, `secret` FROM `accounts` WHERE `account_id`=?";
                let result = this.databaseConnection.selectOne(query, this.accountId);
                if (result) {
                    let testCipher = Util.encodeBase64(this.enc.XoR(this.api, this.accountId));
                    if (testCipher == result.secret && result.secret == this.secret) {
                        let time = moment().add(MAX_API_LIFETIME, 'hour').valueOf();
                        let encIp = this.enc.XoR(this.ipAddress, time);
                        return {
                            success: true,
                            code: 200,
                            data: {
                                code: this.enc.Encrypt([this.accountId, result.secret, time, encIp].join(':'))
                            }
                        }
                    }
                }
                return {
                    success: false,
                    code: 404,
                    error: 'Account not found!'
                }
            }
            case ENDPOINT.APP:
                let data = [];
                switch (method) {
                    case METHOD.GET: {
                        if (this.subEndpoint) {
                            let query = "SELECT * FROM `fs_applications` WHERE `id` = ? AND `retired` = 0";
                            let result = this.databaseConnection.selectOne(query, this.subEndpoint);
                            if (result) {
                                data.push({
                                    "id": result.id,
                                    "friendly_name": result.friendly_name || '',
                                    "call_url": result.call_url || '',
                                    "call_method": result.call_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "call_fb_url": result.call_fb_url || '',
                                    "call_fb_method": result.call_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "msg_url": result.msg_url || '',
                                    "msg_method": result.msg_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "msg_fb_url": result.msg_fb_url || '',
                                    "msg_fb_method": result.msg_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "fax_url": result.fax_url || '',
                                    "fax_method": result.fax_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "fax_fb_url": result.fax_fb_url || '',
                                    "fax_fb_method": result.fax_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET
                                });
                            } else
                                data.push('APP NOT FOUND');
                        } else {
                            let query = "SELECT * FROM `fs_applications` WHERE `accountid` = ? AND `retired` = 0";
                            let results = this.databaseConnection.select(query, this.accountData.id);
                            if (results) {
                                results.forEach((result) => {
                                    data.push({
                                        "id": result.id,
                                        "friendly_name": result.friendly_name || '',
                                        "call_url": result.call_url || '',
                                        "call_method": result.call_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "call_fb_url": result.call_fb_url || '',
                                        "call_fb_method": result.call_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "msg_url": result.msg_url || '',
                                        "msg_method": result.msg_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "msg_fb_url": result.msg_fb_url || '',
                                        "msg_fb_method": result.msg_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "fax_url": result.fax_url || '',
                                        "fax_method": result.fax_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "fax_fb_url": result.fax_fb_url || '',
                                        "fax_fb_method": result.fax_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET
                                    });
                                });
                            }
                        }
                    }
                        break;
                    case METHOD.POST:
                    case METHOD.PUT: {
                        let query = "SELECT id FROM `fs_applications` WHERE `friendly_name` = ?";
                        let dupe = this.databaseConnection.selectOne(query, body.friendly_name);
                        if (dupe && dupe.id !== parseInt(this.subEndpoint)) {
                            return { success: false, code: 400, data: `${body.friendly_name} already exists!` }
                        }
                        body.accountid = this.accountData.id;
                        if (this.subEndpoint) {
                            let result = this.databaseConnection.update('fs_applications', body, `id=${parseInt(this.subEndpoint)}`);
                            if (result) {
                                return { success: true, code: 200, data: { id: parseInt(this.subEndpoint), update: result } }
                            }
                            return { success: false, code: 400, data: `Application id '${this.subEndpoint}' not found!` }
                        } else {
                            let result = this.databaseConnection.insert('fs_applications', body);
                            if (result) {
                                return { success: true, code: 200, data: { id: result } }
                            }
                            return { success: false, code: 500, data: 'Something went wrong!' }
                        }
                    }
                }
			case ENDPOINT.VOICE:
                data = [];
                query = 'SELECT callstart as call_start,' +
                    'callerid as caller_id,' +
                    'callednum as called_number,' +
                    'billseconds as duration,' +
                    'disposition,' +
                    'debit as price,' +
                    'uniqueid as call_id' +
                    ' FROM cdrs WHERE accountid = ' +
                    '(SELECT id from accounts WHERE account_id = ?)' +
                    ' ORDER BY callstart DESC' +
                    (body.limit?' LIMIT '+body.limit:'');
                this.databaseConnection.select(query,[this.accountId]).forEach((accInfo)=>{
                    data.push({
                        call_start:accInfo.call_start,
                        caller_id:accInfo.caller_id,
                        called_number: accInfo.called_number,
                        duration: accInfo.duration,
                        disposition: accInfo.disposition,
                        price: accInfo.price,
                        call_id: accInfo.call_id
                    });
                });
                return {
                    success: true,
                    code: 200,
                    data: data
                }
			case ENDPOINT.PUSH:
			    data = [];
			    switch(method) {
                    case METHOD.GET:
                        let queryPush = {account_id:this.accountId};
                        let optionsPush = {sort:{createdTimestamp:-1}};
                        if(this.subEndpoint)
                            queryPush._id = new Mongo.ObjectID(this.subEndpoint);
                        if(body.limit)
                            optionsPush.limit = parseInt(body.limit);
                        PushNotifDB.find(queryPush,optionsPush).fetch().forEach((PushNotif)=> {
                            data.push({
                                _id:PushNotif._id._str,
                                registration_id: PushNotif.registration_id,
                                title: PushNotif.title,
                                body: PushNotif.body,
                                server_key: PushNotif.server_key,
                                icon: PushNotif.icon || null,
                                action: PushNotif.action || null,
                                priority: PushNotif.priority || 0,
                                message_id: PushNotif.message_id || "",
                                price: PushNotif.price || 0.0,
                                created_dt: moment(PushNotif.createdTimestamp).format("MMM-DD-YYYY hh:mm:ss A"),
                                account_id: PushNotif.account_id
                            });
                        });
                        return {
                            success: true,
                            code: 200,
                            data: data
                        }
                    case METHOD.POST:
                        body.account_id = this.accountId;
                        body.createdTimestamp = moment().valueOf();
                        if(!this.isAccountBillable(Meteor.settings.pricing.pushNotification))
                            return {
                                success:false,
                                code:400,
                                error:'Insufficient funds to process request'
                            };
                        let chargeResponse = this.chargeAccount(Meteor.settings.pricing.pushNotification);
                        if(!chargeResponse.success)
                            return {
                                success:false,
                                code:500,
                                error:chargeResponse.error
                            };
                        return {
                            success: true,
                            code:200,
                            data: {chargeResponse,PushNotifId:PushNotifDB.insert(body)._str}
                        };
                        break;
                }
                break;
            case ENDPOINT.NUMBER:
                return {
                    success: true,
                    code: 200,
                    data: 'number endpoint'
                }
                break;
            case ENDPOINT.SOCIAL:
                return {
                    success: true,
                    code: 200,
                    data: 'social endpoint'
                }
                break;
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }
}