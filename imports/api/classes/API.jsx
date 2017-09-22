import { ENDPOINT, ENDPOINT_ACTION, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import Util from './Utilities';
import moment from 'moment';

export default class API {
    constructor(accountId, api, secret, accessCode, ipAddress) {
        this.api = api;
        this.secret = secret;
        this.accountId = accountId;
        this.accountData = null;
        this.accessCode = accessCode;
        this.ipAddress = ipAddress;
        this.endpoint = this.subEndpoint = this.extEndpoint = ENDPOINT.AUTH;
        this.enc = Enc(this.secret);
        this.databaseConnection = null;
    }
    getAccountBalance() {
        let balance = 0;
        if (acc = this.accountData)
            balance = parseFloat(acc.balance) + parseFloat(acc.posttoexternal) * parseFloat(acc.credit_limit);

        return balance;
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
        if (this.getAccountBalance() >= parseFloat(price)) {
            let charge = this.updateAccountBalance(price);
            if (charge) {
                result.success = true;
                result.error = '';
                result.data = 'Payment processed successfully';
            }
        }
        return result;
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
    doProcess(method, body) {
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
                switch (this.subEndpoint) {
                    case ENDPOINT_ACTION.NUMBER_AVAILABLE:
                        return this.numberAvailable();
                    case ENDPOINT_ACTION.NUMBER_OWNED:
                        return this.numberOwned();
                    case ENDPOINT_ACTION.NUMBER_INCOMING:
                        return this.numberIncoming(body.did_id, body.app_id);
                }
                break;

            case ENDPOINT.SOCIAL:
                switch (this.subEndpoint) {
                    case ENDPOINT_ACTION.SOCIAL_ACCOUNT:
                        return this.socialAccount(this.extEndpoint, body);
                }    
                return {
                    success: true,
                    code: 200,
                    data: 'social endpoint'
                }
                break;
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }

    numberAvailable() {
        let query = 'SELECT id, number, setup, monthlycost FROM dids WHERE accountid = ? AND parent_id = ?';
        let numbers = this.databaseConnection.select(query, [0, 0]);
        return {
            success: true,
            code: 200,
            data: numbers || []
        };
    }

    numberOwned() {
        let query = 'SELECT id, number, setup, monthlycost FROM dids WHERE accountid = ? AND parent_id = ?';
        let numbers = this.databaseConnection.select(query, [this.accountData.id, 0]);
        return {
            success: true,
            code: 200,
            data: numbers || []
        };
    }

    numberIncoming(didId, appId) {
        let query = 'SELECT id, setup FROM dids WHERE id = ? AND accountid = ? AND parent_id = ?';
        let did = this.databaseConnection.selectOne(query, [didId, 0, 0]);
        if (!did) {
            return {
                success: false,
                code: 404,
                error: 'DID number not found'
            };
        }

        query = 'SELECT id FROM fs_applications WHERE id = ? AND accountid = ?';
        let app = this.databaseConnection.selectOne(query, [appId, this.accountData.id]);
        if (!app) {
            return {
                success: false,
                code: 404,
                error: 'Application not found'
            };
        }

        let charge = this.chargeAccount(did.setup);
        if (!charge.success) {
            return {
                success: false,
                code: 200,
                error: charge.error
            };
        }

        let values = {
            accountid: this.accountData.id,
            assign_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            fs_app_id: app.id
        };
        this.databaseConnection.update('dids', values, `id=${did.id}`);

        return {
            success: true,
            code: 200,
            data: 'DID number purchased successfully',
        };
    }
}