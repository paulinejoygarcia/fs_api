import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {REPORTS}  from './classes/Const';

export const MessageDB = new Mongo.Collection('messages');
if (Meteor.isServer) {
    Meteor.publish(REPORTS.MESSAGES,function (data) {
        let cursor = null;
        try {
            let query = {};
            if(data.key && data.key.trim() !== "")
                query.$or = [
                    { "from": { $regex: data.key, $options: 'i' } },
                    { "to": { $regex: data.key, $options: 'i' } },
                    { "body": { $regex: data.key, $options: 'i' } },
                ];
            query["createdTimestamp"] = { $gte : moment(data.from).unix() * 1000, $lte: moment(data.to).unix() * 1000};
            cursor = MessageDB.find(query,{sort:{"createdTimestamp":1}});
            Util.setupHandler(this, Meteor.settings.collections.message || 'messages', cursor, (doc) => {
                let newDoc = {};
                newDoc.Sender = doc.from;
                newDoc.Receiver = doc.to;
                newDoc.Message = doc.body;
                newDoc.HasAttachments = doc.attachment;
                newDoc.Datetime = moment(doc.createdTimestamp).format("MMM DD, YYYY hh:mm A");
                return newDoc;
            });
        } catch (err) {
            Util.showError('publish[%s]: %s.', REPORTS.MESSAGES, err.message);
            return [];
        }
        this.ready();
    });
}