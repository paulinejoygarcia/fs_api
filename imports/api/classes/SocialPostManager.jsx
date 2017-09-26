import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export const SocialPostDB = new Mongo.Collection(Meteor.settings.collections.socialPost || 'social_posts', { idGeneration: 'MONGO' });

export default class SocialPostManager {
    constructor(accountId, type, post, price) {
        this.json = {
            accountId: accountId || null,
            type: type || null,
            post: post || {},
            price: parseFloat(price) || 0,
            result: null,
            createdDt: moment().valueOf()
        };

        this.isSet = false;
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };

        this.isSet = true;
    }
    setFB(status, image, link) {
        this.json.post = this.json.post || {};
        this.json.post.status = status || '';
        this.json.post.image = image || {};
        this.json.post.link = link || '';

        this.isSet = true;
    }
    setIG(caption, image, video, coverPhoto) {
        this.json.post = this.json.post || {};
        this.json.post.caption = caption || '';
        this.json.post.image = image || {};
        this.json.post.video = video || {};
        this.json.post.coverPhoto = coverPhoto || {};

        this.isSet = true;
    }
    setLI(comment, title, desc, url, imageUrl) {
        this.json.post = this.json.post || {};
        this.json.post.comment = comment || '';
        this.json.post.title = title || '';
        this.json.post.desc = desc || '';
        this.json.post.url = url || '';
        this.json.post.imageUrl = imageUrl || '';

        this.isSet = true;
    }
    setPIBoard(name, desc) {
        this.json.post = this.json.post || {};
        this.json.post.type = 'board';
        this.json.post.name = name || '';
        this.json.post.desc = desc || '';

        this.isSet = true;
    }
    setPIPin(board, note, link, image, imageUrl) {
        this.json.post = this.json.post || {};
        this.json.post.type = 'pin';
        this.json.post.board = board || '';
        this.json.post.note = note || '';
        this.json.post.link = link || '';
        this.json.post.image = image || {};
        this.json.post.imageUrl = imageUrl || '';

        this.isSet = true;
    }
    setTW(status, image) {
        this.json.post = this.json.post || {};
        this.json.post.status = status || '';
        this.json.post.image = image || {};

        this.isSet = true;
    }
    setResult(result) {
        this.json.result = result;
    }
    hasPost() {
        return this.isSet;
    }
    flush() {
        if (this.json._id) {
            if (SocialPostDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = SocialPostDB.insert(this.json));
    }
}
