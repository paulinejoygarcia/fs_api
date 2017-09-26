export const MAX_API_LIFETIME = 4; // 4 hours
export const API_BASE = '/api/2017-09-12/accounts/';

export const ROUTE_COMPONENT = {
    DASHBOARD: 'dashboard',
    ACCOUNT: {
        INFO: 'info',
        PROFILE: 'profile',
        BILLING: 'billing',
        INVOICE: 'invoices',
    }
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
    VOICE_CALL: 'call'
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
}