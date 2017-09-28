import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {REPORTS}  from './classes/Const';

export const CallsDB = new Mongo.Collection(Meteor.settings.collections.call || 'calls',{ idGeneration: 'MONGO' });

if (Meteor.isServer) {
    Meteor.publish(REPORTS.CALLS,function (data) {
        let cursor = null;
        try {
            let query = {};
            if(data.key && data.key.trim() !== "")
                query.$or = [
                    { "caller_id": { $regex: data.key, $options: 'i' } },
                    { "called_number": { $regex: data.key, $options: 'i' } },
                    { "disposition": { $regex: data.key, $options: 'i' } },
                    { "call_id": { $regex: data.key, $options: 'i' } },
                ];
            query["call_start"] = { $gte : moment(data.from).unix() * 1000, $lte: moment(data.to).unix() * 1000};
            cursor = CallsDB.find(query,{sort:{"call_start":1}});
            Util.setupHandler(this, Meteor.settings.collections.call || 'calls', cursor, (doc) => {
                let newDoc = {};
                newDoc.CallerID = doc.caller_id;
                newDoc.CalledNumber = doc.called_number;
                newDoc.Disposition = doc.disposition;
                newDoc.Duration = doc.duration;
                newDoc.Price = doc.price;
                newDoc.CallID = doc.call_id;
                newDoc.Datetime = moment(doc.call_start).format("MMM DD, YYYY hh:mm A");
                return newDoc;
            });
        } catch (err) {
            Util.showError('publish[%s]: %s.', REPORTS.CALLS, err.message);
            return [];
        }
        this.ready();
    });
}