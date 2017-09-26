import Joi from 'joi';

const _validate = function (mode = 0, value = this) {
    let required = [];
    if (mode == 1) required = this._requiredInsertFields;
    else if (mode == 2) required = ['_id'].concat(this._requiredUpdateFields);

    let schema = this._schema() || {};
    required.forEach(function (f) {
        schema[f] = schema[f].required();
    });

    schema = Joi.object().keys(schema);
    const res = joiValidate(value, schema);
    if (res.valid) Object.assign(this, res.data);
    return res;
}

const joiValidate = function (value, schema) {
    let result = Joi.validate(value, schema, {
        abortEarly: true,
        stripUnknown: true,
        skipFunctions: false
    });

    if (result.error)
        return {
            valid: false,
            data: result.error.details[0].message
        };

    return {
        valid: true,
        data: result.value
    };
}

export default class Base {
    constructor(collection = null,
                obj = {},
                schema = null,
                insertRequired = [],
                updateRequired = []) {
        this._collection = collection;
        this._schema = schema;
        this._requiredInsertFields = insertRequired || [];
        this._requiredUpdateFields = updateRequired || [];

        _validate.call(this, 0, obj);
    }

    getValues() {
        const { valid, data } = _validate.call(this);
        return valid ? data : null;
    }

    insert() {
        const { valid, data } = _validate.call(this, 1);

        if (!valid) return {
            success: false,
            data: data
        };

        if (this._collection !== Meteor.users && (typeof this._collection.insert === 'function')) {
            if (data['_id']) delete data['_id'];
            const id = this._collection.insert(data);
            return {
                success: true,
                data: id
            }
        }

        return {
            success: true,
            data: data
        }
    }

    update() {
        const { valid, data } = _validate.call(this, 2);
        if (!valid)
            return {
                success: false,
                data: data
            }

        let update = Object.assign({}, data);
        delete update._id;

        this._collection.update(data._id, {
            $set: update
        });

        return {
            success: true,
            data: data._id
        }
    }

    static getOne(collection, query = {}) {
        const rec = collection.findOne(query);
        if (rec) {
            return {
                success: true,
                data: rec
            }
        }
        return {
            success: false,
            data: 'Record not found'
        };
    }

    static getAll(collection, query = {}, options = {}) {
        const rec = collection.find(query, options).fetch();
        if (rec) {
            return {
                success: true,
                data: rec
            }
        }
        return {
            success: false,
            data: []
        };
    }
}