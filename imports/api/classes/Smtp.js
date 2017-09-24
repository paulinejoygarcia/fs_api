import npmSimpleSmtp from 'simplesmtp';
import npmFS from 'fs';

export default class Smtp {
    static createServer(dataReadyCB, port = 25) {
        const smtpServer = npmSimpleSmtp.createServer({
            debug: true,
            requireAuthentication: false,
            disableDNSValidation: true
        });

        smtpServer.listen(port);

        smtpServer.on('startData', function (connection) {
            console.log('Message from:', connection.from);
            console.log('Message to:', connection.to);
            console.log('Host:', connection.host);
            console.log('Remote addr:', connection.remoteAddress);
            connection.emlFile = `Message-rcv-${Date.now()}.eml`;
            connection.saveStream = npmFS.createWriteStream(`${PATH.UPLOAD}${connection.emlFile}`);
        });

        smtpServer.on('data', function (connection, chunk) {
            connection.saveStream.write(chunk);
        });

        smtpServer.on('dataReady', function (connection, callback) {
            connection.saveStream.end();
            console.log('Incoming message saved');
            callback(null, connection.emlFile.replace('.eml', ''));
            if (typeof dataReadyCB === 'function') {
                dataReadyCB.call(this, connection.emlFile);
            }
            // callback(new Error('Rejected as spam!')); // reported back to the client
        });
    }

    static createClient(host = 'localhost', port = 25) {
        return npmSimpleSmtp.connect(port, host, {
            debug: true,
            ignoreTLS: true
        });
    }
}