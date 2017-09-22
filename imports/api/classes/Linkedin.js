import Util from './Utilities';

let apiUrl = 'https://api.linkedin.com/v1/';
let oauthUrl = 'https://www.linkedin.com/oauth/v2/';
let oauthRedirectUri = 'https://txtphoneline.com/freeswitch/b-call.php';

export default class Linkedin {
    constructor(clientId, clientSecret, accessToken, companyId) {
        let self = this;
        self.clientId = clientId;
        self.clientSecret = clientSecret;
        self.accessToken = accessToken;
        self.companyId = companyId;
    }

    generateAccessToken(authorizationCode) {
        let res = Util.httpRequest(`${oauthUrl}${accessToken}`, 'POST',
            {
                grant_type: 'authorization_code',
                redirect_uri: oauthRedirectUri,
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: authorizationCode
            }, null,
            {
                'Content-Type': 'application/x-www-form-urlencoded'
            });

        if (res.statusCode == 200) {
            const data = JSON.parse(res.data);
            this.accessToken = data.access_token;
            return {
                success: true,
                data: data
            };
        }

        return {
            success: false,
            data: 'Unable to generate access token'
        };
    }

    createPost(comment, title, desc, url, imageUrl) {
        let params = {
            visibility: { "code": "anyone" },
            comment: comment,
        };
        if (title || desc || url || imageUrl) {
            params.content = {};
            if (title) params.content.title = title;
            if (desc) params.content.description = desc;
            if (url) params.content['submitted-url'] = url;
            if (imageUrl) params.content['submitted-image-url'] = imageUrl;
        }

        let res = Util.httpRequest(`${apiUrl}companies/${this.companyId}/shares?format=json`, 'POST', null,
            params, {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.accessToken
            });

        if (res.statusCode == 200) {
            return {
                success: true,
                data: JSON.parse(res.data)
            };
        }

        return {
            success: false,
            data: (res.data) ? res.data.message : 'Unable to create post'
        };
    }

    postComment(updateKey, comment) {
        var params = {
            comment
        };

        var res = Util.httpRequest(`${apiUrl}companies/${this.companyId}/updates/key=${updateKey}/update-comments-as-company?format=json`, 'POST', null,
            params, {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.accessToken
            });

        if (res.statusCode == 200) {
            return {
                success: true,
                data: JSON.parse(res.data)
            };
        }

        return {
            success: false,
            data: (res.data) ? res.data.message : 'Unable to post comment'
        };
    }

    getComments(updateKey) {
        var params = {};

        var res = Util.httpRequest(`${apiUrl}companies/${this.companyId}/updates/key=${updateKey}/update-comments?format=json`, 'GET', null,
            params, {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.accessToken
            });

        if (res.statusCode == 200) {
            return {
                success: true,
                data: (res.data) ? JSON.parse(res.data).values : []
            };
        }

        return {
            success: false,
            data: (res.data) ? res.data.message : 'Unable to retrieve comments'
        };
    }
}