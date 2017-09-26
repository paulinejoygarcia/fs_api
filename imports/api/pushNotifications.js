import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const PushNotifDB = new Mongo.Collection("push_notifications",{ idGeneration: 'MONGO' });
if (Meteor.isServer) {
}