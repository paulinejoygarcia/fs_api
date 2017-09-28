import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {REPORTS}  from './classes/Const';

export const PushNotifDB = new Mongo.Collection("push_notifications",{ idGeneration: 'MONGO' });
if (Meteor.isServer) {
    Meteor.publish(REPORTS.PUSH,function (data) {
        let cursor = null;
        try {
            let query = {};
            if(data.key && data.key.trim() !== "")
                query.$or = [
                    { "title": { $regex: data.key, $options: 'i' } },
                    { "body": { $regex: data.key, $options: 'i' } },
                ];
            query["createdTimestamp"] = { $gte : moment(data.from).unix() * 1000, $lte: moment(data.to).unix() * 1000};
            cursor = PushNotifDB.find(query,{sort:{"createdTimestamp":-1}});
            Util.setupHandler(this, "push_notifications", cursor, (doc) => {
                let newDoc = {};
                newDoc.Title = doc.title;
                newDoc.Message = doc.body;
                newDoc.Datetime = moment(doc.createdTimestamp).format("MMM DD, YYYY hh:mm A");
                return newDoc;
            });
        } catch (err) {
            //showError('publish[%s]: %s.', REPORTS.PUSH, err.message);
            console.error('publish[%s]: %s.', REPORTS.PUSH, err.message);
            return [];
        }
        this.ready();
    });
}