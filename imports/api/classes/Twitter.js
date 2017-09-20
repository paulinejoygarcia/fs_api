import npmFuture from 'fibers/future';
import npmFS from 'fs';
import npmTwitter from 'twitter';

export default class Twitter {
    constructor(consumerKey, consumerSecret, accessKey, accessSecret) {
        this.client = new npmTwitter({
            consumer_key: consumerKey,
            consumer_secret: consumerSecret,
            access_token_key: accessKey,
            access_token_secret: accessSecret
        });
    }

    createTweet(status, attachment, inReplyTo) {
        let fut = new npmFuture();
        let params = { status: status };
        if (attachment) {
            let upload = this.uploadMedia(attachment);
            if (upload.success) params.media_ids = upload.data;
        }
        if (irt = inReplyTo) params.in_reply_to_status_id = irt;

        this.client.post('statuses/update', params, function (error, tweet, response) {
            if (error) {
                fut.return({
                    success: false,
                    data: error[0].code + ': ' + error[0].message
                });
            } else {
                fut.return({
                    success: true,
                    data: tweet.id_str
                });
            }
        });
        return fut.wait();
    }

    getTweets() {
        let fut = new npmFuture();
        let params = {};
        this.client.get('statuses/user_timeline', params, function (error, tweet, response) {
            if (error) {
                fut.return({
                    success: false,
                    data: error[0].code + ': ' + error[0].message
                });
            } else {
                let tweets = [];
                const list = JSON.parse(response.body);
                list.forEach(function ({ id, created_at, in_reply_to_status_id, text }) {
                    tweets.push({
                        id,
                        created_at,
                        in_reply_to_status_id,
                        text
                    })
                });
                fut.return({
                    success: true,
                    data: tweets
                });
            }
        });
        return fut.wait();
    }

    uploadMedia(file) {
        let fut = new npmFuture();
        let data = npmFS.readFileSync(file);
        this.client.post('media/upload', { media: data }, function (error, media, response) {
            if (error) {
                fut.return({
                    success: false,
                    data: error[0].code + ': ' + error[0].message
                });
            } else {
                fut.return({
                    success: true,
                    data: media.media_id_string
                });
            }
        });
        return fut.wait();
    }
}