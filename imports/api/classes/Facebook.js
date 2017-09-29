import npmFB from 'fb';
import npmFS from 'fs';
import npmFuture from 'fibers/future';

const apiVersion = 'v2.8';

export default class Facebook {
    constructor(accessToken, appId, appSecret, pageId) {
        let self = this;
        self.pageId = pageId;

        npmFB.options({
            accessToken: accessToken,
            appId: appId,
            appSecret: appSecret,
            version: apiVersion
        });
    }

    postStatus(status, link) {
        let fut = new npmFuture();
        let params = { message: status };
        if (link) params.link = link;
        npmFB.api(this.pageId + '/feed', 'post', params, function (res) {
            if (!res || res.error) {
                fut.return({
                    success: false,
                    data: !res ? 'Unknown error occurred' : res.error
                });
            } else {
                fut.return({
                    success: true,
                    data: res
                });
            }
        });

        return fut.wait();
    }

    postImage(image, caption) {
        let fut = new npmFuture();
        let data = npmFS.createReadStream(image);
        npmFB.api(this.pageId + '/photos', 'post', { source: data, caption: caption }, function (res) {
            if (!res || res.error) {
                fut.return({
                    success: false,
                    data: !res ? 'Unknown error occurred' : res.error
                });
            } else {
                fut.return({
                    success: true,
                    data: {
                        post_id: res.post_id,
                        image_id: res.id,
                    }
                });
            }
        });
        return fut.wait();
    }

    postComment(postId, comment) {
        let fut = new npmFuture();
        npmFB.api(`${postId}/comments`, 'post', { message: comment }, function (res) {
            if (res && res.id) {
                fut.return({
                    success: true,
                    data: res
                });
            } else {
                fut.return({
                    success: false,
                    data: res && res.error ? res.error : res
                });
            }

        });
        return fut.wait();
    }

    getPosts(limit = 5, paginationUrl = null) {
        if (limit > 100) return {
            success: false,
            data: 'Limit exceeded [Maximum of 100 only]'
        };

        let fut = new npmFuture();
        let endpoint = `${this.pageId}/feed`;
        let params = { limit: limit };
        if (pu = paginationUrl) {
            endpoint = pu;
            params = {};
        }
        npmFB.api(endpoint, params, function (res) {
            let response = { posts: [] };
            if (d = res.data) {
                response.posts = d;
            }
            if (p = res.paging) {
                if (pp = p.previous) response.previousPage = pp.split(`${apiVersion}/`)[1];
                if (np = p.next) response.nextPage = np.split(`${apiVersion}/`)[1];
            }
            fut.return({
                success: true,
                data: response
            });
        });
        return fut.wait();
    }
}