import npmInstagram from 'instagram-private-api';
import npmFuture from 'fibers/future';

const Client = npmInstagram.V1

export default class Instagram {
    constructor(username, password) {
        let self = this;
        self.username = username;
        self.password = password;

        self.device = new Client.Device(username);
        self.storage = new Client.CookieMemoryStorage();
    }

    createSession(cb) {
        if (!this.device && !this.storage) return;
        Client.Session.create(this.device, this.storage, this.username, this.password).then(cb);
    }

    postImage(image, caption) {
        let fut = new npmFuture();
        this.createSession(function (session) {
            Client.Upload.photo(session, image)
                .then(function (upload) {
                    return Client.Media.configurePhoto(session, upload.params.uploadId, caption);
                })
                .then(function (medium) {
                    fut.return({
                        success: true,
                        data: { id: medium.id }
                    });
                }).catch(function (err) {
                fut.return({
                    success: false,
                    data: err.message
                });
            });
        });
        return fut.wait();
    }

    postVideo(video, caption, cover) {
        let fut = new npmFuture();
        this.createSession(function (session) {
            Client.Upload.video(session, video, cover)
                .then(function (upload) {
                    return Client.Media.configureVideo(session, upload.uploadId, caption, upload.durationms);
                })
                .then(function (medium) {
                    fut.return({
                        success: true,
                        data: { id: medium.id }
                    });
                }).catch(function (err) {
                fut.return({
                    success: false,
                    data: err.message
                });
            });
        });
        return fut.wait();
    }
}