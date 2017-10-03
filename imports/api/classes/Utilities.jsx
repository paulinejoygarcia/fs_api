
import { http, https } from 'follow-redirects';
import { Meteor } from 'meteor/meteor';
import { GRITTER_STATUS } from './Const';
import './PhoneNumberParser';
import moment from 'moment';
import mime from 'mime-types';
import fs from 'fs';
import PhoneNumber from 'awesome-phonenumber';
import crypto from 'crypto';

class Utilities {
    decodeBase64(ciphertxt) {
        if (Meteor.isClient)
            return atob(ciphertxt);
        if (Meteor.isServer)
            return new Buffer(ciphertxt, 'base64').toString();
        return ciphertxt;
    }
    encodeBase64(input, type) {
        if (Meteor.isClient)
            return btoa(input);
        if (Meteor.isServer) {
            switch (type) {
                case 'file':
                    return fs.readFileSync(input).toString('base64');
                    break;
            }
            return new Buffer(input).toString('base64');
        }
        return input
    }
    encodeImageFileAsURL(element, callback) {
        let file = element.currentTarget.files[0];
        let reader = new FileReader();
        reader.onloadend = function () {
            if (callback)
                callback.call(this, reader.result);
        };
        reader.readAsDataURL(file);
    }
    random(max, min) {
        return Math.floor(Math.random() * max) + min;
    }
    addDaysToDate(interval) {
        startdate = moment().format('MMMM Do YYYY, h:mm:ss a');
        let new_date = moment(startdate, 'MMMM Do YYYY, h:mm:ss a').add(interval, 'days');
        return new_date.format('YYYY-MM-DD HH:mm:ss');
    }
    genRandomString(length, option) {
        let that = this;
        let retval = '';
        option = option || 0x7;
        while (retval.length < length) retval += (() => {
            var mask = '';
            if (option & 0x1)
                mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (option & 0x2)
                mask += 'abcdefghijklmnopqrstuvwxyz';
            if (option & 0x4)
                mask += '0123456789';
            if (option & 0x8)
                mask += '~`!@#$%^&*()_+-=,.<>|';
            return mask[that.random(mask.length, 0)];
        })();
        return retval;
    }
    formatNumber(input, format) {
        if (input) {
            let digits = input.replace(/\D/g, '');
            if (digits.length > 10)
                digits = digits.substring(digits.length - 10, 11);
            var count = 0;
            return format.replace(/X/g, () => {
                return digits.charAt(count++);
            });
        }
        return input;
    }
    numberValidator(input) {
        if (!input) return { isValid: false };
        let check = parsePhoneNumber(input);
        if (check && check.o) {
            const phone = PhoneNumber(check.u);
            if (phone.isValid())
                return {
                    isValid: phone.isValid(),
                    fromUS: phone.getRegionCode() === "US",
                    region: phone.getRegionCode(),
                    internationalFormat: phone.getNumber("international"),
                    nationalFormat: phone.getNumber("national"),
                    e164Format: phone.getNumber("e164"),
                    rfc3966Format: phone.getNumber("rfc3966"),
                    number: input,
                };
        }
        return { isValid: false };
    }
    encodeUTF8(string) {
        if (!string)
            return '';
        try {
            return unescape(encodeURIComponent(string));
        } catch (err) {
            return string;
        }
    }
    decodeUTF8(string) {
        if (!string)
            return '';
        try {
            return decodeURIComponent(escape(string));
        } catch (err) {
            return string;
        }
    }
    timeFromNow(date) {
        var a = moment(date);
        var b = moment();
        return a.from(b);
    }
    objectEquals(x, y) {
        if (x instanceof Function) {
            if (y instanceof Function) {
                return x.toString() === y.toString();
            }
            return false;
        }
        if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
        if (x === y || x.valueOf() === y.valueOf()) { return true; }
        if (x instanceof Date) { return false; }
        if (y instanceof Date) { return false; }
        if (!(x instanceof Object)) { return false; }
        if (!(y instanceof Object)) { return false; }

        let p = Object.keys(x);
        return Object.keys(y).every((i) => p.indexOf(i) !== -1) ? p.every((i) => this.objectEquals(x[i], y[i])) : false;
    }
    setupHandler(instance, target, cursor, transform) {
        let handle = cursor.observe({
            added: (doc) => {
                let id = doc._id;
                doc = transform(doc);
                doc.max = cursor.count();
                instance.added(target, id, doc);
            },
            changed: (doc) => {
                let id = doc._id;
                doc = transform(doc);
                doc.max = cursor.count();
                instance.changed(target, id, doc);
            },
            removed: (doc) => {
                instance.removed(target, doc._id);
            }
        });
        instance.onStop(() => {
            handle.stop();
        });
    }
    checkEmailFormat(string) {
        let re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
        return re.test(string);
    }
    checkIfHTML(string) {
        return /<[a-z][\s\S]*>/i.test(string);
    }
    capitalize(string) {
        if (!string)
            return '';
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    checkUnicode(txt) {
        let check = txt.replace(/[a-z0-9`~!@#$%^&*()_|+\-=?;:'", .<>\{\}\[\]\\\/]/gi, '');
        return !(!check.length);
    }
    affixResponse(instance, statusCode, headers, body) {
        if (instance) {
            instance.statusCode = statusCode;
            for (var head in headers) {
                instance.setHeader(head, headers[head]);
            }
            instance.write(body)
            instance.end();
        }
    }
    checkHooks(data, hooks) {
        if (typeof data === 'object') {
            for (let i = 0; i < hooks.length; i++) {
                if (!data[hooks[i]])
                    return false;
            }
            return true;
        }
        return false;
    }
    downloadFile(url, saveto, callback, retry = 1) {
        if (Meteor.isServer) {
            let protocol = null;
            if (url) {
                showStatus(`Downloading '${url}'...`);
                if (url.indexOf('http:') == 0)
                    protocol = http;
                else if (url.indexOf('https:') == 0)
                    protocol = https;
            }
            if (protocol) {
                protocol.get(url, function (res) {
                    if (res) {
                        if (res.statusCode == 200) {
                            let filename = "";
                            let disposition = res.headers['content-disposition'];
                            let mimetype = res.headers['content-type'];
                            let matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(disposition);

                            if (matches != null && matches[1]) {
                                filename = matches[1].replace(/['"]/g, '');
                            } else {
                                filename = url.substring(url.lastIndexOf('/') + 1);
                                if (!mime.lookup(filename)) {
                                    let ext = mime.extension(mimetype);
                                    filename = `file_${moment().valueOf()}.${ext}`;
                                } else {
                                    mimetype = mime.lookup(filename);
                                }
                            }
                            let localFile = `${moment().format('MMDDYYYYhhmmss')}_${filename}`;
                            let localPath = `${saveto}${localFile}`;
                            let file = fs.createWriteStream(localPath);

                            res.on('data', function (d) {
                                file.write(d);
                            }).on('end', function () {
                                showStatus(`Download complete and save at ${localPath}`);
                                file.close();
                                if (callback)
                                    callback.call(this, {
                                        filename: filename,
                                        mimetype: mimetype,
                                        savepath: localFile
                                    });
                            });
                        } else {
                            if (retry > 5) {
                                if (callback)
                                    callback.call(this, {
                                        failed: true
                                    });
                            } else {
                                showNotice('Retrying download(%sx)...err: %s', retry, res.statusCode);
                                setTimeout(() => {
                                    Util.downloadFile(url, saveto, callback, retry + 1);
                                }, 10000);
                            }
                        }
                    }
                }).on('error', (err) => {
                    if (retry > 5) {
                        if (callback)
                            callback.call(this, {
                                failed: true
                            });
                    } else {
                        showNotice('Retrying download(%sx)...err: %s', retry, err.message);
                        setTimeout(() => {
                            Util.downloadFile(url, saveto, callback, retry + 1);
                        }, 10000);
                    }
                });
            } else {
                showError(`Nothing to download invalid url (${url})`);
            }
        }
    }
    formatArgs(arg) {
        let keys = Object.keys(arg);
        keys.splice(0, 1);
        let retval = keys.map((index) => {
            if (typeof arg[index] === 'number')
                return `${arg[index]}`.blue;
            else if (typeof arg[index] != 'string')
                return JSON.stringify(arg[index]).magenta;
            return `${arg[index]}`.grey;
        });
        if (!retval.length)
            return '';
        return retval;
    }
    log() {
        if (console) {
            console.log.apply(console, arguments);
        }
    }
    showNotice() {
        this.Util.log.apply(this, [`${"[Notice]: ".white}${arguments[0]}`].concat(this.Util.formatArgs(arguments)));
    }
    showStatus() {
        this.Util.log.apply(this, [`${"[Status]".green}${":".white} ${arguments[0]}`].concat(this.Util.formatArgs(arguments)));
    }
    showError() {
        this.Util.log.apply(this, [`${"[Error]".red}${":".white} ${arguments[0]}`].concat(this.Util.formatArgs(arguments)));
    }
    showWarning() {
        this.Util.log.apply(this, [`${"[Warning]".yellow}${":".white} ${arguments[0]}`].concat(this.Util.formatArgs(arguments)));
    }
    showDebug() {
        this.Util.log.apply(this, [`${"[Debug]".magenta}${":".white} ${arguments[0]}`].concat(this.Util.formatArgs(arguments)));
    }
    flattenObj(object, separator = '.') {
        let isValidObject = value => {
            if (!value) {
                return false
            }

            const isArray = Array.isArray(value)
            const isObject = Object.prototype.toString.call(value) === '[object Object]'
            const hasKeys = !!Object.keys(value).length

            return !isArray && isObject && hasKeys
        }

        const walker = (child, path = []) => {
            return Object.assign({}, ...Object.keys(child).map(key => isValidObject(child[key])
                ? walker(child[key], path.concat([key]))
                : { [path.concat([key]).join(separator)]: child[key] })
            )
        }
        return Object.assign({}, walker(object))
    }
    httpRequest(url, method, params, data, headers) {
        if (method.toLowerCase() != 'get' && method.toLowerCase() != 'post') {
            return {
                statusCode: 400,
                body: 'Bad Request'
            };
        }
        try {
            var opts = {};
            if (h = headers) opts.headers = h;
            if (p = params) opts.params = p;
            if (d = data) opts.data = d;
            var result = HTTP.call(method.toUpperCase(), url, opts);
            return {
                statusCode: 200,
                data: result.content
            };
        } catch (e) {
            return {
                statusCode: (e.response) ? e.response.statusCode : 400,
                data: (e.response) ? e.response.data : 'Cannot make HTTP request'
            };
        }
    }
    isObject(val) {
        if (val === null) { return false; }
        return ((typeof val === 'function') || (typeof val === 'object'));
    }

    md5Hash(s) {
        return crypto.createHash('md5').update(s).digest('hex');
    }

    showGritter(title, text, status) {
        if (Meteor.isClient) {
            $.gritter.add({
                title: title,
                text: text,
                class_name: status,
                time: 10000,
            });
            return;
        }
    }

    tryParseJSON(jsonString) {
        try {
            var o = JSON.parse(jsonString);

            // Handle non-exception-throwing cases:
            // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
            // but... JSON.parse(null) returns null, and typeof null === "object", 
            // so we must check for that, too. Thankfully, null is falsey, so this suffices:
            if (o && typeof o === "object") {
                return o;
            }
        }
        catch (e) { }

        return false;
    };
}
export default Util = new Utilities();
