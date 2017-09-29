import API from './API';
import Joi from './Joi';
import Freeswitch from './Freeswitch';
import MySqlWrapper from './MySqlWrapper';
import Util from './Utilities';
import { execSync } from 'child_process';
import fs from 'fs';
import moment from 'moment';
import npmScp from 'scp2';
import future from 'fibers/future';
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

    getAccountBalance(accountData) {
        let balance = 0;
        if (accountData)
            balance = parseFloat(accountData.balance) + parseFloat(accountData.posttoexternal) * parseFloat(accountData.credit_limit);

        return balance;
    }

    isAccountBillable(accountData, price) {
        if (this.getAccountBalance(accountData) >= parseFloat(price)) {
            return true;
        }
        return false;
    }

    updateAccountBalance(accountData, amount, paymentType = 'debit') {
        if (this.dbConnection && accountData && parseFloat(amount)) {
            let balance = parseFloat(accountData.balance) - parseFloat(amount);
            if (paymentType == 'credit')
                balance = parseFloat(accountData.balance) + parseFloat(amount);
            return this.dbConnection.update('accounts', { balance }, `id=${accountData.id}`);
        }
    }

    chargeAccount(accountData, price) {
        let result = {
            success: false,
            error: 'Insufficient funds to process payment'
        };
        if (this.isAccountBillable(accountData, price)) {
            let charge = this.updateAccountBalance(accountData, price);
            if (charge) {
                result.success = true;
                result.error = '';
                result.data = 'Payment processed successfully';
            }
        }
        return result;
    }

    connectFreeswitch() {
        if (!Meteor.settings.freeswitch || !Meteor.settings.freeswitch.ip) {
            showError("No FreeSWITCH configuration found!");
            return;
        }

        let fs = new Freeswitch(Meteor.settings.freeswitch.ip, Meteor.settings.freeswitch.port, Meteor.settings.freeswitch.password);
        if (fs.isConnected()) {
            fs.setAstppDB(this.dbConnection);
            this.freeswitch = fs;
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

                result = api.doProcess(request.method, data.body, this.smtpSend, this.smppSend, this.processRequestUrl);
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
        };
        let joiSchema = null;

        switch (method) {
            case METHOD.GET:
            case METHOD.POST:
            case METHOD.PUT:
                retval.body = {
                    ...params.query,
                    ...request.body,
                    ...{ files: request.files }
                }
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
            case ENDPOINT.VOICE:
            case ENDPOINT.PUSH:
            case ENDPOINT.FAX:
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
                        joiSchema = {
                            friendly_name: Joi.string(true),
                            call_url: Joi.string(true, false, null, null, false, true),
                            call_method: Joi.string(true, false, [METHOD.GET, METHOD.POST]),
                            call_fb_url: Joi.string(true, false, null, null, false, true),
                            call_fb_method: Joi.string(true, false, [METHOD.GET, METHOD.POST]),
                            msg_url: Joi.string(true, false, null, null, false, true),
                            msg_method: Joi.string(true, false, [METHOD.GET, METHOD.POST]),
                            msg_fb_url: Joi.string(true, false, null, null, false, true),
                            msg_fb_method: Joi.string(true, false, [METHOD.GET, METHOD.POST]),
                            fax_url: Joi.string(true, false, null, null, false, true),
                            fax_method: Joi.string(true, false, [METHOD.GET, METHOD.POST]),
                            fax_fb_url: Joi.string(true, false, null, null, false, true),
                            fax_fb_method: Joi.string(true, false, [METHOD.GET, METHOD.POST]),
                        }
                        break;
                }
                break;
            case ENDPOINT.PUSH:
                switch (method) {
                    case METHOD.POST:
                        joiSchema = {
                            registration_id: Joi.string(true),
                            server_key: Joi.string(true),
                            title: Joi.string(true),
                            body: Joi.string(true),
                            icon: Joi.string(false, "uri"),
                            action: Joi.string(false, "uri"),
                        }
                        break;
                }

            case ENDPOINT.FAX:
                switch (method) {
                    case METHOD.POST:
                        let files = [];
                        if (retval.body.files) {
                            retval.body.files.forEach(file => {
                                if (file.fieldname == 'files') {
                                    let localpath = `${moment().format('MMDDYYYYhhmmss')}_${file.originalname}`;
                                    fs.writeFileSync(PATH.UPLOAD + localpath, file.buffer);
                                    files.push({
                                        filename: localpath,
                                        encoding: file.encoding,
                                        mime_type: file.mimetype
                                    });
                                }
                            });
                            retval.body.files = files;
                        }
                        if (!retval.body.files || retval.body.files.length == 0) {
                            retval.code = 400;
                            retval.error = '`files` is required';
                            retval.success = false;
                            return retval;
                        }

                        joiSchema = {
                            to: Joi.number(true),
                            from: Joi.number(true),
                            files: Joi.array(Joi.file('files', false), 1)
                        };
                        break;
                }
                break;
            case ENDPOINT.NUMBER:
                if (params.sub == ENDPOINT_ACTION.NUMBER_INCOMING) {
                    joiSchema = {
                        did_id: Joi.number(true),
                        app_id: Joi.number(true)
                    };
                }
                break;
            case ENDPOINT.SOCIAL:
                switch (params.sub) {
                    case ENDPOINT_ACTION.SOCIAL_ACCOUNT: {
                        switch (params.ext) {
                            case ENDPOINT_ACTION.SOCIAL_FB:
                                joiSchema = {
                                    access_token: Joi.string(true, 'alphanum'),
                                    app_id: Joi.number(true),
                                    app_secret: Joi.string(true, 'alphanum'),
                                    page_id: Joi.string(true)
                                };
                                break;
                            case ENDPOINT_ACTION.SOCIAL_IG:
                                joiSchema = {
                                    username: Joi.string(true),
                                    password: Joi.string(true)
                                };
                                break;
                            case ENDPOINT_ACTION.SOCIAL_LI:
                                joiSchema = {
                                    access_token: Joi.string(true),
                                    client_id: Joi.string(true, 'alphanum'),
                                    client_secret: Joi.string(true, 'alphanum'),
                                    company_id: Joi.string(true)
                                };
                                break;
                            case ENDPOINT_ACTION.SOCIAL_PI:
                                joiSchema = {
                                    access_token: Joi.string(true),
                                    client_id: Joi.string(true),
                                    client_secret: Joi.string(true),
                                    username: Joi.string(true)
                                };
                                break;
                            case ENDPOINT_ACTION.SOCIAL_TW:
                                joiSchema = {
                                    consumer_key: Joi.string(true),
                                    consumer_secret: Joi.string(true),
                                    access_key: Joi.string(true),
                                    access_secret: Joi.string(true)
                                };
                                break;
                            default:
                                retval.code = 400;
                                retval.error = `Site not found: ${params.ext}`;
                                retval.success = false;
                        }
                        break;
                    }
                    case ENDPOINT_ACTION.SOCIAL_COMMENT: {
                        switch (params.ext) {
                            case ENDPOINT_ACTION.SOCIAL_FB:
                            case ENDPOINT_ACTION.SOCIAL_LI:
                            case ENDPOINT_ACTION.SOCIAL_TW:
                                joiSchema = {
                                    post_id: Joi.string(true),
                                    comment: Joi.string(true)
                                };
                                break;
                            default:
                                retval.code = 400;
                                retval.error = `Site not found: ${params.ext}`;
                                retval.success = false;
                        }
                        break;
                    }
                    case ENDPOINT_ACTION.SOCIAL_POST: {
                        switch (params.ext) {
                            case ENDPOINT_ACTION.SOCIAL_FB:
                                if (retval.body.files) {
                                    retval.body.files.forEach(file => {
                                        switch (file.fieldname) {
                                            case 'image':
                                                let localpath = `${moment().format('MMDDYYYYhhmmss')}_${file.originalname}`;
                                                fs.writeFileSync(PATH.UPLOAD + localpath, file.buffer);
                                                retval.body[file.fieldname] = {
                                                    filename: localpath,
                                                    encoding: file.encoding,
                                                    mime_type: file.mimetype
                                                };    
                                                break;    
                                        }
                                    });
                                }    
                                joiSchema = {
                                    status: Joi.string(true),
                                    image: Joi.file('image'),
                                    link: Joi.string(false, null, [], [], true)
                                };
                                break;
                            case ENDPOINT_ACTION.SOCIAL_IG:
                                if (retval.body.files) {
                                    retval.body.files.forEach(file => {
                                        switch (file.fieldname) {
                                            case 'image':
                                            case 'video':
                                            case 'cover_photo':
                                                let localpath = `${moment().format('MMDDYYYYhhmmss')}_${file.originalname}`;
                                                fs.writeFileSync(PATH.UPLOAD + localpath, file.buffer);
                                                retval.body[file.fieldname] = {
                                                    filename: localpath,
                                                    encoding: file.encoding,
                                                    mime_type: file.mimetype
                                                };
                                                break;
                                        }
                                    });
                                }        
                                joiSchema = {
                                    caption: Joi.string(),
                                    image: Joi.file('image'),
                                    video: Joi.file('video'),
                                    cover_photo: Joi.file('cover_photo')
                                };
                                break;
                            case ENDPOINT_ACTION.SOCIAL_LI:
                                joiSchema = {
                                    comment: Joi.string(false, null, [], [], true),
                                    title: Joi.string(false, null, [], [], true),
                                    desc: Joi.string(false, null, [], [], true),
                                    url: Joi.string(false, null, [], [], true),
                                    image_url: Joi.string(false, null, [], [], true)
                                };
                                break;
                            case ENDPOINT_ACTION.SOCIAL_PI:
                                if (type = retval.body.type) {
                                    if (type == 'board') {
                                        joiSchema = {
                                            type: Joi.string(true),
                                            name: Joi.string(true),
                                            desc: Joi.string(false, null, [], [], true)
                                        };
                                    } else if (type == 'pin') {
                                        if (retval.body.files) {
                                            retval.body.files.forEach(file => {
                                                switch (file.fieldname) {
                                                    case 'image':
                                                        let localpath = `${moment().format('MMDDYYYYhhmmss')}_${file.originalname}`;
                                                        fs.writeFileSync(PATH.UPLOAD + localpath, file.buffer);
                                                        retval.body[file.fieldname] = {
                                                            filename: localpath,
                                                            encoding: file.encoding,
                                                            mime_type: file.mimetype
                                                        };
                                                        break;
                                                }
                                            });
                                        }   
                                        joiSchema = {
                                            type: Joi.string(true),
                                            board: Joi.string(true),
                                            note: Joi.string(false, null, [], [], true),
                                            link: Joi.string(false, null, [], [], true),
                                            image: Joi.file('image'),
                                            image_url: Joi.string(false, null, [], [], true)
                                        };
                                    } else {
                                        retval.code = 400;
                                        retval.error = '`type` should be one of [board, pin]';
                                        retval.success = false;
                                    }
                                } else {
                                    retval.code = 400;
                                    retval.error = '`type` parameter is required';
                                    retval.success = false;
                                }
                                break;
                            case ENDPOINT_ACTION.SOCIAL_TW:
                                if (retval.body.files) {
                                    retval.body.files.forEach(file => {
                                        switch (file.fieldname) {
                                            case 'image':
                                                let localpath = `${moment().format('MMDDYYYYhhmmss')}_${file.originalname}`;
                                                fs.writeFileSync(PATH.UPLOAD + localpath, file.buffer);
                                                retval.body[file.fieldname] = {
                                                    filename: localpath,
                                                    encoding: file.encoding,
                                                    mime_type: file.mimetype
                                                };
                                                break;
                                        }
                                    });
                                }       
                                joiSchema = {
                                    status: Joi.string(false, null, [], [], true),
                                    image: Joi.file('image')
                                };
                                break;
                            default:
                                retval.code = 400;
                                retval.error = `Site not found: ${params.ext}`;
                                retval.success = false;
                        }
                        break;
                    }
                }
                break;
        }

        if (joiSchema) {
            let validate = Joi.validate(retval.body, joiSchema);
            if (validate.valid) {
                retval.body = {
                    accessCode: retval.body.accessCode,
                    ...validate.data
                };
            } else {
                retval.code = 400;
                retval.error = validate.data;
                retval.success = false;
            }
        }

        return retval;
    }

    smppSend(from, to, message) {
        if (this._smpp) {
            return this._smpp.submitSm(from, to, message);
        }
        return {
            success: false,
            data: 'SMPP server down'
        }
    }

    smppReceive(from, to, message) {
        const that = this;
        const account = that._astpp.accountDidOwner(to);
        if (!account.success) return;

        let price = Meteor.GV.PRICING.sms.in;
        price = Message.getParts(message) * price;
        const billable = that._astpp.checkBalance(price, account.data.account_id);
        if (!billable.success) return billable;

        const v = {
            from: from,
            to: to,
            body: message,
            direction: 'inbound',
            message_id: Meteor.UTILS.md5Hash(from + to + message),
            price: price,
            account_id: account.data.account_id
        };
        let record = new Message(v);
        record.insert();

        const app = that._astpp.didApp(to);

        if (!app.success) return;

        if (app.data.msg_url || app.data.msg_fb_url) {
            that._astpp.accountCharge(price, account.data.account_id);
            const xml = Server.processRequestUrl(v, app.data.msg_url, app.data.msg_method, app.data.msg_fb_url, app.data.msg_fb_method);
        }
    }

    smtpSend(from, to, originator, att, body, host = 'localhost', port = 25) {
        const fut = Server.newFuture();
        const client = Smtp.createClient(host, port);

        client.once('idle', function () {
            client.useEnvelope({
                from: from,
                to: [to]
            });
        });

        client.on('message', function () {
            const eml = MM4.constructMms(`<${from}>`, `<${to}>`, `<${originator}>`, att, body);
            const cws = Meteor.GV.FS.createWriteStream(`${Meteor.GV.UPLOAD_PATH}Message-snd-${Date.now()}.eml`);
            cws.once('open', (fd) => {
                cws.write(eml);
                cws.end();
            });

            const bufferStream = new stream.PassThrough();
            bufferStream.end(new Buffer(eml));
            bufferStream.pipe(client);
        });

        client.on('ready', function (success, response) {
            if (success) {
                console.log('The message was transmitted successfully', response);
                client.quit();
                const id = response.substring(response.lastIndexOf("<") + 1, response.lastIndexOf(">"));
                fut.return({
                    success: true,
                    data: id
                });
            } else {
                fut.return({
                    success: false,
                    data: `MMS not sent: ${response}`
                });
            }
        });

        client.on('error', function (err, stage) {
            client.quit();
            fut.return({
                success: false,
                data: `MMS not sent`
            });
        });

        return fut.wait();
    }

    smtpReceive(file) {
        const that = this;
        const p = MM4.parseMms(file);
        const msgId = p.messageId;
        const body = p.body;
        const attachment = p.attachment;
        delete p.body;
        delete p.attachment;
        if (MM4.isResponse(p.messageType) && (rec = Message.getByInternalId(p.internalMessageId))) {
            rec.result = p;
            rec.message_id = msgId;
            rec.update();
        } else if (MM4.isRequest(p.messageType) && attachment) {
            const from = MM4.getNumber(p.from);
            const to = MM4.getNumber(p.to);
            const account = that._astpp.accountDidOwner(to);
            if (!account.success) return;

            const price = Meteor.GV.PRICING.mms.in;
            const billable = that._astpp.checkBalance(price, account.data.account_id);
            if (!billable.success) return billable;

            const v = {
                direction: 'inbound',
                from: from,
                to: to,
                body: body,
                attachment: attachment,
                message_id: msgId,
                result: p,
                account_id: account.data.account_id,
                price: price
            };
            let record = new Message(v);
            record.insert();

            const app = that._astpp.didApp(to);
            if (!app.success) return;

            if (app.data.msg_url || app.data.msg_fb_url) {
                delete v.result;
                that._astpp.accountCharge(price, account.data.account_id);
                const xml = Server.processRequestUrl(v, app.data.msg_url, app.data.msg_method, app.data.msg_fb_url, app.data.msg_fb_method);
            }
        }
    }

    static processRequestUrl(params, url, method = 'get', fallback, fb_method = 'get', accountId = null) {
        let xml = {};
        if (url && method) {
            xml = Server.httpRequest(url, method, params);
            if (xml.statusCode != 200 && fallback && fb_method)
                xml = Server.httpRequest(fallback, fb_method, params);
        }

        if (x = xml.data) {
            let xp = new XmlParser(x, accountId);
            const parsed = xp.process();
            if (parsed.success) return parsed.data;
        }
    }

    static httpRequest(url, method, params, data, headers) {
        if (method.toLowerCase() != 'get' && method.toLowerCase() != 'post') {
            return {
                statusCode: 400,
                body: 'Bad Request'
            };
        }
        try {
            let opts = {};
            if (h = headers) opts.headers = h;
            if (p = params) opts.params = p;
            if (d = data) opts.data = d;
            let result = HTTP.call(method.toUpperCase(), url, opts);
            return {
                statusCode: 200,
                data: result.content
            };
        } catch (e) {
            return {
                statusCode: (e.response) ? e.response.statusCode : 400,
                data: (e.response) ? e.response.data : 'Cannot make HTTP request'
            };
        }
    }

    static newFuture() {
        return new Meteor.GV.FUTURE();
    }

    processFreeswitchRequest(params, request, response, next) {
        let sections = ['dialplan', 'fax_callback'];
        let section = params.section;
        let ipAddress = request.connection.remoteAddress;
        if (ipAddress != Meteor.settings.freeswitch.ip && ipAddress != '127.0.0.1') {
            Util.affixResponse(response, 401, {
                'Content-Type': 'application/json',
            }, JSON.stringify({ success: false, error: 'Unauthorized access' }));
            return;
        }

        if (request.method !== METHOD.POST) {
            Util.affixResponse(response, 405, {
                'Allow': 'POST',
                'Content-Type': 'application/json',
            }, JSON.stringify({ success: false, error: 'Method not allowed!' }));
        }

        if (sections.indexOf(section) === -1) {
            Util.affixResponse(response, 404, {
                'Content-Type': 'application/json',
            }, JSON.stringify({ success: false, error: `Endpoint not found: ${section}` }));
        }

        let body = response.body;
        let retval = {
            success: true,
            code: 200,
            data: null
        };

        switch (section) {
            case 'diaplan':
                retval = this.freeswitch.dialplan(body);
                break;
            case 'fax_callback':
                retval = this.freeswitch.faxCallback(body);
                break;
        }

        Util.affixResponse(response, 200, {
            'Content-Type': 'application/json',
        }, JSON.stringify(retval));
    }
    pdfToTiff(src, dest) {
        if (typeof src == 'string') src = [src];
        const command = 'gs -q -r204x196 -g1728x2156 -dNOPAUSE -dBATCH -dSAFER -sDEVICE=tiffg3 -sOutputFile=' + dest + ' ' + src.join(' ');
        if (typeof execSync === 'function') execSync(command);
        if (fs.existsSync(dest)) return {
            success: true,
            data: 'Conversion successful'
        }

        return {
            success: false,
            data: 'TIFF file not found'
        };
    }

    scp(file, newName, path = '/tmp', isDownload) {
        const fut = new future();
        let fileName = file.split('/').pop();
        if (newName) fileName = newName + '.' + file.split('.').pop();

        let params = {
            host: Meteor.settings.scp.host,
            username: Meteor.settings.scp.user,
            password: Meteor.settings.scp.pass
        };
        if (isDownload) {
            params.path = file;
            npmScp.scp(params, path, function (err) {
                fut.return(err);
            });
        } else {
            params.path = `${path}/${fileName}`;
            npmScp.scp(file, params, function (err) {
                fut.return(err);
            });
        }
        if (fut.wait()) return false;
        return fileName;
    }
}
showNotice = Util.showNotice;
showStatus = Util.showStatus;
showError = Util.showError;
showWarning = Util.showWarning;
showDebug = Util.showDebug;