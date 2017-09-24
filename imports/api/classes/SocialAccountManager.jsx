import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export const SocialAccountDB = new Mongo.Collection(Meteor.settings.collections.socialAccount || 'social_accounts', { idGeneration: 'MONGO' });

export default class SocialAccountManager {
    constructor(accountId, accounts) {
        this.json = {
            accountId: accountId || null,
            accounts: accounts || {
                fb: {},
                ig: {},
                li: {},
                pi: {},
                tw: {}
            },
            createdDt: moment().valueOf()
        };
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }
    setFB(accessToken, appId, appSecret, pageId) {
        this.json.accounts = this.json.accounts || {};
        this.json.accounts.fb = this.json.accounts.fb || {};
        this.json.accounts.fb.accessToken = accessToken || '';
        this.json.accounts.fb.appId = appId || '';
        this.json.accounts.fb.appSecret = appSecret || '';
        this.json.accounts.fb.pageId = pageId || '';
    }
    setIG(username, password) {
        this.json.accounts = this.json.accounts || {};
        this.json.accounts.ig = this.json.accounts.ig || {};
        this.json.accounts.ig.username = username || '';
        this.json.accounts.ig.password = password || '';
    }
    setLI(accessToken, clientId, clientSecret, companyId) {
        this.json.accounts = this.json.accounts || {};
        this.json.accounts.li = this.json.accounts.li || {};
        this.json.accounts.li.accessToken = accessToken || '';
        this.json.accounts.li.clientId = clientId || '';
        this.json.accounts.li.clientSecret = clientSecret || '';
        this.json.accounts.li.companyId = companyId || '';
    }
    setPI(accessToken, clientId, clientSecret, username) {
        this.json.accounts = this.json.accounts || {};
        this.json.accounts.pi = this.json.accounts.pi || {};
        this.json.accounts.pi.accessToken = accessToken || '';
        this.json.accounts.pi.clientId = clientId || '';
        this.json.accounts.pi.clientSecret = clientSecret || '';
        this.json.accounts.pi.username = username || '';
    }
    setTW(consumerKey, consumerSecret, accessKey, accessSecret) {
        this.json.accounts = this.json.accounts || {};
        this.json.accounts.tw = this.json.accounts.tw || {};
        this.json.accounts.tw.consumerKey = consumerKey || '';
        this.json.accounts.tw.consumerSecret = consumerSecret || '';
        this.json.accounts.tw.accessKey = accessKey || '';
        this.json.accounts.tw.accessSecret = accessSecret || '';
    }
    flush() {
        if (this.json._id) {
            if (SocialAccountDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = SocialAccountDB.insert(this.json));
    }
}
