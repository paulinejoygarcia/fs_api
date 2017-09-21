import API from './API';
import MySqlWrapper from './MySqlWrapper';
import Util from './Utilities';
import { ENDPOINT, METHOD } from './Const';

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
            Meteor.settings.astpp.db.host || 'localhost',
            Meteor.settings.astpp.db.user || 'root',
            Meteor.settings.astpp.db.password || '',
            Meteor.settings.astpp.db.database || 'admin',
            Meteor.settings.astpp.db.port || 3306);
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

                if (endpoint !== ENDPOINT.AUTH && !api.checkAccessCode()) {
                    Util.affixResponse(response, 403, {
                        'Content-Type': 'application/json',
                    }, JSON.stringify({
                        error: 'Access denied! Invalid access code or expired access code.',
                        success: false,
                    }));
                    return;
                }

                api.setDBConnection(this.dbConnection);
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

        // access code check
        switch (endpoint) {
            case ENDPOINT.AUTH:
                break;
            // requires access code
            case ENDPOINT.APP:
                if (!retval.body.accessCode) {
                    retval.code = 404; // Forbidden
                    retval.error = 'Missing `accessCode` access denied!';
                    retval.success = false;
                    return retval;
                }
        }

        // method check
        switch (endpoint) {
            case ENDPOINT.AUTH:
                if (method === METHOD.GET) {
                    return retval;
                }
                retval.header = { 'Allow': 'GET' };
                retval.code = 405; // Method not allowed
                retval.error = 'Method not allowed!';
                retval.success = false;
                break;
            case ENDPOINT.APP:
                switch (method) {
                    case METHOD.GET:
                    case METHOD.POST:
                    case METHOD.PUT:
                        return retval;
                }
                retval.header = { 'Allow': 'GET, POST, PUT' };
                retval.code = 405; // Method not allowed
                retval.error = 'Method not allowed!';
                retval.success = false;
                break;
            default:
                retval.code = 404; // Request not found    
                retval.error = 'Endpoint not found!';
                retval.success = false;
        }
        return retval;
    }
}
showNotice = Util.showNotice;
showStatus = Util.showStatus;
showError = Util.showError;
showWarning = Util.showWarning;
showDebug = Util.showDebug;