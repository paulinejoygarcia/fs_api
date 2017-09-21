import API from './API';
import MySqlWrapper from './MySqlWrapper';
import Util from './Utilities';
import { ENDPOINT, ENDPOINT_ACTION, ENDPOINT_CHECKPOINT, METHOD } from './Const';

export default class Server {
    constructor() {
        this.dbConnection = null;
    }
    /**
     * Connect to MySQL Server
     */
    onConnectMySQL() {
        if (!Meteor.settings.astpp || !Meteor.settings.astpp.db) {
            showError("No ASTPP db configuration found!");
            return;
        }

        let conn = new MySqlWrapper(
            Meteor.settings.astpp.db.host,
            Meteor.settings.astpp.db.user,
            Meteor.settings.astpp.db.password,
            Meteor.settings.astpp.db.database,
            Meteor.settings.astpp.db.port);
        if (conn.connection) {
            this.dbConnection = conn;
        }
    }
    /**
     * Process request received
     * @param {*} params 
     * @param {*} request 
     * @param {*} response 
     * @param {*} next 
     */
    processRequest(params, request, response, next) {
        let header = {};
        let body = null;
        let subEndpoint = params.sub;
        let extEndpoint = params.ext;
        let endpoint = params.endpoint;
        let retval = { success: false };
        let accountSid = params.accountSid;
        let ipAddress = request.connection.remoteAddress;
        let auth = this.checkAuth(request.headers.authorization);

        if (auth) {
            let data = this.getData(endpoint, request.method, params, request);
            if (data.success) {
                let result = null;
                let api = new API(accountSid, auth.api, auth.secret, data.body.accessCode, ipAddress);
                api.setDBConnection(this.dbConnection);

                if (endpoint !== ENDPOINT.AUTH && !api.checkAccessCode()) {
                    Util.affixResponse(response, 403, {
                        'Content-Type': 'application/json',
                    }, JSON.stringify({
                        error: 'Access denied! Invalid access code or expired access code.',
                        success: false,
                    }));
                    return;
                }

                api.setEndpoint(endpoint, subEndpoint, extEndpoint);

                result = api.doProcess(request.method, data.body);
                data = { ...data, ...result };
                retval = { ...retval, ...result };
            }
            retval.error = data.error;
            Util.affixResponse(response, data.code, {
                ...data.header,
                'Content-Type': 'application/json',
            }, JSON.stringify(retval));
            return;
        }
        Util.affixResponse(response, 401, {
            'WWW-Authenticate': 'Basic',
            'Content-Type': 'application/json',
        }, JSON.stringify({
            error: 'Invalid Authorization!',
            success: false,
        }));
    }
    /**
     * Validate authorization code
     * @param {String} authCode
     */
    checkAuth(authCode) {
        if (authCode && authCode.trim()) {
            let info = Util.decodeBase64(authCode.trim().replace('Basic ', ''));
            if ((info = info.split(':')).length > 1) {
                return {
                    api: info[0],
                    secret: info[1]
                };
            }
        }
        return null;
    }
    /**
     * Validate request data
     * @param {String} endpoint // Endpoint
     * @param {String} method 
     * @param {*} params 
     * @param {*} request 
     */
    getData(endpoint, method, params, request) {
        let retval = {
            body: {},
            header: {},
            code: 200,
            error: '',
            success: true
        }

        switch (method) {
            case METHOD.GET:
                retval.body = params.query;
                break;
            case METHOD.POST:
            case METHOD.PUT:
                retval.body = request.body;
                break;
        }

        if (ENDPOINT_CHECKPOINT[endpoint]) {
            if (!(ENDPOINT_CHECKPOINT[endpoint] instanceof Array) && !ENDPOINT_CHECKPOINT[endpoint][params.sub]) { // sub endpoint check
                retval.code = 404;
                retval.error = `Endpoint not found! /${endpoint}/${params.sub || ''}/`;
                retval.success = false;
            }
            if (ENDPOINT_CHECKPOINT[endpoint] instanceof Array) { // http method check
                let found = ENDPOINT_CHECKPOINT[endpoint].filter(method_ => method_ == method);
                if (!found.length) {
                    retval.code = 405;
                    retval.header = { 'Allow': ENDPOINT_CHECKPOINT[endpoint].join(',') };
                    retval.error = 'Method not allowed!';
                    retval.success = false;
                    return retval;
                }
            }
            if (ENDPOINT_CHECKPOINT[endpoint][params.sub] instanceof Array) { // http method check
                let found = ENDPOINT_CHECKPOINT[endpoint][params.sub].filter(method_ => method_ == method);
                if (!found.length) {
                    retval.code = 405;
                    retval.header = { 'Allow': ENDPOINT_CHECKPOINT[endpoint][params.sub].join(',') };
                    retval.error = 'Method not allowed!';
                    retval.success = false;
                    return retval;
                }
            }
        } else {
            retval.code = 404; // Request not found    
            retval.error = `Endpoint not found! /${endpoint}/`;
            retval.success = false;
        }

        // access code check
        switch (endpoint) {
            case ENDPOINT.AUTH:
                break;
            // requires access code
            case ENDPOINT.APP:
            case ENDPOINT.NUMBER:
            case ENDPOINT.SOCIAL:
                if (!retval.body.accessCode) {
                    retval.code = 404; // Forbidden
                    retval.error = 'Missing `accessCode` access denied!';
                    retval.success = false;
                    return retval;
                }
        }

        // data check and sanitation 
        switch (endpoint) {
            case ENDPOINT.APP:
                switch (method) {
                    case METHOD.PUT:
                        if (!params.sub || !params.sub.trim()) {
                            retval.code = 404;
                            retval.error = 'Missing `id` access denied!';
                            retval.success = false;
                            return retval;
                        }
                    case METHOD.POST:
                        break;
                }
                break;
        }

        return retval;
    }
}
showNotice = Util.showNotice;
showStatus = Util.showStatus;
showError = Util.showError;
showWarning = Util.showWarning;
showDebug = Util.showDebug;