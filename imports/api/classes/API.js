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

	getCalls(params) {
		//this.account.accountId
        //this.astpp.callList(params.limit || 20);
        return {
            success: true,
            data: [
				{
					"_id" : "59c17bc523a20127c5744578",
					"call_start" : 1505852207.0,
					"caller_id" : "12023041949 < 12023041949>",
					"called_number" : "+12023041949",
					"duration" : 40,
					"disposition" : "NORMAL_CLEARING",
					"price" : 0.006,
					"call_id" : "d3a7e166-3841-4a04-b5f5-c859cf1b8cffSTANDARD_13",
				}
			]
        };
    }

    getPushNotifications(params) {
        //this.account.accountId
        //this.astpp.callList(params.limit || 20);
        return {
            success: true,
            data: [
                {
                    "_id" : "59c17d9f23a20127c574457a",
                    "registration_id" : "ek4QJcWc80I:APA91bE...",
                    "title" : "Sample Title 2",
                    "body" : "Sample Body 2",
                    "server_key" : "AAAAFEC8mk4:APA91bGuaGJSUufIzbBtOWyCH...",
                    "icon" : null,
                    "action" : null,
                    "priority" : 10,
                    "message_id" : "0:1505327862064389%31bd1c9631bd1c96",
                    "price" : 0.001,
                    "created_timestamp" : 1505852743.0,
                    "account_id" : "1978198228"
                }
            ]
        };
    }
}