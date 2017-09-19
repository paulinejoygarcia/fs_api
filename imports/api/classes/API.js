import { Enc } from './Encryption';
import moment from 'moment';

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
        return {
            success: true,
            data: {
                test: 'Test DATA',
                param1,
                param2
            }
        };
    }
}