export const MAX_API_LIFETIME = 4; // 4 hours
export const API_BASE = '/api/2017-09-12/accounts/';

export const ROUTE_COMPONENT = {
    DASHBOARD: 'dashboard',
    ACCOUNT: {
        INFO: 'info',
        PROFILE: 'profile',
        BILLING: 'billing',
        INVOICE: 'invoices',
    },
    REPORTS: 'reports',
};
export const REPORTS = {
    PUSH: 'push',
    CALLS: 'calls',
    FAXES: 'faxes',
    MESSAGES: 'messages',
};
export const ROUTE_API_DOC = {
    APPLICATION: 'application',
    FAX: 'fax',
    MESSAGE: {
        SMS: 'message-sms',
        MMS: 'message-mms'
    },
    NUMBER: 'number',
    PUSH: 'push-notification',
    SOCIAL: {
        ACCOUNT: 'social-account',
        COMMENT: 'social-comment',
        POST: 'social-post',
    },
    VIDEO: {
        CALL: 'video-call',
        SCREENSHOT: 'video-screenshot'
    },
    VOICE: 'voice-call',
    EXPLORER: 'explorer',
};

export const ROUTE_API_MENU = [
    {
        name: 'Application',
        route: ROUTE_API_DOC.APPLICATION,
        icon: 'zmdi-font',
    },
    {
        name: 'Fax',
        route: ROUTE_API_DOC.FAX,
        icon: 'zmdi-print',
    },
    {
        name: 'Message',
        route: null,
        icon: 'zmdi-email',
        subList: [
            {
                name: 'SMS',
                route: ROUTE_API_DOC.MESSAGE.SMS,
                icon: 'zmdi-comment-alt',
            },
            {
                name: 'MMS',
                route: ROUTE_API_DOC.MESSAGE.MMS,
                icon: 'zmdi-image',
            }
        ]
    },
    {
        name: 'Number',
        route: ROUTE_API_DOC.NUMBER,
        icon: 'zmdi-smartphone-iphone',
    },
    {
        name: 'Push Notification',
        route: ROUTE_API_DOC.PUSH,
        icon: 'zmdi-notifications',
    },
    {
        name: 'Social',
        route: null,
        icon: 'zmdi-share',
        subList: [
            {
                name: 'Account',
                route: ROUTE_API_DOC.SOCIAL.ACCOUNT,
                icon: 'zmdi-account-circle',
            },
            {
                name: 'Comment',
                route: ROUTE_API_DOC.SOCIAL.COMMENT,
                icon: 'zmdi-comment',
            },
            {
                name: 'Post',
                route: ROUTE_API_DOC.SOCIAL.POST,
                icon: 'zmdi-edit',
            }
        ]
    },
    {
        name: 'Video',
        route: null,
        icon: 'zmdi-videocam',
        subList: [
            {
                name: 'Call',
                route: ROUTE_API_DOC.VIDEO.CALL,
                icon: 'zmdi-phone',
            },
            {
                name: 'Screenshot',
                route: ROUTE_API_DOC.VIDEO.SCREENSHOT,
                icon: 'zmdi-camera-alt',
            }
        ]
    },
    {
        name: 'Voice',
        route: ROUTE_API_DOC.VOICE,
        icon: 'zmdi-mic',
    },
];

export const METHOD = {
    GET: 'GET',         //The GET method requests a representation of the specified resource. Requests using GET should only retrieve data.
    HEAD: 'HEAD',       //The HEAD method asks for a response identical to that of a GET request, but without the response body.
    POST: 'POST',       //The POST method is used to submit an entity to the specified resource, often causing a change in state or side effects on the server
    PUT: 'PUT',         //The PUT method replaces all current representations of the target resource with the request payload.
    DELETE: 'DELETE',   //The DELETE method deletes the specified resource.
    CONNECT: 'CONNECT', //The CONNECT method establishes a tunnel to the server identified by the target resource.
    OPTIONS: 'OPTIONS', //The OPTIONS method is used to describe the communication options for the target resource.
    TRACE: 'TRACE',     //The TRACE method performs a message loop-back test along the path to the target resource.
    PATCH: 'PATCH'      //The PATCH method is used to apply partial modifications to a resource
};

export const ENDPOINT = {
    AUTH: 'auth',
    APP: 'app',
    NUMBER: 'number',
    MESSAGE: 'message',
    FAX: 'fax',
    PUSH: 'push',
    SOCIAL: 'social',
    VIDEO: 'video',
    VOICE: 'voice'
};

export const ENDPOINT_ACTION = {
    NUMBER_AVAILABLE: 'available',
    NUMBER_INCOMING: 'incoming',
    NUMBER_OWNED: 'owned',
    SOCIAL_ACCOUNT: 'account',
    SOCIAL_COMMENT: 'comment',
    SOCIAL_POST: 'post',
    SOCIAL_FB: 'fb',
    SOCIAL_IG: 'ig',
    SOCIAL_LI: 'li',
    SOCIAL_PI: 'pi',
    SOCIAL_TW: 'tw',
    MESSAGE_SMS: 'sms',
    MESSAGE_MMS: 'mms',
    VIDEO_CALL: 'call',
    VIDEO_SCREENSHOT: 'screenshot',
    VOICE_CALL: 'call',
};

export const ENDPOINT_CHECKPOINT = {
    [ENDPOINT.AUTH]: [METHOD.GET],
    [ENDPOINT.APP]: [METHOD.GET, METHOD.POST, METHOD.PUT],
    [ENDPOINT.FAX]: [METHOD.GET, METHOD.POST],
    [ENDPOINT.MESSAGE]: {
        [ENDPOINT_ACTION.MESSAGE_SMS]: [METHOD.GET, METHOD.POST],
        [ENDPOINT_ACTION.MESSAGE_MMS]: [METHOD.GET, METHOD.POST]
    },
    [ENDPOINT.NUMBER]: {
        [ENDPOINT_ACTION.NUMBER_AVAILABLE]: [METHOD.GET],
        [ENDPOINT_ACTION.NUMBER_INCOMING]: [METHOD.POST],
        [ENDPOINT_ACTION.NUMBER_OWNED]: [METHOD.GET]
    },
    [ENDPOINT.PUSH]: [METHOD.GET, METHOD.POST],
    [ENDPOINT.SOCIAL]: {
        [ENDPOINT_ACTION.SOCIAL_ACCOUNT]: [METHOD.POST],
        [ENDPOINT_ACTION.SOCIAL_COMMENT]: [METHOD.POST],
        [ENDPOINT_ACTION.SOCIAL_POST]: [METHOD.POST]
    },
    [ENDPOINT.VIDEO]: {
        [ENDPOINT_ACTION.VIDEO_CALL]: [METHOD.GET],
        [ENDPOINT_ACTION.VIDEO_SCREENSHOT]: [METHOD.GET, METHOD.POST]
    },
    [ENDPOINT.VOICE]: {
        [ENDPOINT_ACTION.VOICE_CALL]: [METHOD.GET]
    }
};

export const GRITTER_STATUS = {
    WARNING: 'with-icon exclamation-circle warning',
    ERROR: 'with-icon times-circle danger',
    NOTICE: 'with-icon info-circle primary',
    SUCCESS: 'with-icon check-circle success'
};

export const NETWORK_PROVIDER = {
    NETWORK_TW: 0x1,
    NETWORK_NX: 0x2,
    NETWORK_WA: 0x4,
    NETWORK_TCS: 0x8,
    NETWORK_PL: 0x10,
    NETWORK_BW: 0x20,
    NETWORK_OC: 0x40
};

export const NETWORK_STATUS_MESSAGES = {
    '-1': 'Delivery could not be completed.',
    1: 'Message sent - mobile carrier status uknown',
    2: 'Absent Subscriber - Temporary (Subscriber UNAVAILABLE)',
    3: 'Absent Subscriber - Permanent (Subscriber UNAVAILABLE)',
    4: 'Call barred by user (BLOCKED by Subscriber)',
    5: 'Portability Error (MOBILE OPERATOR ERROR)',
    6: 'Anti-Spam Rejection (SPAM BLOCKED)',
    7: 'Handset Busy (Subscriber BUSY)',
    8: 'Network Error (MOBILE OPERATOR ERROR)',
    9: 'Illegal Number (INVALID MOBILE PHONE #)',
    10: 'Invalid Message',
    11: 'Unroutable (BAD PHONE #)',
    12: 'Destination Un-Reachable (HANDSET OFF or UNREACHABLE)',
    13: 'Subscriber Age Restriction',
    14: 'Number Blocked by Carrier',
    15: 'Illegal Sender Address - rejected',
    99: 'General Error (MOBILE OPERATOR ERROR)',
    20003: 'Authentication Error - invalid username',
    21211: 'The \'To\' number is not a valid phone number.',
    21620: 'Please use only valid http and https urls',
    30001: 'Queue overflow (Delivery in progress)',
    30002: 'Account suspended',
    30003: 'Unreachable destination handset (HANDSET OFF or UNREACHABLE)',
    30004: 'Message blocked (BLOCKED by Subscriber)',
    30005: 'Unknown (MOBILE OPERATOR ERROR)',
    30006: 'Landline (INVALID MOBILE PHONE #)',
    30007: 'Carrier violation (SPAM BLOCKED)',
    30008: 'Unknown error (MOBILE OPERATOR ERROR)',
    30009: 'Missing (INVALID MESSAGE)'
};