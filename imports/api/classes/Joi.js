import npmJoi from 'joi';

class Joi {
    string(isRequired = false, regex = null, validValues = [], invalidValues = []) {
        let type = npmJoi.string();

        if (isRequired)
            type = type.required();

        if (regex) {
            switch (regex) {
                case 'alphanum':
                case 'token':
                case 'email':
                case 'ip':
                case 'uri':
                case 'hex':
                case 'base64':
                case 'hostname':
                case 'lowercase':
                case 'uppercase':
                case 'isoDate':
                    type = type[regex]();
                    break;
                default:
                    type = type.regex(regex);
            }
        }

        if (validValues.length) {
            type = type.valid(validValues);
        }

        if (invalidValues.length) {
            type = type.invalid(invalidValues);
        }

        return type;
    }

    number(isRequired = false) {
        let type = npmJoi.number();

        if (isRequired)
            type = type.required();

        return type;
    }

    object(isRequired = false) {
        let type = npmJoi.object();

        if (isRequired)
            type = type.required();

        return type;
    }

    validate(object, schema) {
        let result = npmJoi.validate(object, npmJoi.object().keys(schema), {
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
}

export default Joi = new Joi();