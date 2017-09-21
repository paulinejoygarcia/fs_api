import { ENDPOINT, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import {CallsDB} from '../calls';
import {PushNotifDB} from '../pushNotifications';
import moment from 'moment';
import CallCtrl from './controller/Call';
import PushNotifCtrl from './controller/PushNotif';
import mysql from 'mysql';
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
    doProcess(method, body) {
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
                let data = [];
                let future = new Future();
                let mysqlConnection = mysql.createConnection(Meteor.settings.astpp.db);
                mysqlConnection.connect(function(err) {
                    if (err) {
                        console.error('error connecting in ASTPP MySQL: ' + err.stack);
                        return;
                    }
                    console.log('connected in ASTPP MySQL as id ' + mysqlConnection.threadId);
                });
                mysqlConnection.query('SELECT callstart as call_start,callerid as caller_id,' +
                    'callednum as called_number,billseconds as duration,disposition,debit as price,' +
                    'uniqueid as call_id FROM cdrs WHERE accountid = "'+ this.accountId +
                    '" ORDER BY callstart DESC' + (body.limit?' LIMIT '+body.limit:''), function (error, results, fields) {
                    if (error) throw error;
                    data = results;
                    future.return({
                        success: true,
                        code: 200,
                        data: data
                    });
                });
                return future.wait();
                //const ctrl = new Controller(this.request, this.urlParams);
                //let queryVoice = {account_id:this.accountId};
				//let optionsVoice = {};
				//if(body.limit)
                //    optionsVoice.limit = parseInt(body.limit);
                //CallsDB.find(queryVoice,optionsVoice).fetch()
			case ENDPOINT.PUSH:
			    switch(method) {
                    case METHOD.GET:
                        mysqlConnection = mysql.createConnection(Meteor.settings.astpp.db);
                        mysqlConnection.connect(function(err) {
                            if (err) {
                                console.error('error connecting in ASTPP MySQL: ' + err.stack);
                                return;
                            }
                            console.log('connected in ASTPP MySQL as id ' + mysqlConnection.threadId);
                        });
                        mysqlConnection.query('SELECT callstart as call_start,callerid as caller_id,' +
                            'callednum as called_number,billseconds as duration,disposition,debit as price,' +
                            'uniqueid as call_id FROM cdrs WHERE accountid = "'+ this.accountId +
                            '" ORDER BY callstart DESC' + (body.limit?' LIMIT '+body.limit:''), function (error, results, fields) {
                            if (error) throw error;
                            data = results;
                            future.return({
                                success: true,
                                code: 200,
                                data: data
                            });
                        });
                        // let queryPush = {account_id:this.accountId};
                        // let optionsPush = {sort:{createdTimestamp:-1}};
                        // if(this.subEndpoint)
                        //     queryPush._id = new Mongo.ObjectID(this.subEndpoint);
                        // if(body.limit)
                        //     optionsPush.limit = parseInt(body.limit);
                        // data = PushNotifDB.find(queryPush,optionsPush).fetch();
                        //data = ctrl.list();
                        data = [];
                        break;
                    case METHOD.POST:
                        //body.account_id = this.accountId;
                        //data = PushNotifDB.insert(body);
                        let res = ctrl.insert();
                        if(res.success) res = ctrl.push();
                        data = res;
                        break;
                }
               return {
                   success: true,
                   code: 200,
                   data: data
               }
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }
}