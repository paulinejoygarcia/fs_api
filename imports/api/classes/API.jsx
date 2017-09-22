import { ENDPOINT, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import Util from './Utilities';
import moment from 'moment';
import MessageCtrl from './controller/Message';
import ScreenshotsCtrl from './controller/Screenshot';

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
        if (acc = this.accountData)
            balance = parseFloat(acc.balance) + parseFloat(acc.posttoexternal) * parseFloat(acc.credit_limit);

        return balance;
    }
    isAccountBillable(price) {
        return(this.getAccountBalance() >= parseFloat(price));
    }
    updateAccountBalance(amount, paymentType = 'debit') {
        if (this.accountData && parseFloat(amount)) {
            let balance = parseFloat(this.accountData.balance) - parseFloat(amount);
            if (paymentType == 'credit')
                balance = parseFloat(this.accountData.balance) + parseFloat(amount);
            return this.databaseConnection.update('accounts', { balance }, `id=${this.accountData.id}`);
        }
    }

    didAccountOwner(number) {
        let query = 'SELECT dids.accountid as aid, accounts.number as anum FROM dids JOIN accounts ON dids.accountid = accounts.id WHERE dids.number = ? ';
        let result = this.databaseConnection.selectOne(query, [number]);
        if (result) {
            return {
                success: true,
                data: {
                    id: result.aid,
                    accountId: result.anum,
                }
            }
        }
        return result;
    }

    doProcess(method, body, server) {
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

                    }
                }
                return {
                    success: true,
                    code: 200,
                    data: data
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

            case ENDPOINT.MESSAGE:
                switch (method) {
                    case METHOD.POST:
                        try {
                            const ctrl = new MessageCtrl(this.databaseConnection, body, this.accountId, server.smtpSend, server.smppSend, server.processRequestUrl, this.updateAccountBalance, this.isAccountBillable, this.didAccountOwner);
                            let res = ctrl.insert();
                            console.log("sending...");
                            if (res.success) res = ctrl.send();
                            return res;
                        } catch (err) {
                            console.log('end point[%s]: %s.', ENDPOINT.MESSAGE, err.message);
                        }
                        break;
                    case METHOD.GET:
                        try {
                            const ctrl = new MessageCtrl(this.databaseConnection, body, this.accountId, server.smtpSend, server.smppSend, server.processRequestUrl, this.updateAccountBalance, this.isAccountBillable, this.didAccountOwner);
                            return {
                                statusCode: 200,
                                body: ctrl.list()
                            };
                        } catch (err) {
                            console.log('end point[%s]: %s.', ENDPOINT.MESSAGE, err.message);
                        }
                        break;
                    default:
                        return {
                            success: false,
                            code: 404,
                            data: {}
                        };
                }
                break;
            case ENDPOINT.VIDEO:
                switch (method) {
                    case METHOD.POST:
                        switch (this.subEndpoint) {
                            case VIDEO_SUB_ENDPOINT.SCREENSHOTS:
                                const ctrl = new ScreenshotsCtrl(this.databaseConnection, body, this.accountId, server.smtpSend, server.smppSend, server.processRequestUrl, this.chargeBalance, this.didAccountOwner);
                                let res = ctrl.insert();
                                console.log(res);
                                if (res.success) res = ctrl.send();
                                return res;
                                break;
                        }
                        break;
                    default:
                        return {
                            success: false,
                            code: 404,
                            data: {}
                        };
                }
                break;
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }
}