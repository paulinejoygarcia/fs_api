import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export const SocialCommentDB = new Mongo.Collection(Meteor.settings.collections.socialComment || 'social_comments', { idGeneration: 'MONGO' });

export default class SocialCommentManager {
    constructor(accountId, type, postId, comment, price) {
        this.json = {
            accountId: accountId || null,
            type: type || null,
            postId: postId || null,
            comment: comment || null,
            price: parseFloat(price) || 0,
            result: null,
            createdDt: moment().valueOf()
        };
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }
    setPrice(price) {
        this.json.price = parseFloat(price) || 0;
    }
    setResult(result) {
        this.json.result = result;
    }
    flush() {
        if (this.json._id) {
            if (SocialCommentDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = SocialCommentDB.insert(this.json));
    }
}
