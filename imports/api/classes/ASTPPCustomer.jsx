import moment from 'moment';
//import mcrypt from 'mcrypt';
//import Enc from './Encryption';

export default class ASTPPCustomer {
    constructor(id) {
        this.json={
            id:id,
            number:"",
            countryId:1,
            timezoneId:1,
            currencyId:1,
            type:0,
            entityName:"",
            callingCard:"",
            editId:"",
            password:"",
            creditLimit:"",
            maxChannels:"0",
            dbConnection:server.dbConnection,
            lastName:"",
            firstName:"",
            api:"",
            secret:"",
            email:"",
            pin:"",
        }
    }
    parseJSON(json) {
        this.json = {
            ...this.json,
            ...json
        };
    }
    setPassword(password){
        this.json.password = this.encode(password);
    }
    setEntityName(){
        this.json.entityName = this.getEntityType(this.json.type).toLowerCase();
    }
    getEntityType(entityType) {
        entity = {
            '-1': "Administrator",
            '0' : "Customer",
            '1' : "Reseller",
            '2' : "Admin",
            '3' : "Provider",
            '4' : "Subadmin",
            '5' : "Callshop"
        };
        return(entity[entityType]);
    }
    encode(password){
        //TODO encode of password
        //let rijEcb = new MCrypt('rijndael-256', 'ecb');
        //rijEcb.open(Meteor.settings.astpp.privatekey);
        //return rijEcb.encrypt(password);
        return password;
    }
    getCurrencyList() {
        let result = this.json.dbConnection.select('SELECT * FROM currency');
        let currencyList = {};
        result.forEach((row)=>{
            currencyList[row.currency] = row['currencyrate'];
        });
        return currencyList;
    }
    formatCurrency(amount,decPlaces = 2) {
        amount = amount.replace(',', '');
        return amount.toFixed(decPlaces);
    }
    addCalculateCurrency(amount = 0, fromCurrency = '', toCurrency = '', formatCurrency = true, appendCurrency = true) {
        if (fromCurrency === '') {
            let fromCurrency1 = this.json.currencyId;
            fromCurrency = this.json.dbConnection.selectOne('SELECT currency FROM currency WHERE  id = "?"',[fromCurrency1]);
        }
        //to_currency = (to_currency == '') ? self::$global_config['system_config']['base_currency'] : to_currency;
        const currencyList = this.getCurrencyList();
        let calAmount = 0;
        if(currencyList[fromCurrency] > 0)
            calAmount = (amount * currencyList[toCurrency]) / currencyList[fromCurrency];
        else
            calAmount = amount;
        if (formatCurrency)
            calAmount = this.formatCurrency(calAmount);
        if (appendCurrency)
            calAmount = calAmount + " " + toCurrency;
        return calAmount;
    }
    randomString(length) {
        let chars = "1234567890"; //length:36
        let finalRand = '';
        for (let i = 0; i < length; i++) {
            finalRand += chars[this.rand(0, chars.length - 1)];
        }
        return finalRand;
    }
    rand(min, max){
        if(min === 0){
            return Math.floor((Math.random() * max) + 0);
        }else{
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }
    findUniqRendnoAccno(length = '', field = '', tablename = '', def, creationCount){
        let number = [];
        let j = 0;
        let totalCount = Math.pow(10,length);
        for(let i = 1; i <= totalCount; i++) {
            let uname = this.randomString(length);
            uname = uname.toLowerCase();
            if (def)
                uname = def.uname;
            if ( ! number.includes(uname)) {
                let accResult = this.json.dbConnection.select('Select Count(id) as count FROM '+tablename+' WHERE '+field+'=?',uname);
                if (accResult[0]['count'] === 0 && ! number.includes(uname)) {
                    number.push(uname);
                    j++;
                }
                if (j === creationCount) {
                    break;
                }
            } else {
                totalCount++;
            }
        }
        return number;
    }
    randomStr(length) {
        let text = "";
        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (let i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    XoR(to, from) {
        var retval = [];
        if (to && from) {
            to = to.toString();
            from = from.toString();
            for (var i = 0; i < to.length; i++) {
                if (to[i] != from[i % from.length])
                    retval[i] = String.fromCharCode((to.charCodeAt(i) ^ from.charCodeAt(i % from.length)));
                else
                    retval[i] = to[i];
            }
            return retval.join('');
        }
        return to;
    }
    customerAdd(){
        //TODO GET credit_limit
        //let enc = new Enc(Meteor.settings.astpp.privatekey);
        this.creditLimit = this.addCalculateCurrency(this.creditLimit, '', '', false, false);
        let api = this.randomStr(20);
        let accountId = Math.floor(Math.pow(10, 12-1) + Math.random() * 9 * Math.pow(10, 12-1));
        let data = {
            number: this.findUniqRendnoAccno(10, 'number', 'accounts', "", 1),
            country_id: this.json.countryId,
            timezone_id: this.json.timezoneId,
            currency_id: this.json.currencyId,
            type: this.json.type,
            password: this.json.password,
            credit_limit: this.json.creditLimit,
            first_name: this.json.firstName,
            last_name: this.json.lastName,
            account_id: accountId,
            email:this.json.email,
            api: api,
            secret: new Buffer(this.XoR(api, accountId)).toString('base64'),
            pin: this.json.pin,
        };
        data['reseller_id'] = this.json.type === 1? this.json.id : 0;
        data['maxchannels'] = (this.json.type === 1 || this.json.type === 2 || this.json.type === -1) ? "0" : this.json.maxChannels;
        delete data['action'];
        let sipFlag = this.json.sipDeviceFlag? 1 : 0;
        let opensipFlag = this.json.opensipsDeviceFlag? 1 : 0;
        delete data['sip_device_flag'];
        delete data['opensips_device_flag'];
        delete data['tax_id'];
        /*         * ******************************** */
        data['creation'] = moment().format('YYYY-MM-DD hh:mm:ss');
        data['expiry'] = moment().add(20,'years').format('YYYY-MM-DD hh:mm:ss');
        /*if(isset($accountinfo['is_recording'])){
         $accountinfo['is_recording']=0;
         }else{
         $accountinfo['is_recording']=1;
         }
         if(isset($accountinfo['allow_ip_management'])){
         $accountinfo['allow_ip_management']=0;
         }else{
         $accountinfo['allow_ip_management']=1;
         }*/
        if(data['local_call'])
            data['local_call']=0;
        else
            data['local_call']=1;
        if(data['type'] === 1)
            invoiceConfig = data['invoice_config_flag'];
        else
            invoiceConfig = "";
        delete data['invoice_config_flag'];
        let lastRecordQuery = "SELECT id FROM accounts ORDER BY id DESC limit 1";
        let lastRecord = server.dbConnection.selectOne(lastRecordQuery, []);
        let accId = (lastRecord) ? (lastRecord.id * 1 + 1) : "0000";
        data.id = accId;
        let lastId = this.json.dbConnection.insert('accounts', data);

        /**
         ASTPP  3.0
         For Invoice Configuration
         * */
        let countryName = "";
        let invoiceConfig = null;
        if (this.json.type === 1 && invoiceConfig && invoiceConfig === "0") {
            if (this.json.countryId === NULL)
                this.json.countryId = "";
            else {
                let countryCodes = this.json.dbConnection.select("SELECT country FROM countrycode WHERE id = ?",[countryId]);
                countryName = countryCodes[0];
            }
            if (this.json.postalCode === NULL)
                this.json.postalCode = "";
            invoiceConfig = [{'accountid':lastId,'company_name':"", 'address':"", 'city':"", 'province':"", 'country':"", 'zipcode':"", 'telephone':"", 'emailaddress':this.json.email}];
            this.json.dbConnection.insert('invoice_conf',invoiceConfig);
        }
        if (sipFlag === '1') {
            // this.json.dbConnection.select("SELECT * FROM ");
            // $this->db->select('id');
            // $this->db->where('name','default');
            // $sipprofile_result=(array)$this->db->get('sip_profiles')->first_row();
            // $free_switch_array = array('fs_username' => $accountinfo['number'],
            //     'fs_password' => $this->common->decode($accountinfo['password']),
            //     'context' => 'default',
            //     'effective_caller_id_name' => $accountinfo['number'],
            //     'effective_caller_id_number' => $accountinfo['number'],
            //     'sip_profile_id' => $sipprofile_result['id'],
            //     'pricelist_id' => $accountinfo['pricelist_id'],
            //     'accountcode' => $last_id,
            //     'status' => $accountinfo['status']);
            // $this->load->model('freeswitch/freeswitch_model');
            // $this->freeswitch_model->add_freeswith($free_switch_array);
        }
        if (opensipFlag === 1) {
            // $opensips_array = array('username' => $accountinfo['number'],
            //     'domain' => common_model::$global_config['system_config']['opensips_domain'],
            //     'password' => $accountinfo['password'],
            //     'accountcode' => $accountinfo['number'],
            //     'pricelist_id' => $accountinfo['pricelist_id']);
            // $this->load->model('opensips/opensips_model');
            // $this->opensips_model->add_opensipsdevices($opensips_array);
        }

        //$this->common->mail_to_users('email_add_user', $accountinfo);
        return (lastId === 0 || lastId)?accountId:false;
    }
}