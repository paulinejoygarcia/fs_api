export const MAX_API_LIFETIME = 4; // 4 hours

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
    SOCIAL: 'social'
};

export const ENDPOINT_ACTION = {
    NUMBER_AVAILABLE: 'available',
    NUMBER_INCOMING: 'incoming',
    NUMBER_OWNED: 'owned',
    SOCIAL_ACCOUNT: 'account',
    SOCIAL_COMMENT: 'comment',
    SOCIAL_POST: 'post',
};

export const ENDPOINT_LIST = {
    [ENDPOINT.AUTH]: {
        [METHOD.GET]: METHOD.GET
    },
    [ENDPOINT.APP]: {
        [METHOD.GET]: METHOD.GET,
        [METHOD.POST]: METHOD.POST,
        [METHOD.PUT]: METHOD.PUT
    },
    [ENDPOINT.NUMBER]: {
        [METHOD.GET]: METHOD.GET,
        [METHOD.POST]: METHOD.POST
    },
    [ENDPOINT.SOCIAL]: {
        [METHOD.POST]: METHOD.POST
    }
};

export const SUBENDPOINT_LIST = {
    [ENDPOINT.NUMBER]: {
        [ENDPOINT_ACTION.NUMBER_AVAILABLE]: {
            [METHOD.GET]: METHOD.GET
        },
        [ENDPOINT_ACTION.NUMBER_OWNED]: {
            [METHOD.GET]: METHOD.GET
        },
        [ENDPOINT_ACTION.NUMBER_INCOMING]: {
            [METHOD.POST]: METHOD.POST
        }
    },
    [ENDPOINT.SOCIAL]: {
        [ENDPOINT_ACTION.SOCIAL_ACCOUNT]: {
            [METHOD.POST]: METHOD.POST
        },
        [ENDPOINT_ACTION.SOCIAL_COMMENT]: {
            [METHOD.POST]: METHOD.POST
        },
        [ENDPOINT_ACTION.SOCIAL_POST]: {
            [METHOD.POST]: METHOD.POST
        },
    }
};