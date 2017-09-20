import API from './API';
import Const from './Const';
import Util from './Utilities';

export default class Server {
    parseAPI(accountSid, auth, body, method, endpoint, subendpoint, ipAddress) {
        let info = Util.decodeBase64(auth.replace('Basic ', ''));
        if ((info = info.split(':')).length > 1) {
            let api = info[0];
            let secret = info[1];
            let code = body.access_code;
            let exist = {
                accountId: 'ACCOUNT_ID',
                apiSecret: 'API_SECRET',

            };

            if (exist) {
                let api = new API(exist, code, ipAddress);
                if (endpoint !== Const.API_ENDPOINT.CODE && (!api.checkAccessCode() || !code)) {
                    showWarning('API received invalid access code! code:%s', code || 'undefined');
                    return { error: 'Invalid access code!' };
                }
                body = body || {};
                switch (endpoint) {
                    case Const.API_ENDPOINT.CODE: {
                        let code = api.createCode();
                        return { code };
                    }
                    case Const.API_ENDPOINT.TEST: {
                        if (method === 'POST') {
                            return api.test(body.param1, body.param2);
                        }
                        break;
                    }
					case Const.API_ENDPOINT.VOICE: {
                        let calls = api.getCalls();
                        return { calls };
                    }
                    default:
                        showWarning('API received invalid Business or API not enabled request. accountSid: %s', accountSid);
                        break;
                }
                return {
                    success: false,
                    data: 'Endpoint not found'
                };
            }
            return {
                success: false,
                data: 'Account not found'
            };
        }
        return {
            success: false,
            data: 'Invalid authentication'
        };
    }
}
showNotice = Util.showNotice;
showStatus = Util.showStatus;
showError = Util.showError;
showWarning = Util.showWarning;
showDebug = Util.showDebug;