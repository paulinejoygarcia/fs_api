import { API_BASE, ENDPOINT } from '../../api/classes/Const';
import Util from '../../api/classes/Utilities';
import Onvoy from '../../api/classes/Onvoy';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';

Picker.middleware(multer().any());
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Meteor.startup(() => {
    Picker.route(`${API_BASE}:accountSid/:endpoint?`, function (params, request, response, next) {
        server.processRequest(params, request, response, next);
    });
    Picker.route(`${API_BASE}:accountSid/:endpoint/:sub?`, function (params, request, response, next) {
        server.processRequest(params, request, response, next);
    });
    Picker.route(`${API_BASE}:accountSid/:endpoint/:sub/:ext?`, function (params, request, response, next) {
        server.processRequest(params, request, response, next);
    });
    Picker.route('/freeswitch/:section?', function (params, request, response, next) {
        server.processFreeswitchRequest(params, request, response, next);
    });
    Picker.route(`/${(Meteor.settings.config.SMSUrl || 'interaction')}`, function (params, request, response, next) {
        let body = {};
        switch (request.method) {
            case 'POST':
                body = request.body;
                break;
            case 'GET':
                body = params.query;
                break;
        }
        if (body) {
            showDebug('SMS Received:', JSON.stringify(body)); // log received data
            let result = server.parseReceipt(body);// special case for Onvoy Connect
            if (result)
                return Util.affixResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify({
                    success: false,
                    error: 'Duplicate message detected!'
                }));
            result = server.parseIncoming(body); // convert to standard format
            if (result) {
                let interData = server.insertToMessages(result);
                if (interData) {
                    return Util.affixResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify({
                        success: true,
                        error: 'Successfully sent message'
                    }));
                } else {
                    return Util.affixResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify({
                        success: false,
                        error: 'Duplicate message detected!'
                    }));
                }
            }
        }
        Util.affixResponse(response, 400, { 'Content-Type': 'application/json' }, JSON.stringify({ success: false }));
    });
});