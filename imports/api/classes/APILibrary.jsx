import { Meteor } from 'meteor/meteor';

export default class APILibrary {
    constructor(key, secret, accountId, debug) {
        this.ready = true;
        this.key = key || '';
        this.secret = secret || '';
        this.accountId = accountId || '';
        this.debug = debug || false;
        this.apiUrl = `/api/2017-09-12/accounts/${accountId}/`;
        this.basicAuth = `Basic ${btoa([key, secret].join(':'))}`;
        this.endpoints = {
            auth: 'auth',
            app: 'app',
            fax: 'fax',
            sms: 'message/sms',
            mms: 'message/mms',
            numberAvailable: 'number/available',
            numberIncoming: 'number/incoming',
            numberOwned: 'number/owned',
            push: 'push',
            screenshot: 'video/screenshot',
            socialAccount: 'social/account',
            socialComment: 'social/comment',
            socialPost: 'social/post',
            video: 'video/call',
            voice: 'voice/call'
        };
    }

    setAccessCode(code) {
        this.accessCode = code;
    }

    init(callback) {
        let that = this;
        let debug = that.debug;
        if (debug)
            console.log('Initializing API');

        $.ajax({
            url: `${that.apiUrl}${that.endpoints.auth}`,
            type: 'GET',
            headers: {
                Authorization: that.basicAuth
            },
            dataType: 'json',
            success: function (result) {
                if (result.success && result.data) {
                    that.accessCode = result.data.code;

                    if (debug)
                        console.log('Access Code acquired: ', that.accessCode);
                }

                if (callback)
                    callback.call(this, result);
            },
            error: function (err) {
                if (debug)
                    console.log('Error while acquiring accessCode: ', err.statusText, " - ", err.responseText);

                if (callback)
                    callback.call(this, err);
            }
        });
    }

    _get(endpoint, id, callback) {
        let that = this;
        let debug = that.debug;
        let params = {};
        params.accessCode = this.accessCode;
        let info = `/${endpoint}${id ? `/${id}` : ''}`;

        $.ajax({
            url: `${that.apiUrl}${endpoint}/${id || ''}`,
            type: 'GET',
            headers: {
                Authorization: that.basicAuth
            },
            data: params,
            dataType: 'json',
            success: function (result) {
                if (debug)
                    console.log(`GET ${info}`, result.data);

                if (callback)
                    callback.call(this, result);
            },
            error: function (err) {
                if (debug)
                    console.log(`Error while getting ${info}`, err.statusText, " - ", err.responseText);

                if (callback)
                    callback.call(this, err);
            }
        });
    }

    _post(endpoint, json, formData, callback) {
        let debug = this.debug;
        let options = {
            url: `${this.apiUrl}${endpoint}`,
            type: 'POST',
            headers: {
                Authorization: this.basicAuth
            },
            success: function (result) {
                if (debug)
                    console.log('Success', result.data);

                if (callback)
                    callback.call(this, result);
            },
            error: function (err) {
                if (debug)
                    console.log('Error', err.statusText, " - ", err.responseText);

                if (callback)
                    callback.call(this, err);
            }
        };

        if (formData) {
            formData.append('accessCode', this.accessCode);
            options.data = formData;
            options.contentType = false;
            options.processData = false;
        }

        if (json) {
            json.accessCode = this.accessCode;
            options.data = json;
            options.dataType = 'json';
        }

        $.ajax(options);
    }

    getApp(id, callback) {
        this._get(this.endpoints.app, id, callback);
    }

    createApp(params, callback) {
        this._saveApp(null, params, callback);
    }

    updateApp(id, params, callback) {
        this._saveApp(id, params, callback);
    }

    _saveApp(id, params, callback) {
        params = params || {};
        params.accessCode = this.accessCode;

        let debug = this.debug;
        if (debug)
            console.log(`${id ? 'Update' : 'Add'} Application`);

        $.ajax({
            url: `${this.apiUrl}${this.endpoints.app}/${id || ''}`,
            type: id ? 'PUT' : 'POST',
            headers: {
                Authorization: this.basicAuth
            },
            data: params,
            dataType: 'json',
            success: function (result) {
                if (debug)
                    console.log('Success', result.data);

                if (callback)
                    callback.call(this, result);
            },
            error: function (err) {
                if (debug)
                    console.log('Error', err.statusText, " - ", err.responseText);

                if (callback)
                    callback.call(this, err);
            }
        });
    }

    getFax(id, callback) {
        this._get(this.endpoints.fax, id, callback);
    }

    sendFax(params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Send Fax`);

        let formData = new FormData();
        formData.append('from', params.from);
        formData.append('to', params.to);
        if (params.files) {
            for (let i = 0; i < params.files.length; i++) {
                formData.append('files', params.files[i]);
            }
        }

        this._post(this.endpoints.fax, null, formData, callback);
    }

    getNumberAvailable(callback) {
        this._get(this.endpoints.numberAvailable, null, callback);
    }

    getNumberOwned(callback) {
        this._get(this.endpoints.numberOwned, null, callback);
    }

    purchaseNumber(params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Purchase Number`);

        this._post(this.endpoints.numberIncoming, params, null, callback);
    }

    getMms(id, callback) {
        this._get(this.endpoints.mms, id, callback);
    }

    sendMms(params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Send MMS`);

        let formData = new FormData();
        formData.append('from', params.from);
        formData.append('to', params.to);
        formData.append('body', params.body);
        if (params.files) {
            formData.append('attachment', params.files[0]);
        }

        this._post(this.endpoints.mms, null, formData, callback);
    }

    getSms(id, callback) {
        this._get(this.endpoints.sms, id, callback);
    }

    sendSms(params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Send SMS`);

        this._post(this.endpoints.sms, params, null, callback);
    }

    getPushNotification(id, callback) {
        this._get(this.endpoints.push, id, callback);
    }

    sendPushNotification(params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Send Push Notification`);

        this._post(this.endpoints.push, params, null, callback);
    }

    saveSocialAccount(type, params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Save Social Account`);

        this._post(`${this.endpoints.socialAccount}/${type}`, params, null, callback);
    }

    addSocialPost(type, params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Add Social Post`);

        let formData = new FormData();
        for (const key in params) {
            formData.append(key, params[key]);
        }

        this._post(`${this.endpoints.socialPost}/${type}`, null, formData, callback);
    }

    addSocialComment(type, params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Add Social Comment`);

        this._post(`${this.endpoints.socialComment}/${type}`, params, null, callback);
    }

    getVideoCall(id, callback) {
        this._get(this.endpoints.video, id, callback);
    }

    sendScreenshot(params, callback) {
        params = params || {};

        let debug = this.debug;
        if (debug)
            console.log(`Send Screenshot`);

        let formData = new FormData();
        formData.append('from', params.from);
        formData.append('to', params.to);
        formData.append('body', params.body);
        if (params.files) {
            formData.append('attachment', params.files[0]);
        }

        this._post(this.endpoints.screenshot, null, formData, callback);
    }

    getVoiceCall(id, callback) {
        this._get(this.endpoints.voice, id, callback);
    }
}