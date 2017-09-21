import { ENDPOINT, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import Util from './Utilities';
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
                let query = "SELECT `id` FROM `accounts` WHERE `account_id`=? AND `secret`=?";
                let result = this.databaseConnection.selectOne(query, [accountId, apiSecret]);
                if (result) {
                    let time = parseInt(code[2]);
                    let ipAddress = this.enc.XoR(code[3], time);
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
                let values = {
                    accountid: '13',
                    friendly_name: 'test4',
                    call_url: 'http://acme.com/call',
                    call_method: 'POST',
                    msg_url: 'http://acme.com/msg',
                    msg_method: 'POST',
                    fax_url: 'http://acme.com/fax',
                    fax_method: 'POST'
                };
                let insert = this.databaseConnection.insert('fs_applications', values);

                let query = 'SELECT * FROM fs_applications WHERE id = ?';
                let selectOne = this.databaseConnection.selectOne(query, [insert]);

                values = {
                    friendly_name: 'test4-edited',
                    call_method: 'GET',
                    msg_method: 'POST',
                    fax_method: 'PUT'
                };
                let update = this.databaseConnection.update('fs_applications', values, `id=${insert}`);

                let select = this.databaseConnection.select(query, [insert]);

                return {
                    success: true,
                    code: 200,
                    data: {
                        insert,
                        selectOne,
                        update,
                        select
                    }
                }
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }
}