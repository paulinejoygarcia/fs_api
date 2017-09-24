import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import ASTPPCustomer from './classes/ASTPPCustomer.jsx';

export const UsersRegister = 'users_register';
if (Meteor.isServer) {
    functions[UsersRegister] = function(data){
        let user = {};
        user.emails = [{address:data.email,verified:true}];
        user.profile = {first:data.first,last:data.last};
        user.email = data.email;
        user.password = data.password;
        let id = Accounts.createUser(user);
        let customer = new ASTPPCustomer(id);
        customer.json.firstName = data.first;
        customer.json.lastName = data.last;
        customer.json.email = data.email;
        customer.json.pin = data.pin;
        customer.json.countryId = data.country;
        customer.json.timezoneId = data.timezone;
        customer.json.currencyId = data.currency;
        customer.parseJSON(customer.json);
        customer.setPassword(data.password);
        customer.setEntityName();
        let addedCustomer = customer.customerAdd();
        if(!addedCustomer)
            throw new Meteor.Error("500","Problem on saving ASTPP account");
        return addedCustomer;
    };
        Accounts.validateLoginAttempt((data)=>{
        if(data.error)
            return data.error;
        else
            return true;
    });
}
