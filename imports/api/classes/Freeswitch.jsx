import npmESL from 'modesl';
import npmFuture from 'fibers/future';

import FaxManager, { FaxDB } from './FaxManager';
import XmlParser from './XmlParser';

export default class Freeswitch {
    constructor(ip, port, password) {
        const that = this;
        that._ip = ip;
        that._port = port;
        that._password = password;
        that._connected = false;
        that.astppDB = null;

        let fut = new npmFuture();
        showStatus('Connecting to FreeSWITCH Server... ip:`%s`', ip || 'localhost');
        that._connection = new npmESL.Connection(this._ip, this._port, this._password, function () {
            showStatus('Successfully connected to FreeSWITCH Server.');
            that._connection.events('json', 'all');

            fut.return(true);
        });
        that._connection.on('error', function (ex) {
            fut.return(false);
        });
        that._connected = fut.wait();
    }

    isConnected() {
        return this._connected;
    }

    setAstppDB(wrapper) {
        if (wrapper && wrapper.isConnected())
            this.astppDB = wrapper;
    }

    sendFax(from, to, id, files, accountId) {
        from = from.replace(/\D/g, '');
        to = to.replace(/\D/g, '');
        if (this._connected && from && to && id && file) {
            let recipient = 'server._astpp.callOutboundGateway(to, accountId)';//fix: apply astpp changes
            recipient = {
                data: ''
            };
            if (!recipient.success) return recipient;

            let params = [];
            let vars = [];
            vars.push(`origination_caller_id_number=${from}`);
            vars.push(`ignore_early_media=true`);
            vars.push(`absolute_codec_string='PCMU,PCMA'`);
            vars.push(`fax_enable_t38=true`);
            vars.push(`fax_verbose=true`);
            vars.push(`fax_use_ecm=true`);
            vars.push(`fax_enable_t38_request=true`);
            vars.push(`execute_on_fax_success='lua process_fax.lua ${[1, 1, id, from, to, file, accountId].join(' ')}'`);
            vars.push(`execute_on_fax_failure='lua process_fax.lua ${[0, 1, id, from, to, file, accountId].join(' ')}'`);

            params.push(`{${vars.join(',')}}${recipient.data}`);
            params.push(`&txfax($$\{temp_dir\}/${file})`);

            this._connection.sendRecv(`api originate ${params.join(' ')}`);
            return {
                success: true,
                data: 'Fax queued'
            };
        }
    }

    dialplan(params) {
        const callUrl = params.call_url;
        const callMethod = params.call_method;
        const callFbUrl = params.call_fb_url;
        const callFbMethod = params.call_fb_method;
        const v = {
            from: params.from,
            to: params.to,
            call_id: params.call_id,
            type: params.call_type,
            direction: params.call_direction,
        };

        const xml = this.processRequestUrl(v, callUrl, callMethod, callFbUrl, callFbMethod, params.account_code);
        return {
            success: true,
            data: xml ? xml : ''
        }
    }

    faxCallback(params) {
        const code = params.result_code;
        const text = params.result_text;
        const success = params.success && code == '0';
        const accountId = params.account_id;
        const isSend = params.is_send;
        const from = params.from;
        const to = params.to;
        const id = params.id;
        const uuid = params.uuid;
        const file = params.file;
        const transferredPages = params.transferred_pages;
        const totalPages = params.total_pages;
        const price = parseInt(transferredPages) * Meteor.settings.pricing.fax;
        const faxOutbound = params.is_send == '1';

        let fax = {};
        if (faxOutbound) {
            let doc = FaxDB.findOne({ faxId: id });
            if (!doc) return {
                success: false,
                data: 'Fax record not found'
            };

            fax = new FaxManager();
            fax.parseJSON(doc);
            fax.setTransferredPages(transferredPages);
            fax.setTotalPages(totalPages);
            fax.setUUID(uuidid);

            if (success) {
                fax.setStatus(1);
                fax.setPrice(price);
            } else {
                fax.setResult({ code: code, text: text });
            }
            fax.flush();
        } else {
            let query = "SELECT account_id FROM accounts WHERE number = ?";
            let acc = this.databaseConnection.selectOne(query, accountId);
            fax = new FaxManager(acc ? acc.account_id : null, to, from, 'inbound');
            fax.setTransferredPages(transferredPages);
            fax.setTotalPages(totalPages);
            fax.setFaxId(id);
            fax.setUUID(uuidid);

            if (success) {
                fax.setStatus(1);
                fax.setPrice(price);

                const file = `/tmp/${file}`;
                const tiffPath = `${PATH.UPLOAD}tiff/`;
                const downloaded = Util.scp(file, 0, tiffPath, 1);
                if (downloaded)
                    fax.setTIFF(file);
            } else {
                fax.setResult({ code: code, text: text });
            }
            fax.flush();
        }

        // if (fax) this.astpp.accountCharge(price, fax.account_id); fix: apply astpp changes

        let query = "SELECT fax_url, fax_method, fax_fb_url, fax_fb_method FROM fs_applications fa JOIN dids d ON fa.id = d.fs_app_id WHERE d.number = ? LIMIT 1";
        let app = this.databaseConnection.selectOne(query, faxOutbound ? from : to);
        if (!app) return {
            success: false,
            data: 'App not found'
        };
        const v = {
            from: fax.from,
            to: fax.to,
            fax_id: fax.fax_id,
            transferred_pages: fax.transferred_pages,
            total_pages: fax.total_pages,
            direction: fax.direction,
            price: fax.price,
            account_id: fax.account_id,
            result: fax.result,
            tiff: fax.tiff,
        };

        this.processRequestUrl(v, app.fax_url, app.fax_method, app.fax_fb_url, app.fax_fb_method, fax.account_id);

        return {
            success: true
        };
    }

    processRequestUrl(params, url, method = 'get', fallback, fb_method = 'get', accountId = null) {
        let xml = {};
        if (url && method) {
            xml = Util.httpRequest(url, method, params);
            if (xml.statusCode != 200 && fallback && fb_method)
                xml = Util.httpRequest(fallback, fb_method, params);
        }

        if (x = xml.data) {
            var xp = new XmlParser(x, accountId);
            xp.setFreeswitch(this);
            const parsed = xp.process();
            if (parsed.success) return parsed.data;
        }
    }
}