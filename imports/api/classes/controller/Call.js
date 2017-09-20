export default class CallCtrl {
    constructor(request = {}, urlParams = {}, validator = {}) {
        this.validator = validator;
        this.accountId = urlParams.accountId;
        this.id = urlParams.id;
        this.params = request.__valid_params || {};
        this.astpp = request.__astpp;
        this.record = null;
    }

    list() {
        if(this.id) {
            return this.astpp.callList(1, this.id);
        }

        return this.astpp.callList(this.params.limit || 20);
    }
}