import Util from '/imports/api/classes/Utilities';
import { Meteor } from 'meteor/meteor';
import moment from 'moment';

export const FaxDB = new Mongo.Collection(Meteor.settings.collections.fax || 'faxes', { idGeneration: 'MONGO' });

export default class FaxManager {
    constructor(accountId, to, from, direction, files, price) {
        this.json = {
            accountId: accountId || null,
            to: to || null,
            from: from || null,
            direction: direction == 'outbound' ? 'outbound' : 'inbound',
            files: files || [],
            price: parseFloat(price) || 0,
            result: null,
            uuid: '',
            faxId: '',
            totalPages: 0,
            transferredPages: 0,
            tiff: '',
            status: 0,
            createdDt: moment().valueOf()
        };
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }
    setResult(result) {
        this.json.result = result;
    }
    setFaxId(id) {
        this.json.faxId = id;
    }
    setUUID(id) {
        this.json.uuid = id;
    }
    setTotalPages(total) {
        this.json.totalPages = total;
    }
    setTransferredPages(transferred) {
        this.json.transferredPages = transferred;
    }
    setTIFF(tiff) {
        this.json.tiff = tiff;
    }
    setPrice(price) {
        if (parseFloat(price))
            this.json.price = parseFloat(price);
    }
    setStatus(status) {
        if (parseInt(status))
            this.json.status = parseInt(status);
    }
    toApiJson() {
        return {
            id: this.json._id._str,
            to: this.json.to,
            from: this.json.from,
            direction: this.json.direction,
            files: this.json.files,
            price: this.json.price,
            uuid: this.json.uuid,
            faxId: this.json.faxId,
            totalPages: this.json.totalPages,
            transferredPages: this.json.transferredPages,
            result: this.json.result,
            createdDt: moment(this.json.createdDt).format('YYYY-MM-DD HH:mm:ss')
        }
    }
    flush() {
        if (this.json._id) {
            if (FaxDB.update(this.json._id, this.json)) {
                return;
            }
        }
        return (this.json._id = FaxDB.insert(this.json));
    }
}
