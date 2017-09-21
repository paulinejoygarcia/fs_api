import { ENDPOINT, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import {PushNotifDB} from '../pushNotifications';
import moment from 'moment';
let Future = Npm.require('fibers/future');
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
                let time = parseInt(code[2]);
                let ipAddress = code[3];
                if (accountId === this.accountId && this.secret === apiSecret && this.ipAddress === ipAddress) {
                    return (time - moment().valueOf()) > 0;
                }
            }
        }
        return false;
    }
    doProcess(method, body, dbConnection) {
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
			case ENDPOINT.VOICE:
                let data = [];
                query = 'SELECT callstart as call_start,callerid as caller_id,' +
                    'callednum as called_number,billseconds as duration,disposition,debit as price,' +
                    'uniqueid as call_id FROM cdrs WHERE accountid = "'+ this.accountId +
                    '" ORDER BY callstart DESC' + (body.limit?' LIMIT '+body.limit:'');
                return {
                    success: true,
                    code: 200,
                    data: this.databaseConnection.select(query)
                }
                //let queryVoice = {account_id:this.accountId};
				//let optionsVoice = {};
				//if(body.limit)
                //    optionsVoice.limit = parseInt(body.limit);
                //CallsDB.find(queryVoice,optionsVoice).fetch()
			case ENDPOINT.PUSH:
			    switch(method) {
                    case METHOD.GET:
                        let queryPush = {account_id:this.accountId};
                        let optionsPush = {sort:{createdTimestamp:-1}};
                        if(this.subEndpoint)
                            queryPush._id = new Mongo.ObjectID(this.subEndpoint);
                        if(body.limit)
                            optionsPush.limit = parseInt(body.limit);
                        data = PushNotifDB.find(queryPush,optionsPush).fetch();
                        return {
                            success: true,
                            code: 200,
                            data: data
                        }
                    case METHOD.POST:
                        query = 'SELECT balance from accounts WHERE number = "'+ this.accountId + '"';
                        let select = dbConnection.select(query);
                        if(select.length > 0) {
                            if(parseFloat(select[0].balance) >= parseFloat(body.price)) {}
                            else return {
                                success: false,
                                data: 'Insufficient funds'
                            };
                        } else {
                            return {
                                success: false,
                                data: 'Could not retrieve account balance'
                            };
                        }
                        body.account_id = this.accountId;
                        return {
                            success: false,
                            code:200,
                            data: PushNotifDB.insert(body)
                        };
                        break;
                }
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }
}