
import { ENDPOINT, ENDPOINT_ACTION, METHOD, MAX_API_LIFETIME } from './Const';
import { Enc } from './Encryption';
import Util from './Utilities';
import Facebook from './Facebook';
import Linkedin from './Linkedin';
import Pinterest from './Pinterest';
import Twitter from './Twitter';
import Instagram from './Instagram';
import PushNotification from './PushNotification';
import FaxManager, { FaxDB } from './FaxManager';
import { CCInfoDB, BillingInfoDB } from '../payment';
import SocialAccountManager, { SocialAccountDB } from './SocialAccountManager';
import SocialCommentManager, { SocialCommentDB } from './SocialCommentManager';
import SocialPostManager, { SocialPostDB } from './SocialPostManager';
import PushNotifManager from './PushNotifManager';
import moment from 'moment';
import { PushNotifDB } from '../pushNotifications';

export default class API {
    constructor(accountId, api, secret, accessCode, ipAddress) {
        this.api = api;
        this.secret = secret;
        this.accountId = accountId;
        this.accountData = null;
        this.accessCode = accessCode;
        this.ipAddress = ipAddress;
        this.endpoint = this.subEndpoint = this.extEndpoint = ENDPOINT.AUTH;
        this.enc = Enc(this.secret);
        this.databaseConnection = null;
    }

    setDBConnection(wrapper) {
        if (wrapper && wrapper.isConnected())
            this.databaseConnection = wrapper;
    }
    setFSConnection(freeswitch) {
        if (freeswitch && freeswitch.isConnected())
            this.freeswitchConnection = freeswitch;
    }
    setEndpoint(endpoint, sub, ext) {
        this.endpoint = endpoint;
        this.subEndpoint = sub;
        this.extEndpoint = ext;
    }

    checkAccessCode() {
        if (this.accessCode && this.databaseConnection && this.databaseConnection.isConnected()) {
            let code = this.enc.Decrypt(this.accessCode);
            if (code && (code = code.split(':')).length == 4) {
                let accountId = code[0];
                let apiSecret = code[1];
                let query = "SELECT * FROM `accounts` WHERE `account_id`=? AND `secret`=?";
                let result = this.databaseConnection.selectOne(query, [accountId, apiSecret]);
                if (result) {
                    let time = parseInt(code[2]);
                    let ipAddress = this.enc.XoR(code[3], time);
                    this.accountData = result;
                    if (accountId === this.accountId && this.secret === apiSecret && this.ipAddress === ipAddress) {
                        return (time - moment().valueOf()) > 0;
                    }
                }
            }
        }
        return false;
    }
    getAccountBalance() {
        return server.getAccountBalance(this.accountData);
    }

    isAccountBillable(price) {
        return server.isAccountBillable(this.accountData, price);
    }

    updateAccountBalance(amount, paymentType = 'debit') {
        return server.updateAccountBalance(this.accountData, amount, paymentType);
    }

    chargeAccount(price) {
        return server.chargeAccount(this.accountData, price);
    }

    didOwner(number) {
        return server.didOwner(number);
    }

    doProcess(method, body, smtpSend, smppSend, processRequestUrl) {
        delete body.accessCode;
        switch (this.endpoint) {
            case ENDPOINT.AUTH: {
                let query = "SELECT `api`, `secret` FROM `accounts` WHERE `account_id`=?";
                let result = this.databaseConnection.selectOne(query, this.accountId);
                if (result) {
                    let testCipher = Util.encodeBase64(this.enc.XoR(this.api, this.accountId));
                    if (testCipher == result.secret && result.secret == this.secret) {
                        let time = moment().add(MAX_API_LIFETIME, 'hour').valueOf();
                        let encIp = this.enc.XoR(this.ipAddress, time);
                        return {
                            success: true,
                            code: 200,
                            data: {
                                code: this.enc.Encrypt([this.accountId, result.secret, time, encIp].join(':'))
                            }
                        }
                    }
                }
                return {
                    success: false,
                    code: 404,
                    error: 'Account not found!'
                }
            }
            case ENDPOINT.APP:
                let data = [];
                switch (method) {
                    case METHOD.GET: {
                        if (this.subEndpoint) {
                            let query = "SELECT * FROM `fs_applications` WHERE `id` = ? AND `retired` = 0";
                            let result = this.databaseConnection.selectOne(query, this.subEndpoint);
                            if (result) {
                                data.push({
                                    "id": result.id,
                                    "friendly_name": result.friendly_name || '',
                                    "call_url": result.call_url || '',
                                    "call_method": result.call_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "call_fb_url": result.call_fb_url || '',
                                    "call_fb_method": result.call_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "msg_url": result.msg_url || '',
                                    "msg_method": result.msg_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "msg_fb_url": result.msg_fb_url || '',
                                    "msg_fb_method": result.msg_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "fax_url": result.fax_url || '',
                                    "fax_method": result.fax_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                    "fax_fb_url": result.fax_fb_url || '',
                                    "fax_fb_method": result.fax_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET
                                });
                            } else
                                data.push('APP NOT FOUND');
                        } else {
                            let query = "SELECT * FROM `fs_applications` WHERE `accountid` = ? AND `retired` = 0";
                            let results = this.databaseConnection.select(query, this.accountData.id);
                            if (results) {
                                results.forEach((result) => {
                                    data.push({
                                        "id": result.id,
                                        "friendly_name": result.friendly_name || '',
                                        "call_url": result.call_url || '',
                                        "call_method": result.call_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "call_fb_url": result.call_fb_url || '',
                                        "call_fb_method": result.call_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "msg_url": result.msg_url || '',
                                        "msg_method": result.msg_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "msg_fb_url": result.msg_fb_url || '',
                                        "msg_fb_method": result.msg_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "fax_url": result.fax_url || '',
                                        "fax_method": result.fax_method == METHOD.POST ? METHOD.POST : METHOD.GET,
                                        "fax_fb_url": result.fax_fb_url || '',
                                        "fax_fb_method": result.fax_fb_method == METHOD.POST ? METHOD.POST : METHOD.GET
                                    });
                                });
                            }
                        }
                    }
                        break;
                    case METHOD.POST:
                    case METHOD.PUT: {
                        let query = "SELECT id FROM `fs_applications` WHERE `friendly_name` = ?";
                        let dupe = this.databaseConnection.selectOne(query, body.friendly_name);
                        if (dupe && dupe.id !== parseInt(this.subEndpoint)) {
                            return { success: false, code: 400, data: `${body.friendly_name} already exists!` }
                        }
                        body.accountid = this.accountData.id;
                        if (this.subEndpoint) {
                            let result = this.databaseConnection.update('fs_applications', body, `id=${parseInt(this.subEndpoint)}`);
                            if (result) {
                                return {
                                    success: true,
                                    code: 200,
                                    data: { id: parseInt(this.subEndpoint), update: result }
                                }
                            }
                            return {
                                success: false,
                                code: 400,
                                data: `Application id '${this.subEndpoint}' not found!`
                            }
                        } else {
                            let result = this.databaseConnection.insert('fs_applications', body);
                            if (result) {
                                return { success: true, code: 200, data: { id: result } }
                            }
                            return { success: false, code: 500, data: 'Something went wrong!' }
                        }
                    }
                }
                return {
                    success: true,
                    code: 200,
                    data
                };
            case ENDPOINT.VOICE:
                data = [];
                query = 'SELECT callstart as call_start,' +
                    'callerid as caller_id,' +
                    'callednum as called_number,' +
                    'billseconds as duration,' +
                    'disposition,' +
                    'debit as price,' +
                    'uniqueid as call_id' +
                    ' FROM cdrs WHERE accountid = ' +
                    '(SELECT id from accounts WHERE account_id = ?)' +
                    (this.extEndpoint ? " AND uniqueid = '" + this.extEndpoint + "'" : "") +
                    ' ORDER BY callstart DESC' +
                    (body.limit ? ' LIMIT ' + body.limit : '');
                this.databaseConnection.select(query, [this.accountId]).forEach((accInfo) => {
                    data.push({
                        call_start: accInfo.call_start,
                        caller_id: accInfo.caller_id,
                        called_number: accInfo.called_number,
                        duration: accInfo.duration,
                        disposition: accInfo.disposition,
                        price: accInfo.price,
                        call_id: accInfo.call_id
                    });
                });
                return {
                    success: true,
                    code: 200,
                    data: data
                }
            case ENDPOINT.PUSH:
                data = [];
                switch (method) {
                    case METHOD.GET:
                        let queryPush = { account_id: this.accountId };
                        let optionsPush = { sort: { createdTimestamp: -1 } };
                        if (this.subEndpoint)
                            queryPush._id = this.subEndpoint.match(/^[0-9a-fA-F]{24}$/)?
                                new Mongo.ObjectID(this.subEndpoint):this.subEndpoint;
                        if (body.limit)
                            optionsPush.limit = parseInt(body.limit);
                        PushNotifDB.find(queryPush, optionsPush).fetch().forEach((PushNotif) => {
                            data.push({
                                _id: PushNotif._id._str,
                                registration_id: PushNotif.registration_id,
                                title: PushNotif.title,
                                body: PushNotif.body,
                                server_key: PushNotif.server_key,
                                icon: PushNotif.icon || null,
                                action: PushNotif.action || null,
                                priority: PushNotif.priority || 0,
                                message_id: PushNotif.message_id || "",
                                price: PushNotif.price || 0.0,
                                created_dt: moment(PushNotif.createdTimestamp).format("MMM-DD-YYYY hh:mm:ss A"),
                                account_id: PushNotif.account_id
                            });
                        });
                        return {
                            success: true,
                            code: 200,
                            data: data
                        };
                    case METHOD.POST:
                        body.account_id = this.accountId;
                        body.createdTimestamp = moment().valueOf();
                        return this.pushNotif(body,this.accountId);
                        break;
                }
                break;

            case ENDPOINT.FAX:
                switch (method) {
                    case METHOD.GET:
                        return this.faxGet(this.subEndpoint);
                    case METHOD.POST:
                        return this.faxSender(body.to, body.from, body.files);
                }
                break;

            case ENDPOINT.NUMBER:
                switch (this.subEndpoint) {
                    case ENDPOINT_ACTION.NUMBER_AVAILABLE:
                        return this.numberAvailable();
                    case ENDPOINT_ACTION.NUMBER_OWNED:
                        return this.numberOwned();
                    case ENDPOINT_ACTION.NUMBER_INCOMING:
                        return this.numberIncoming(body.did_id, body.app_id);
                }
                break;

            case ENDPOINT.SOCIAL:
                switch (this.subEndpoint) {
                    case ENDPOINT_ACTION.SOCIAL_ACCOUNT:
                        return this.socialAccount(this.extEndpoint, body);
                    case ENDPOINT_ACTION.SOCIAL_COMMENT:
                        return this.socialComment(this.extEndpoint, body);
                    case ENDPOINT_ACTION.SOCIAL_POST:
                        return this.socialPost(this.extEndpoint, body);
                }
                break;

            case ENDPOINT.MESSAGE:
                switch (method) {
                    case METHOD.POST:
                        try {

                        } catch (err) {
                            console.log('end point[%s]: %s.', ENDPOINT.MESSAGE, err.message);
                        }
                        break;
                    case METHOD.GET:
                        try {

                        } catch (err) {
                            console.log('end point[%s]: %s.', ENDPOINT.MESSAGE, err.message);
                        }
                        break;
                    default:
                        return {
                            success: false,
                            code: 404,
                            data: {}
                        };
                }
                break;

            case ENDPOINT.VIDEO:
                switch (method) {
                    case METHOD.POST:
                        switch (this.subEndpoint) {
                            case ENDPOINT_ACTION.VIDEO_SCREENSHOT:
                                const ctrl = new ScreenshotsCtrl(this.databaseConnection, body, this.accountId, smtpSend, smppSend, processRequestUrl, this.updateAccountBalance, this.isAccountBillable, this.getAccountBalance, this.didOwner);
                                let res = ctrl.insert();
                                if (res.success) res = ctrl.send();
                                return res;
                        }
                        break;
                    default:
                        return {
                            success: false,
                            code: 404,
                            data: {}
                        };
                }
                break;
        }
        return { success: false, code: 404, error: 'Invalid request!' };
    }

    pushNotif(body,accId){
        let result = null;
        let price = Meteor.settings.pricing.pushNotification || 0.001;
        let notif = new PushNotifManager(body,accId);
        if (!this.isAccountBillable(price)) {
            const error = {
                success: false,
                code: 400,
                error: 'Insufficient funds to process request'
            };
            notif.setResult(error);
            notif.flush();
            return error;
        }
        notif.flush();
        let pushNotif = new PushNotification(body.server_key, body.registration_id);
        result = pushNotif.sendNotif(notif.json);
        let error = 'Push Notification could not be processed';
        if (result) {
            notif.setResult(result);
            notif.flush();
            if (result.success) {
                let charge = this.chargeAccount(price);
                if(charge.success){
                    notif.setPrice(price);
                    notif.flush();
                }
                return {
                    success: charge.success,
                    code: 200,
                    data: {
                        _info: charge.success ? 'Push notification processed successfully' : charge.error,
                        ...result.data
                    }
                };
            } else {
                error = result.data
            }
        }

        return {
            success: false,
            code: 200,
            data: error
        };
    }

    faxGet(id) {
        if (id) {
            let fax = FaxDB.findOne({
                accountId: this.accountId,
                $or: [
                    { faxId: id },
                    { uuid: id }
                ]
            });
            if (fax) {
                let faxManager = new FaxManager(this.accountId);
                faxManager.parseJSON(fax);
                return {
                    success: true,
                    code: 200,
                    data: faxManager.toApiJson()
                };
            } else {
                return {
                    success: false,
                    code: 404,
                    error: 'Fax record not found'
                };
            }
        }

        return {
            success: true,
            code: 200,
            data: FaxDB.find({ accountId: this.accountId }).fetch().map(rec => {
                let faxManager = new FaxManager(this.accountId);
                faxManager.parseJSON(rec);
                return faxManager.toApiJson();
            })
        };
    }

    faxSender(to, from, files) {
        to = to.toString();
        from = from.toString();
        let price = Meteor.settings.pricing.fax || 0.04;
        let fax = new FaxManager(this.accountId, to, from, 'outbound', files);
        if (!this.isAccountBillable(price)) {
            let error = {
                success: false,
                code: 400,
                error: 'Insufficient funds to process request'
            };
            fax.setResult(error);
            fax.flush();
            return error;
        }
        if (!this.freeswitchConnection) {
            let error = {
                success: false,
                code: 400,
                error: 'Fax send temporarily unavailable. Please try again later.'
            };
            fax.setResult(error);
            fax.flush();
            return error;
        }
        fax.flush();

        let pdfs = [];
        if (files.length > 1) {
            files.forEach(function (f) {
                pdfs.push(PATH.UPLOAD + f.filename);
            });
        } else pdfs = [PATH.UPLOAD + files[0].filename];

        const fid = Util.md5Hash(from + to + Date.now());
        const destName = 'FAX-snd-' + fid + '.tiff';
        const dest = PATH.UPLOAD + destName;
        const convert = server.pdfToTiff(pdfs, dest);
        if (convert.success) {
            const copied = server.scp(dest);
            if (copied) {
                fax.setFaxId(fid);
                fax.setTIFF(copied);
                fax.flush();
                return this.freeswitchConnection.sendFax(from, to, fid, copied, this.accountData.number);
            }
            return {
                success: false,
                data: 'Could not generate TIFF file'
            };
        }

        return {
            success: true,
            code: 200,
            data: {
                msg: 'Fax queued successfully',
                faxId: fid
            }
        };
    }

    numberAvailable() {
        let query = 'SELECT id, number, setup, monthlycost FROM dids WHERE accountid = ? AND parent_id = ?';
        let numbers = this.databaseConnection.select(query, [0, 0]);
        return {
            success: true,
            code: 200,
            data: numbers || []
        };
    }

    numberOwned() {
        let query = 'SELECT id, number, setup, monthlycost FROM dids WHERE accountid = ? AND parent_id = ?';
        let numbers = this.databaseConnection.select(query, [this.accountData.id, 0]);
        return {
            success: true,
            code: 200,
            data: numbers || []
        };
    }

    numberIncoming(didId, appId) {
        let query = 'SELECT id, setup FROM dids WHERE id = ? AND accountid = ? AND parent_id = ?';
        let did = this.databaseConnection.selectOne(query, [didId, 0, 0]);
        if (!did) {
            return {
                success: false,
                code: 404,
                error: 'DID number not found'
            };
        }

        query = 'SELECT id FROM fs_applications WHERE id = ? AND accountid = ?';
        let app = this.databaseConnection.selectOne(query, [appId, this.accountData.id]);
        if (!app) {
            return {
                success: false,
                code: 404,
                error: 'Application not found'
            };
        }

        let charge = this.chargeAccount(did.setup);
        if (!charge.success) {
            return {
                success: false,
                code: 200,
                error: charge.error
            };
        }

        let values = {
            accountid: this.accountData.id,
            assign_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            fs_app_id: app.id
        };
        this.databaseConnection.update('dids', values, `id=${did.id}`);

        return {
            success: true,
            code: 200,
            data: 'DID number purchased successfully',
        };
    }

    socialAccount(site, params) {
        let socialAccount = new SocialAccountManager(this.accountId);
        let account = SocialAccountDB.findOne({ accountId: this.accountId });

        if (account)
            socialAccount.parseJSON(account);

        switch (site) {
            case ENDPOINT_ACTION.SOCIAL_FB:
                socialAccount.setFB(params.access_token, params.app_id, params.app_secret, params.page_id);
                break;
            case ENDPOINT_ACTION.SOCIAL_IG:
                socialAccount.setIG(params.username, params.password);
                break;
            case ENDPOINT_ACTION.SOCIAL_LI:
                socialAccount.setLI(params.access_token, params.client_id, params.client_secret, params.company_id);
                break;
            case ENDPOINT_ACTION.SOCIAL_PI:
                socialAccount.setPI(params.access_token, params.client_id, params.client_secret, params.username);
                break;
            case ENDPOINT_ACTION.SOCIAL_TW:
                socialAccount.setTW(params.consumer_key, params.consumer_secret, params.access_key, params.access_secret);
                break;
        }

        socialAccount.flush();

        return {
            success: true,
            code: 200,
            data: 'Social account saved'
        };
    }

    socialComment(site, params) {
        let postId = params.post_id;
        let comment = params.comment;
        let price = Meteor.settings.pricing.socialComment || 0.002;
        let socialComment = new SocialCommentManager(this.accountId, site, postId, comment);

        let account = SocialAccountDB.findOne({ accountId: this.accountId });
        if (!account) {
            const error = {
                success: false,
                code: 404,
                error: 'Social account record not found'
            };
            socialComment.setResult(error);
            socialComment.flush();
            return error;
        }

        if (!this.isAccountBillable(price)) {
            const error = {
                success: false,
                code: 400,
                error: 'Insufficient funds to process request'
            };
            socialComment.setResult(error);
            socialComment.flush();
            return error;
        }
        socialComment.flush();

        let result = null;
        switch (site) {
            case ENDPOINT_ACTION.SOCIAL_FB:
                let fbAcc = account.accounts.fb;
                let fb = new Facebook(fbAcc.accessToken, fbAcc.appId, fbAcc.appSecret, fbAcc.pageId);
                result = fb.postComment(postId, comment);
                break;
            case ENDPOINT_ACTION.SOCIAL_LI:
                let liAcc = account.accounts.li;
                let li = new Linkedin(liAcc.username, liAcc.password);
                result = li.postComment(postId, comment);
                break;
            case ENDPOINT_ACTION.SOCIAL_TW:
                let twAcc = account.accounts.tw;
                let tw = new Twitter(twAcc.consumerKey, twAcc.consumerSecret, twAcc.accessKey, twAcc.accessSecret);
                result = tw.createTweet(comment, null, postId);
                break;
        }

        let error = 'Social comment could not be posted';
        if (result) {
            socialPost.setPrice(price);
            socialComment.setResult(result);
            socialComment.flush();
            if (result.success) {
                let charge = this.chargeAccount(price);
                return {
                    success: charge.success,
                    code: 200,
                    data: {
                        _info: charge.success ? 'Social comment posted successfully' : charge.error,
                        ...result.data
                    }
                };
            } else {
                error = result.data
            }
        }

        return {
            success: false,
            code: 200,
            data: error
        };
    }

    socialPost(site, params) {
        let result = null;
        let price = Meteor.settings.pricing.socialPost || 0.003;
        let socialPost = new SocialPostManager(this.accountId, site);
        let account = SocialAccountDB.findOne({ accountId: this.accountId });
        if (!account) {
            const error = {
                success: false,
                code: 404,
                error: 'Social account record not found'
            };
            socialPost.setResult(error);
            socialPost.flush();
            return error;
        }
        if (!this.isAccountBillable(price)) {
            const error = {
                success: false,
                code: 400,
                error: 'Insufficient funds to process request'
            };
            socialPost.setResult(error);
            socialPost.flush();
            return error;
        }
        socialPost.flush();

        switch (site) {
            case ENDPOINT_ACTION.SOCIAL_FB:
                socialPost.setFB(params.status, params.image, params.link);
                let fbAcc = account.accounts.fb;
                let fb = new Facebook(fbAcc.accessToken, fbAcc.appId, fbAcc.appSecret, fbAcc.pageId);
                if (params.image) {
                    result = fb.postImage(PATH.UPLOAD + params.image.filename, params.status);
                } else {
                    if (params.link) result = fb.postStatus(params.status, params.link);
                    else result = fb.postStatus(params.status);
                }
                break;
            case ENDPOINT_ACTION.SOCIAL_IG:
                socialPost.setIG(params.caption, params.image, params.video, params.cover_photo);
                let igAcc = account.accounts.ig;
                let ig = new Instagram(igAcc.username, igAcc.password);
                if (params.image) {
                    result = ig.postImage(PATH.UPLOAD + params.image.filename, params.caption);
                } else if (params.video && params.cover_photo) {
                    result = ig.postVideo(PATH.UPLOAD + params.video.filename, params.caption, PATH.UPLOAD + params.cover_photo.filename);
                } else {
                    result = {
                        success: false,
                        data: 'You must include an image or a video in your post'
                    };
                }
                break;
            case ENDPOINT_ACTION.SOCIAL_LI:
                socialPost.setLI(params.comment, params.title, params.desc, params.url, params.image_url);
                let liAcc = account.accounts.li;
                let li = new Linkedin(liAcc.username, liAcc.password);
                result = li.createPost(params.comment, params.title, params.desc, params.url, params.image_url);
                break;
            case ENDPOINT_ACTION.SOCIAL_PI:
                let piAcc = account.accounts.pi;
                let pi = new Pinterest(piAcc.clientId, piAcc.clientSecret, piAcc.username, piAcc.accessToken);
                if (params.type == 'board') {
                    socialPost.setPIBoard(params.name, params.desc);
                    result = pi.createBoard(params.name, params.desc);
                } else if (params.type == 'pin') {
                    socialPost.setPIPin(params.board, params.note, params.link, params.image, params.image_url);
                    let image = (params.image) ? PATH.UPLOAD + params.image.filename : null;
                    result = pi.createPin(params.board, params.note, params.link, image, params.image_url);
                }
                break;
            case ENDPOINT_ACTION.SOCIAL_TW:
                socialPost.setTW(params.status, params.image);
                let twAcc = account.accounts.tw;
                let tw = new Twitter(twAcc.consumerKey, twAcc.consumerSecret, twAcc.accessKey, twAcc.accessSecret);
                let image = (params.image) ? PATH.UPLOAD + params.image.filename : null;
                if (image) result = tw.createTweet(params.status, image);
                else result = tw.createTweet(params.status);
                break;
        }

        let error = 'Social post could not be processed';
        if (result) {
            socialPost.setPrice(price);
            socialPost.setResult(result);
            socialPost.flush();
            if (result.success) {
                let charge = this.chargeAccount(price);
                return {
                    success: charge.success,
                    code: 200,
                    data: {
                        _info: charge.success ? 'Social post processed successfully' : charge.error,
                        ...result.data
                    }
                };
            } else {
                error = result.data
            }
        }

        return {
            success: false,
            code: 200,
            data: error
        };
    }
}
