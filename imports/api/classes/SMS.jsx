export default class SMS {
    constructor(number, network = 0, type = "Unknown", settings = { key: '', secret: '' }) {
        this.network = network;
        this.type = type;
        this.number = number;
        this.key = settings.key;
        this.secret = settings.secret;
    }
    sendSMS() { showDebug('Not yet implemented!'); return false; }
    sendTTS() { showDebug('Not yet implemented!'); return false; }
    sendMMS() { showDebug('Not yet implemented!'); return false; }
    apiResponse() { showDebug('Not yet implemented!'); return false; }
    parseIncoming() { showDebug('Not yet implemented!'); return false; }
    parseReceipt() { showDebug('Not yet implemented!'); return false; }
    sendShortCode() { showDebug('Not yet implemented!'); return false; }
    parseConcatSMS() { showDebug('Not yet implemented!'); return false; }
    getPricing() { showDebug('Not yet implemented!'); return false; }
    sendFax() { showDebug('Not yet implemented!'); return false; }
    getFax() { showDebug('Not yet implemented!'); return false; }
} 