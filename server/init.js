import path from 'path';
import npmFS from 'fs';
import npmFuture from 'fibers/future';
import npmFiber from 'fibers';
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

let gv = {};

gv.BASE_PATH = basepath;
gv.UPLOAD_PATH = (basepath + '/uploads/').replace('//', '/');

gv.FS = npmFS;
gv.FUTURE = npmFuture;
gv.FIBER = npmFiber;

gv.FS_ESL_IP = 'FREESWITCH_IP_ADDRESS';
gv.FS_ESL_PORT = '8021';
gv.FS_ESL_PASSWORD = 'YOUR_ESL_PASSWORD';
gv.FS_API_KEY = 'API_KEY';
gv.FS_API_SECRET = 'API_SECRET';

gv.SMPP_IP = 'SMPP_IP_ADDRESS';
gv.SMPP_PORT = 2775;
gv.SMPP_SYSTEM_ID = 'SMPP_SYSTEM_ID';
gv.SMPP_PASSWORD = 'SMPP_PASSWORD';
gv.SMPP_SYSTEM_TYPE = 'SYSTEM_TYPE';

gv.SCP_HOST = 'SCP_IP_ADDRESS';
gv.SCP_USER = 'SCP_USER';
gv.SCP_PASS = 'SCP_PASSWORD';

gv.BANDWIDTH_SIP_HOST = 'BANDWIDTH_SIP_ADDRESS:PORT';
gv.BANDWIDTH_MM4_HOST = 'MM4_IP_ADDRESS';
gv.BANDWIDTH_MM4_PORT = 25;

gv.PRICING = {
    sms: {
        in: 0.002,
        out: 0.005
    },
    mms: {
        in: 0.01,
        out: 0.02
    },
    push_notification: 0.001,
    social_post: 0.003,
    social_comment: 0.002,
    fax: 0.04,
};

Meteor.settings.config = Meteor.settings.config || {};
Meteor.settings.public = Meteor.settings.public || {};
Meteor.GV = gv || {};