import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const CallsDB = new Mongo.Collection("calls",{ idGeneration: 'MONGO' });

if (Meteor.isServer) {
}