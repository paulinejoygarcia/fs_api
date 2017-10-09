import path from 'path';
let basepath = path.resolve('.');
let separator = '\\';
if (process.env.OS && process.env.OS === 'Windows_NT') {
    /* windows */
    basepath = basepath.replace('.meteor\\local\\build\\programs\\server', ''); // undeployed
    basepath = basepath.replace('bundle\\programs\\server', ''); // deployed
} else {
    /* unix */
    basepath = basepath.replace('bundle/programs/server', ''); // deployed
    basepath = basepath.replace('.meteor/local/build/programs/server', ''); // undeployed
    separator = '/';
}
PATH = {
    BASE: basepath,
    UPLOAD: `${basepath}.files${separator}`,
    GIT: `${basepath}.git${separator}`,
    METEOR: `${basepath}.meteor${separator}`
};
functions = {};
Meteor.settings.config = Meteor.settings.config || {};
Meteor.settings.public = Meteor.settings.public || {};
Meteor.settings.public.config = Meteor.settings.public.config || {};
Meteor.settings.public.stripe = Meteor.settings.public.stripe || {};
Meteor.settings.public.stripe.test = Meteor.settings.public.stripe.test || {};
Meteor.settings.public.stripe.live = Meteor.settings.public.stripe.live || {};
Meteor.settings.astpp = Meteor.settings.astpp || {};
Meteor.settings.astpp.db = Meteor.settings.astpp.db || {};
Meteor.settings.pricing = Meteor.settings.pricing || {};
Meteor.settings.pricing.sms = Meteor.settings.pricing.sms || {};
Meteor.settings.pricing.mms = Meteor.settings.pricing.mms || {};