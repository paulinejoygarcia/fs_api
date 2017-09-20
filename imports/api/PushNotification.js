import Joi from 'joi';
import Base from './_Base.js';
import { PushNotifDB } from './pushNotifications';

const collection = PushNotifDB;

const schema = function() {
    return {
        _id: Joi.string(),
        account_id: Joi.string(),
        server_key: Joi.string(),
        registration_id: Joi.string(),
        title: Joi.string(),
        body: Joi.string(),
        icon: Joi.string().allow(null).default(null),
        action: Joi.string().allow(null).default(null),
        priority: Joi.number().default(10),
        message_id: Joi.string().allow(null).default(null),
        price: Joi.number().default(0),
        created_dt: Joi.date().default(new Date())
    };
};

const insertRequired = ['account_id', 'server_key', 'registration_id', 'title',
    'body'];
const updateRequired = [];

export default class PushNotification extends Base {
    constructor(obj) {
        super(collection, obj, schema, insertRequired, updateRequired);
    }

    static getById(id) {
        const rec = Base.getOne(collection, id);
        if(rec.success) return new PushNotification(rec.data);

        return null;
    }

    static getAll(query) {
        const rec = Base.getAll(collection, query);
        if(rec.success) return rec.data;

        return rec;
    }
}