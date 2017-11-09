import { NETWORK_PROVIDER, NETWORK_STATUS_MESSAGES } from './Const';
import { HTTP } from 'meteor/http';
import Util from './Utilities';
import SMS from './SMS';
import Nexmo from './Nexmo';

export default class Onvoy extends SMS {
    constructor(number, settings) {
        super(number, NETWORK_PROVIDER.NETWORK_OC, 'Onvoy Connect', settings);
        this.smsAPI = `https://api.layered.com/messaging/sms/send?sessionId=${this.key}`;
        this.mmsAPI = `https://api.layered.com/messaging/mms/send?sessionId=${this.key}`;
        if (settings)
            this.settings = settings;
        this.nxInstance = new Nexmo(number, {
            ...settings, ...{ key: 'a20279d5', secret: 'Fye0OAS9' }
        });
    }
    sendSMS(to, message, attachment, callback) {
        let check = Util.numberValidator(to);
        if (!check.fromUS && this.nxInstance) {
            return this.nxInstance.sendSMS(to, message, attachment, callback);
        }
        if (attachment && attachment.length) {
            this.sendMMS(to, message, attachment, callback);
        } else {
            let param = {
                "to": [
                    to.replace('+', '')
                ],
                "from": this.number.replace('+', ''),
                "text": message
            };
            HTTP.call('POST', this.smsAPI, {
                data: param,
                headers: {
                    'Content-Type': 'application/json'
                }
            }, (err, response) => {
                if (callback) {
                    let status = {
                        messageId: response.data.success ? response.data.result.referenceId : null,
                        status: response.data.reason,
                        code: -1,
                        statusURI: null
                    }
                    callback(status);
                }
                if (err)
                    showError(`Error sending SMS with '${this.number}'(${this.type}):`, err);
            })
        }
    }
    sendTTS(to, message, attachment, callback) {
        let check = Util.numberValidator(to);
        if (!check.fromUS && this.nxInstance) {
            return this.nxInstance.sendTTS(to, message, attachment, callback);
        }
        showDebug('Not yet implemented!'); return false;
    }
    sendMMS(to, message, attachment, callback) {
        let check = Util.numberValidator(to);
        if (!check.fromUS && this.nxInstance) {
            return this.nxInstance.sendMMS(to, message, attachment, callback);
        }
        let param = {
            "to": [
                to.replace('+', '')
            ],
            "from": this.number.replace('+', ''),
            "text": message
        };
        if (attachment && attachment.length)
            param.mediaUrls = attachment;
        HTTP.call('POST', this.mmsAPI, {
            data: param,
            headers: {
                'Content-Type': 'application/json'
            }
        }, (err, response) => {
            if (callback) {
                let status = {
                    messageId: response.data.success ? response.data.result.referenceId : null,
                    status: response.data.reason,
                    code: -1,
                    statusURI: null
                }
                callback(status);
            }
            if (err)
                showError(`Error sending MMS with '${this.number}'(${this.type}):`, err);
        });
    }
    apiResponse(instance) {
        Util.affixResponse(instance, 200, { 'Access-Control-Allow-Origin': '*' }, '');
    }

    parseIncoming(data) {
        let retval = { attachment: [] };
        let hooks = ['referenceId', 'text'];

        if (!data || !Util.checkHooks(data, hooks))
            return null;
        let message = data.text;
        retval.to = `+${data.resultResponses[0].to}`;
        retval.from = `+${data.from}`;
        retval.messageId = data.referenceId;
        retval.network = NETWORK_PROVIDER.NETWORK_OC;
        //extract attachment
        do {
            var urls = message.match(/\n[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi);
            if (urls && urls.length > 0) {
                let url = urls[0].trim();
                retval.attachment.push({
                    url: url,
                    type: null
                });
                message = message.replace(url, '');
                continue;
            }
            break;
        } while (true);
        if (data.mediaUrls && data.mediaUrls.length) {
            for (let x = 0; x < data.mediaUrls.length; x++) {
                retval.attachment.push({
                    url: data.mediaUrls[x],
                    type: ''
                });
            }
        }

        //sanitize inputs
        retval.message = message;
        let check = Util.numberValidator(retval.from);
        if (check.isValid)
            retval.from = check.e164Format;
        check = Util.numberValidator(retval.businessNumber);
        if (check.isValid)
            retval.to = check.e164Format;

        return retval;
    }
    parseReceipt(data) {
        if (data && data.referenceId && data.resultResponses) {
            return { id: data.referenceId, key: data.resultResponses[0].status, number: `+${data.from}` };
        }
        return null;
    }
    sendShortCode() { showDebug('Not yet implemented!'); return false; }
    parseConcatSMS() { return false; }
    getPricing() { return false; }
}
