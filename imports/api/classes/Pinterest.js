import Util from './Utilities';

let apiUrl = 'https://api.pinterest.com/v1/';
let contentType = 'application/x-www-form-urlencoded';

export default class Pinterest {
    constructor(clientId, clientSecret, username, accessToken) {
        let self = this;
        self.clientId = clientId;
        self.clientSecret = clientSecret;
        self.username = username;
        self.accessToken = accessToken;
    }

    generateAccessToken(authorizationCode) {
        let res = Util.httpRequest(apiUrl + 'oauth/token', 'POST',
            {
                grant_type: 'authorization_code',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                code: authorizationCode
            }, null,
            {
                'Content-Type': contentType
            });

        if (res.statusCode == 200) {
            let data = JSON.parse(res.data);
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

    createBoard(name, desc) {
        let res = Util.httpRequest(apiUrl + 'boards/?access_token=' + this.accessToken, 'POST',
            {
                name: name,
                description: desc,
            }, null,
            {
                'Content-Type': contentType,
            });

        if (res.statusCode == 200) {
            const data = JSON.parse(res.data).data;
            if (data.id) {
                return {
                    success: true,
                    data: data
                };
            }
        }

        return {
            success: false,
            data: 'Unable to create board'
        };
    }

    createPin(board, note, link, imageFile, imageUrl) {
        let params = {
            board: this.username + '/' + board,
            note: note,
        };
        if (link) params.link = link;
        if (imageFile) params.image_base64 = Util.encodeBase64(imageFile);
        if (imageUrl) params.image_url = imageUrl;

        let res = Util.httpRequest(apiUrl + 'pins/?access_token=' + this.accessToken, 'POST',
            params, null,
            {
                'Content-Type': contentType,
            });

        if (res.statusCode == 200) {
            const data = JSON.parse(res.data).data;
            if (data.id) {
                return {
                    success: true,
                    data: data
                };
            }
        }

        return {
            success: false,
            data: 'Unable to create pin'
        };
    }
}