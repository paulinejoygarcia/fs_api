import { ENDPOINT, METHOD, MAX_API_LIFETIME, VIDEO_SUB_ENDPOINT } from './Const';
import { Enc } from './Encryption';
import moment from 'moment';
import message from '../message';


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
                };
            break;
            case ENDPOINT.APP:
                return {
                    success: true,
                    code: 200,
                    data: {

                    }
                };
            break;
            case ENDPOINT.MESSAGE:
                switch(method){
                    case METHOD.POST:
                        try{
                            let insertMessage = message.MessageDB.insert({
                                from: body.from,
                                to: body.to,
                                body: body.body,
                                attachment: body.attachment,
                                type: "message",
                                createdDt: new Date(),
                            });
                            if(insertMessage)
                                return {
                                    "success": true,
                                    "id": insertMessage
                                };
                            else server.showError('end point[%s]: %s.', ENDPOINT.MESSAGE, insertMessage);
                        }catch(err){
                            server.showError('end point[%s]: %s.', ENDPOINT.MESSAGE, err.message);
                        }
                        break;
                    case METHOD.GET:
                        try{
                            return {
                                "success": true,
                                "code": 200,
                                "data": message.MessageDB.find({}, {sort: {createdDt: -1}}).fetch()
                            };
                        }catch(err){
                            server.showError('end point[%s]: %s.', ENDPOINT.MESSAGE, err.message);
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
                switch(method){
                    case METHOD.POST:
                        switch(this.subEndpoint){
                            case VIDEO_SUB_ENDPOINT.SCREENSHOTS:
                                try{
                                    let insertMessage = message.MessageDB.insert({
                                        from: body.from,
                                        to: body.to,
                                        body: body.body,
                                        attachment: body.attachment,
                                        type: "message",
                                        createdDt: new Date(),
                                    });
                                    if(insertMessage)
                                        return {
                                            "success": true,
                                            "id": insertMessage
                                        };
                                    else server.showError('end point[%s]: %s.', ENDPOINT.VIDEO, insertMessage);
                                }catch(err){
                                    server.showError('end point[%s]: %s.', ENDPOINT.VIDEO, err.message);
                                }
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