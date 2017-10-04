import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import ASTPPCustomer from './classes/ASTPPCustomer.jsx';

export const UsersProfile = 'users_profile';
export const UsersSave = 'users_save';
export const UsersSavePassword = 'users_save_password';
export const UsersRegister = 'users_register';
if (Meteor.isServer) {
    functions[UsersProfile] = function (photo) {
        Meteor.users.update({ _id: this.userId }, { $set: { "profile.avatar": photo } });
    };
    functions[UsersSave] = function (first, last) {
        return Meteor.users.update({ _id: Meteor.userId() }, { $set: { "profile.first": first, "profile.last": last } })
    };
    functions[UsersSavePassword] = function (newPassword) {
        return Accounts.setPassword(Meteor.userId(), newPassword);
    };
    functions[UsersRegister] = function (data) {
        let user = {};
        user.emails = [{ address: data.email, verified: true }];
        user.profile = { first: data.first, last: data.last };
        user.email = data.email;
        user.password = data.password;
        let id = Accounts.createUser(user);
        let customer = new ASTPPCustomer(id);
        customer.json.number = data.username;
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
        if (!addedCustomer)
            throw new Meteor.Error("500", "Problem on saving ASTPP account");
        Meteor.users.update({ _id: id }, { $set: {
            "profile.astpp": addedCustomer.id,
            "profile.api": addedCustomer.api,
            "profile.secret": addedCustomer.secret,
        } });
        return addedCustomer;
    };
    Accounts.validateLoginAttempt((data) => {
        if (data.error)
            return data.error;
        else
            return true;
    });
}
