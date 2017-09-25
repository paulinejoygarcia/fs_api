import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

export const UsersRegister = 'users_register';
if (Meteor.isServer) {
    functions[UsersRegister] = function(data){
        let user = {};
        user.emails = [{address:data.email,verified:true}];
        user.profile = {first:data.first,last:data.last};
        user.email = data.email;
        user.password = data.password;
        Accounts.createUser(user);
    };
    Accounts.validateLoginAttempt((data)=>{
        if(data.error)
            return data.error;
        else
            return true;
    });
}
