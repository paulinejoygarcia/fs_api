import npmFuture from 'fibers/future';
import npmFS from 'fs';
import npmParseHeaders from 'parse-headers';
import npmEnvelope from 'envelope';

export default class MM4 {
    static getSender(number) {
        return `+${number.replace(/\D/g, '')}/TYPE=PLMN@txtmequick.com`;
    }

    static getRcpt(number) {
        return `+${number.replace(/\D/g, '')}/TYPE=PLMN@mm4.inphomatch.com`;
    }

    static getOriginator(number) {
        return `+${number.replace(/\D/g, '')}@txtmequick.com`;
    }

    static getNumber(address) {
        return address.split('@')[0].replace(/\D/g, '');
    }

    static getHost() {
        return Meteor.settings.mm4.host;
    }

    static getPort() {
        return Meteor.settings.mm4.port;
    }

    static isRequest(string) {
        return string == 'MM4_forward.REQ';
    }

    static isResponse(string) {
        return string == 'MM4_forward.RES';
    }

    static parseMms(emlFile) {
        emlFile = PATH.UPLOAD + emlFile;
        const parsed = { attachment: null, smil: null, body: null };
        const efUtf = npmFS.readFileSync(emlFile, 'utf8');
        const headers = npmParseHeaders(efUtf);
        if (f = headers['from']) parsed.from = f;
        if (t = headers['to']) parsed.to = t;
        if (d = headers['date']) parsed.date = d;
        if (mv = headers['x-mms-3gpp-mms-version']) parsed.mmsVersion = mv;
        if (mid = headers['x-mms-message-id']) parsed.messageId = mid.replace(/['"]+/g, '');
        if (mt = headers['x-mms-message-type']) parsed.messageType = mt;
        if (mti = headers['x-mms-transaction-id']) parsed.transactionId = mti.replace(/['"]+/g, '');
        if (mos = headers['x-mms-originator-system']) parsed.originatorSystem = mos;
        if (mimi = headers['x-internal-message-id']) parsed.internalMessageId = mimi;

        const ef = npmFS.readFileSync(emlFile);
        const email = new npmEnvelope(ef);
        for (let x = 0; (x + '') in email; x++) {
            const att = email[x + ''];
            if (h = att.header) {
                const encoding = h.contentTransferEncoding;
                const cType = h.contentType.mime;
                if (cType == 'application/smil') {
                    parsed.smil = (encoding == 'base64') ? Buffer.from(att['0'], 'base64') : att['0'];
                } else {
                    let enc = 'utf8';
                    if (encoding == 'base64' && cType != 'text/plain') enc = 'base64';
                    if (cType == 'text/plain') parsed.body = att['0'];
                    else {
                        const attFile = `${Date.now()}-${h.contentLocation}`;
                        const fut = new npmFuture();
                        npmFS.writeFile(PATH.UPLOAD + attFile, att['0'], enc, function (err) {
                            if (err) fut.return(false);
                            else fut.return(true);
                        });
                        if (fut.wait()) {
                            parsed.attachment = {
                                filename: attFile,
                                mime_type: cType,
                                encoding: '7bit'
                            };
                        }
                    }
                }
            }
        }
        return parsed;
    }

    static constructMms(from, to, originator, att, body = '') {
        const dn = Date.now();
        let eml = [
            `From: ${from}`,
            `To: ${to}`,
            `X-Mms-3gpp-Mms-Version: 6.10.0`,
            `X-Mms-Message-Id: "${dn}${dn}"`,
            `X-Mms-Message-Type: MM4_forward.REQ`,
            `X-Mms-Transaction-Id: "${dn}"`,
            `X-Mms-Ack-Request: Yes`,
            `X-Mms-Originator-System: ${originator}`,
            `Content-Type: multipart/related; Start="<smil>"; Type="application/smil";boundary="${dn}_${dn}"`,
            `Date: ${new Date().toString()}`,

            ``,
            `--${dn}_${dn}`,
            `MIME-Version: 1.0`,
            `Content-Id: "<smil.smil>"`,
            `Content-Type: application/smil;Name="smil.smil"`,
            `Content-Disposition: attachment;filename=smil.smil`,
            `Content-Location: smil.smil`,
            `Content-Transfer-Encoding: 7bit`,
            ``,
        ];
        let smilMedia = ``;
        let smilText = ``;
        let dataMedia = null;
        let dataText = null;

        if (att) {
            switch (att.type) {
                case 'image':
                    smilMedia = `<img src="${att.filename}" region="Image"/>`;
                    break;
                case 'audio':
                    smilMedia = `<audio src="${att.filename}" region="Audio"/>`;
                    break;
                case 'video':
                    smilMedia = `<video src="${att.filename}" region="Video"/>`;
                    break;
            }

            dataMedia = [
                `--${dn}_${dn}`,
                `MIME-Version: 1.0`,
                `Content-Id: "<${att.filename}>"`,
                `Content-Type: ${att.contentType};Name="${att.filename}"`,
                `Content-Disposition: attachment;filename=${att.filename}`,
                `Content-Location: ${att.filename}`,
                `Content-Transfer-Encoding: base64`,
                ``,
            ];

            const file = npmFS.readFileSync(att.path + att.filename);
            const media64 = new Buffer(file).toString('base64');
            dataMedia.push(media64);
        }

        if (body) {
            const textFilename = 'text_0.txt';
            smilText = `<text src="${textFilename}" region="Text"/>`;

            dataText = [
                `--${dn}_${dn}`,
                `MIME-Version: 1.0`,
                `Content-Id: "<${textFilename}>"`,
                `Content-Type: text/plain;Charset="utf-8";Name="${textFilename}"`,
                `Content-Disposition: attachment;filename=${textFilename}`,
                `Content-Location: ${textFilename}`,
                `Content-Transfer-Encoding: base64`,
                ``,
            ];

            const text64 = new Buffer(body).toString('base64');
            dataText.push(text64);
        }

        eml.push(`<smil><head><layout><root-layout width="1848px" height="1080px"/><region id="Image" left="0" top="0" width="1848px" height="972px" fit="meet"/><region id="Text" left="0" top="972" width="1848px" height="108px" fit="meet"/></layout></head><body><par dur="5000ms">${smilMedia}${smilText}</par></body></smil>`);

        if (dataMedia) eml = [...eml, ...dataMedia];
        if (dataText) eml = [...eml, ...dataText];

        eml.push(`--${dn}_${dn}--`);

        return eml.join('\r\n');
    }
}