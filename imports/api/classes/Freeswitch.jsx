import npmESL from 'modesl';
import npmFuture from 'fibers/future';

import FaxManager, { FaxDB } from './FaxManager';
import XmlParser from './XmlParser';

export default class Freeswitch {
    constructor(ip, port, password) {
        const that = this;
        that.connected = false;
        that.astppDB = null;

        let fut = new npmFuture();
        showStatus('Connecting to FreeSWITCH Server... ip:`%s`', ip || 'localhost');
        that.connection = new npmESL.Connection(ip, port, password, function () {
            showStatus('Successfully connected to FreeSWITCH Server.');
            that.connection.events('json', 'all');

            fut.return(true);
        });
        that.connection.on('error', function (ex) {
            fut.return(false);
        });
        that.connected = fut.wait();
    }

    isConnected() {
        return this.connected;
    }

    setAstppDB(wrapper) {
        if (wrapper && wrapper.isConnected())
            this.astppDB = wrapper;
    }

    getAccountCarrierRates(accountId, destinationNumber) {
        let numberLoop = ((number, code = '') => {
            let numberLength = number.length;
            if (!code)
                code = 'pattern';

            let _numberLoopStr = '(';
            while (numberLength > 0) {
                _numberLoopStr += `${code} ='^${destinationNumber.substring(0, numberLength)}.*' OR `;
                numberLength -= 1;
            }
            _numberLoopStr += `${code} ='--')`;
            return _numberLoopStr;
        });
        let getRate = ((_numberLoopStr, pricelistId) => {
            let query = `SELECT * FROM routes WHERE ${_numberLoopStr} AND status = 0 AND pricelist_id = ${pricelistId} ORDER BY LENGTH(pattern) DESC,cost DESC LIMIT 1`;
            return this.astppDB.selectOne(query);
        });
        let getPricelist = ((id) => {
            let query = `select * from pricelists WHERE id = ${id} AND status = 0`;
            return this.astppDB.selectOne(query);
        });
        if (this.accountData) {
            let rateCardId = this.accountData.pricelist_id;
            let numberLoopStr = numberLoop(destinationNumber);
            let rate = getRate(numberLoopStr, rateCardId);
            if (rate) {
                let rateCarrierId = rate.trunk_id;
                let pricelist = getPricelist(rateCardId);
                if (pricelist) {
                    let routingType = pricelist.routing_type;
                    let carrierRates = [];
                    let query = '';
                    if (routingType == 1) {
                        query = `SELECT TK.id as trunk_id,TK.codec,GW.name as path,GW.dialplan_variable,TK.provider_id,TR.init_inc,TK.status,TK.dialed_modify,TK.maxchannels,TR.pattern,TR.id as outbound_route_id,TR.connectcost,TR.comment,TR.includedseconds,TR.cost,TR.inc,TR.prepend,TR.strip,(select name from gateways where status=0 AND id = TK.failover_gateway_id) as path1,(select name from gateways where status=0 AND id = TK.failover_gateway_id1) as path2 FROM (select * from outbound_routes order by LENGTH (pattern) DESC) as TR trunks as TK,gateways as GW WHERE GW.status=0 AND GW.id= TK.gateway_id AND TK.status=0 AND TK.id= TR.trunk_id AND ${numberLoopStr} AND TR.status = 0 `;
                    } else {
                        query = `SELECT TK.id as trunk_id,TK.codec,GW.name as path,GW.dialplan_variable,TK.provider_id,TR.init_inc,TK.status,TK.dialed_modify,TK.maxchannels,TR.pattern,TR.id as outbound_route_id,TR.connectcost,TR.comment,TR.includedseconds,TR.cost,TR.inc,TR.prepend,TR.strip,(select name from gateways where status=0 AND id = TK.failover_gateway_id) as path1,(select name from gateways where status=0 AND id = TK.failover_gateway_id1) as path2 FROM outbound_routes as TR,trunks as TK,gateways as GW WHERE GW.status=0 AND GW.id= TK.gateway_id AND TK.status=0 AND TK.id= TR.trunk_id AND ${numberLoopStr} AND TR.status = 0 `;
                    }

                    if (parseInt(rateCarrierId) > 0) {
                        query += ` AND TR.trunk_id=${rateCarrierId}`;
                    } else {
                        let queryTrunks = `SELECT GROUP_CONCAT(trunk_id) as ids FROM routing WHERE pricelist_id=${rateCardId}`;
                        let trunkIds = this.astppDB.selectOne(queryTrunks);

                        if (trunkIds) {
                            if (trunkIds.ids == '')
                                trunkIds.ids = 0;

                            query += ` AND TR.trunk_id IN (${trunkIds.ids})`;
                        }
                        if (routingType == 1)
                            query += ` ORDER by TR.cost ASC,TR.precedence ASC, TK.precedence`;
                        else
                            query += ` ORDER by LENGTH (pattern) DESC,TR.cost ASC,TR.precedence ASC, TK.precedence`;

                        let carrierIgnoreDuplicate = {};
                        let res = this.astppDB.select(query);
                        res.forEach((r, i) => {
                            if (!carrierIgnoreDuplicate[r.trunk_id]) {
                                carrierRates[i] = r;
                                carrierIgnoreDuplicate[r.trunk_id] = true;
                            }
                        });
                        return carrierRates;
                    }
                }
            }
        }
        return [];
    }

    getAccountBridgeGateway(data, destination) {
        if (data) {
            let terminationRates = `ID:${data.outbound_route_id}|CODE:${data.pattern}|DESTINATION:${data.comment}|CONNECTIONCOST:${data.connectcost}|INCLUDEDSECONDS:${data.includedseconds}|COST:${data.cost}|INC:${data.inc}|INITIALBLOCK:${data.init_inc}|TRUNK:${data.trunk_id}|PROVIDER:${data.provider_id}`;
            let trunkId = data.trunk_id;
            let providerId = data.provider_id;
            let absoluteCodecString = data.codec;
            let gateway = `sofia/gateway/${data.path}/${destination}`;
            if (data.path1)
                gateway += `|sofia/gateway/${data.path1}/${destination}`;
            if (data.path2)
                gateway += `|sofia/gateway/${data.path1}/${destination}`;

            return {
                termination_rates: terminationRates,
                trunk_id: trunkId,
                provider_id: providerId,
                codec: absoluteCodecString,
                gateway
            }
        }
    }

    getCallOutboundGateway(accountId, destinationNumber) {
        let gateways = [];
        let carrierRates = this.getAccountCarrierRates(accountId, destinationNumber);
        let outboundInfo = carrierRates.map(cr => {
            let bg = this.getAccountBridgeGateway(cr, destinationNumber)
            gateways.push(bg.gateway);
        });
        return gateways.join('|');
    }

    sendFax(from, to, id, files, accountId) {
        from = from.replace(/\D/g, '');
        to = to.replace(/\D/g, '');
        if (this.connected && from && to && id && file) {
            let recipient = this.getCallOutboundGateway(to, accountId);
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

            this.connection.sendRecv(`api originate ${params.join(' ')}`);
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

        let fax = null;
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
            let acc = this.astppDB.selectOne(query, accountId);
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

        if (fax) {
            let queryAcc = "SELECT * FROM accounts WHERE number = ?";
            let accountData = this.astppDB.selectOne(queryAcc, accountId);
            server.accountCharge(accountData, price, fax.json.accountId);

            let query = "SELECT fax_url, fax_method, fax_fb_url, fax_fb_method FROM fs_applications fa JOIN dids d ON fa.id = d.fs_app_id WHERE d.number = ? LIMIT 1";
            let app = this.astppDB.selectOne(query, faxOutbound ? from : to);
            if (!app) return {
                success: false,
                data: 'App not found'
            };
            const v = {
                from: fax.json.from,
                to: fax.json.to,
                fax_id: fax.json.faxId,
                transferred_pages: fax.json.transferredPages,
                total_pages: fax.json.totalPages,
                direction: fax.json.direction,
                price: fax.json.price,
                account_id: fax.json.accountId,
                result: fax.json.result,
                tiff: fax.json.tiff,
            };

            this.processRequestUrl(v, app.fax_url, app.fax_method, app.fax_fb_url, app.fax_fb_method, fax.json.accountId);

            return {
                success: true
            };
        }
        return {
            success: false
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