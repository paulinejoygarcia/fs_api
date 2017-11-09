import { NETWORK_PROVIDER, NETWORK_STATUS_MESSAGES } from './Const';
import Util from './Utilities';
import nexmo from 'easynexmo/lib/nexmo';
import SMS from './SMS';

export default class Nexmo extends SMS {
    constructor(number, settings) {
        super(number, NETWORK_PROVIDER.NETWORK_NX, 'Nexmo', settings);
        if (this.key && this.secret)
            (this.instance = nexmo).initialize(this.key, this.secret, false);
        if (settings) {
            this.callbackUrl = settings.callbackUrl;
            this.settings = settings;
        }
    }
    sendSMS(to, message, attachment, callback) {
        if (!this.instance) return;
        let options = { 'status-report-req': 1, 'type': 'text', callback: this.callbackUrl };
        if (Util.checkUnicode(message))
            options.type = "unicode";
        this.instance.sendTextMessage(this.number, to, message, options, (err, response) => {
            if (err)
                showError(`Error sending SMS with '${this.number}'(${this.type}):`, err);
            if (callback && response) {
                response.messages.forEach((message) => {
                    let status = {
                        messageId: message['message-id'],
                        status: message['error-text'] ? 'failed' : 'buffered',
                        code: parseInt(message['status']) || -1,
                        statusURI: null,
                        segment: parseInt(response['message-count']),
                        pricing: {
                            network: message.network,
                            price: parseFloat(message['message-price'])
                        }
                    }
                    if (isNaN(status.segment))
                        status.segment = 1;
                    callback(status);
                });
            }
        });
    }
    sendTTS(to, message, attachment, callback) {
        if (!this.instance) return;
        this.instance.sendTTSMessage(to, message, {
            machine_detection: 'hangup',
            type: 'unicode'
        }, (err, response) => {
            if (callback) {
                let status = {
                    callId: response.call_id,
                    code: parseInt(response.status),
                    status: response.error_text
                };
                callback(status);
            }
            if (err)
                showError(`Error sending TTS with '${this.number}'(${this.type}):`, err);
        });
    }
    sendMMS() { showDebug('Not yet implemented!'); return false; }
    apiResponse(instance) {
        Util.affixResponse(instance, 200, { 'Content-Type': 'text/xml', 'Access-Control-Allow-Origin': '*' }, '<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
    }
    parseIncoming(data) {
        let retval = { attachment: [] };
        let hooks = ['msisdn', 'messageId', 'type', 'text'];

        if (!data || !Util.checkHooks(data, hooks))
            return null;

        retval.businessNumber = `+${data.to}`;
        retval.consumerNumber = `+${data.msisdn}`;
        retval.messageId = data.messageId;
        retval.network = NETWORK_PROVIDER.NETWORK_NX;

        /*
        // For further implementation
        if (input.concat) {

        }
        if (data.NumMedia) {
            for (let x = 0; x < parseInt(data.NumMedia); x++) {
                retval.attachment.push({
                    url: data['MediaUrl' + x],
                    type: data['MediaContentType' + x]
                });
            }
        }*/

        //sanitize inputs
        retval.message = data.text;
        let check = Util.numberValidator(retval.consumerNumber);
        if (check.isValid)
            retval.consumerNumber = check.e164Format;
        check = Util.numberValidator(retval.businessNumber);
        if (check.isValid)
            retval.businessNumber = check.e164Format;

        return retval;
    }
    parseReceipt(data) {
        if (data && data.messageId && data.status) {
            return { id: data.messageId, key: data.status, number: `+${data.to}` };
        }
        return null;
    }
    sendShortCode() { showDebug('Not yet implemented!'); return false; }
    getPricing(messageId, retry = 0) {
        if (!this.instance) return null;
        let url = `https://rest.nexmo.com/search/message/${this.key}/${this.secret}/${messageId}`;
        showStatus(`Getting price info of message ${messageId}...`);
        try {
            let response = HTTP.call('GET', url);
            if (response && response.statusCode == 200) {
                if (response && response.data) {
                    if (response.data.network) {
                        var pricing = {
                            network: response.data.network,
                            price: parseFloat(response.data.price)
                        }
                        if (isNaN(pricing.price))
                            pricing.price = 0.0;
                        showNotice(`Found message price info of '${messageId}' network:'${pricing.network}' price:'${pricing.price}'`);
                        return pricing;
                    } else if (retry < 10) {
                        showStatus(`Getting price info of message ${messageId}...(${retry}x)`);
                        Meteor._sleepForMs(5000);
                        return this.getPricing(messageId, retry + 1);
                    } else {
                        showError(`Fail to get message price info of ${messageId} exceed 10 retries...`);
                    }
                }
            }
        } catch (err) {
            showError(`Fail to get message price info of '${messageId}'`, err);
        }
        return false;
    }
    parseConcatSMS(data) {
        if (data && data['concat-ref'] && data['concat-part']) {
            let concat = {};
            concat.ref = parseInt(data['concat-ref']);
            concat.total = parseInt(data['concat-total']);
            concat.part = parseInt(data['concat-part']);
            return concat;
        }
    }
    getPricing() { return false; }
}
