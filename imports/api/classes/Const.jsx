export const MAX_API_LIFETIME = 4; // 4 hours

export const ENDPOINT = {
    AUTH: 'auth',
    APP: 'app',
	VOICE: 'voice',
    PUSH: 'push',
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
}