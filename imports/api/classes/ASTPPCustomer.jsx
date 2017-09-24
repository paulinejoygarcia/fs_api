import moment from 'moment';

export default class ASTPPCustomer {
    constructor(id) {
        this.json={
            id:id,
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
    customerAdd(){
        //TODO GET credit_limit
        this.creditLimit = this.addCalculateCurrency(this.creditLimit, '', '', false, false);
        let data = {
            country_id: this.json.countryId,
            timezone_id: this.json.timezoneId,
            currency_id: this.json.currencyId,
            type: this.json.type,
            password: this.json.password,
            credit_limit: this.json.creditLimit,
            first_name: this.json.firstName,
            last_name: this.json.lastName,
            account_id: this.json.id,
            email:this.json.email,
            api: this.json.api,
            secret: this.json.secret,
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

        return lastId;
    }
}