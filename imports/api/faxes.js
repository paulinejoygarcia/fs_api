import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import {REPORTS}  from './classes/Const';
import {FaxDB} from './classes/FaxManager';

if (Meteor.isServer) {
    Meteor.publish(REPORTS.FAXES,function (data) {
        let cursor = null;
        try {
            let query = {};
            if(data.key && data.key.trim() !== "")
                query.$or = [
                    { "to": { $regex: data.key, $options: 'i' } },
                    { "from": { $regex: data.key, $options: 'i' } },
                    { "direction": { $regex: data.key, $options: 'i' } },
                ];
            query["createdTimestamp"] = { $gte : moment(data.from).unix() * 1000, $lte: moment(data.to).unix() * 1000};
            cursor = FaxDB.find(query,{sort:{"createdTimestamp":1}});
            Util.setupHandler(this, Meteor.settings.collections.fax || 'faxes', cursor, (doc) => {
                let newDoc = {};
                newDoc.Sender = doc.from;
                newDoc.Receiver = doc.to;
                newDoc.Direction = doc.direction;
                newDoc.Duration = doc.duration;
                newDoc.Price = doc.price;
                newDoc.TotalPages = doc.total_pages;
                newDoc.TransferredPages = doc.transferred_pages;
                newDoc.Datetime = moment(doc.createdTimestamp).format("MMM DD, YYYY hh:mm A");
                return newDoc;
            });
        } catch (err) {
            Util.showError('publish[%s]: %s.', REPORTS.FAXES, err.message);
            return [];
        }
        this.ready();
    });
}