import Util from '../../api/classes/Utilities';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';

Picker.middleware(multer().any());
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Meteor.startup(() => {
    Picker.route('/api/2017-09-19/accounts/:accountSid/:endpoint/:subendpoint?', function (params, request, response, next) {
        let retval = { success: false };
        let body = null;
        let accountSid = params.accountSid;
        let endpoint = params.endpoint;
        let subendpoint = params.subendpoint;
        let auth = request.headers.authorization;
        let header = {};
        switch (request.method) {
            case 'GET':
                body = params.query;
                break;
            case 'POST':
            case 'PUT':
                body = request.body;
                break;
            default:
                header = { 'Allow': 'GET, POST, PUT' };
        }

        if (!auth) {
            Util.affixResponse(response, 401, {
                'Content-Type': 'application/json',
            }, JSON.stringify({
                error: 'Invalid Authorization!',
                success: false,
                statusCode: 401
            }));
            return;
        } else if (body) {
            retval = server.parseAPI(accountSid, auth, body, request.method, endpoint, subendpoint, Util.getIP(request));
            if (!retval.error) {
                Util.affixResponse(response, 200, { 'Content-Type': 'application/json' }, JSON.stringify(retval));
                return;
            }
        } else
            retval.error = "Invalid request";
        Util.affixResponse(response, 404, {
            ...header,
            'Content-Type': 'application/json',

        }, JSON.stringify(retval));
    });
});