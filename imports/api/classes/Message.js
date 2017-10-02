import Joi from 'joi';
import Base from './_Base.js';
import { MessageDB } from '../message';
import splitSms from 'split-sms';

const collection = MessageDB;
const file = function (label) {
    return Joi.object().keys({
        filename: Joi.string().required().options({ language: { any: { required: 'should have a filename' } } }).label(label),
        encoding: Joi.string().required().options({ language: { any: { required: 'should have an encoding' }, } }).label(label),
        mime_type: Joi.string().required().options({ language: { any: { required: 'should have a mime_type' } } }).label(label),
    }).options({ language: { object: { base: 'must be a file' } } });
};
const array = function(type, min = 0) {
    let array = Joi.array().items(type);
    if (min && parseInt(min))
        array.min(min);
    return array;
}
const number = function(isRequired = false) {
    let type = Joi.number();

    if (isRequired)
        type = type.required();

    return type;
};
const schema = function () {
    return {
        _id: Joi.string(),
        account_id: Joi.string(),
        result: Joi.object().allow(null).default(null),
        from: number(),
        to: number(),
        direction: Joi.string().valid('outbound', 'inbound').default('outbound'),
        message_id: Joi.string().allow(null).default(null),
        attachment: array(file('files', false), 1),
        body: Joi.string(),
        status: Joi.number().valid(0, 1).default(0),
        price: Joi.number().default(0),
        created_dt: Joi.date().default(new Date())
    };
};

const insertRequired = ['account_id', 'from', 'to', 'body'];
const updateRequired = [];

export default class Message extends Base {
    constructor(obj) {
        super(collection, obj, schema, insertRequired, updateRequired);
    }

    static getById(id) {
        const rec = Base.getOne(collection, id);
        if (rec.success) return new Message(rec.data);

        return null;
    }

    static getByInternalId(id) {
        const rec = Base.getOne(collection, { attachment: { $ne: null }, 'result.internalId': id });
        if (rec.success) return new Message(rec.data);

        return null;
    }

    static getAll(query) {
        const rec = Base.getAll(collection, query);
        if (rec.success) return rec.data;

        return rec;
    }

    static getParts(body) {
        const splitted = splitSms.split(body);
        return splitted.parts.length;
    }
}