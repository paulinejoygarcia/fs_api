import { ENDPOINT } from '../../api/classes/Const';
import Util from '../../api/classes/Utilities';
import Server from '../../api/classes/Server';
import bodyParser from 'body-parser';
import multer from 'multer';
import fs from 'fs';

Picker.middleware(multer().any());
Picker.middleware(bodyParser.json());
Picker.middleware(bodyParser.urlencoded({ extended: false }));

Meteor.startup(() => {
    let server = new Server();

    server.onConnectMySQL();

    Picker.route('/api/2017-09-12/accounts/:accountSid/:endpoint?', function (params, request, response, next) {
        server.processRequest(params, request, response, next);
    });
    Picker.route('/api/2017-09-12/accounts/:accountSid/:endpoint/:sub?', function (params, request, response, next) {
        server.processRequest(params, request, response, next);
    });
    Picker.route('/api/2017-09-12/accounts/:accountSid/:endpoint/:sub/:ext?', function (params, request, response, next) {
        server.processRequest(params, request, response, next);
    });
});