import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import moment from 'moment';
export const PaymentDetails = 'payment-details';
export const AddCredit = 'add-credit';
export const CreditCardInfoPub = 'credit-card-info-pub';
export const InvoicesInfoPub = 'invoices-info-pub';
export const CCInfoDB = new Mongo.Collection('ccInfo', { idGeneration: 'MONGO' });
export const BillingInfoDB = new Mongo.Collection('bilingInfo', { idGeneration: 'MONGO' });




let functions = {};
if (Meteor.isServer) {
    functions[PaymentDetails] = function (token) {
        try {
            check(token, Object);
            check(this.userId, String);
            const secretKey = Meteor.settings.stripe.test.private;
            if (secretKey && token.id) {
                const Stripe = require('./classes/Stripe').default;
                const stripeInstance = new Stripe(secretKey);
                const customer = stripeInstance.createCustomer(token.id);
                const data = Object.assign({}, customer, { card: token.card , credit: 0, user: this.userId, createdDt: new Date()});
                return CCInfoDB.insert(data);
            }
        } catch (err) {
            console.log('method[%s]: %s.', PaymentDetails, err.message);
            return { error: err.message };
        }
    };
    functions[AddCredit] = function (ccInfo, amount) {
        try {
            check(this.userId, String);
            check(ccInfo, Object);
            check(amount, Number);
            const secretKey = Meteor.settings.stripe.test.private;
            if (ccInfo.id && secretKey) {
                const Stripe = require('./classes/Stripe').default;
                const stripeInstance = new Stripe(secretKey);
                const description = `[UCI CREDIT] Payment for Adding of Credit of Amount: ${amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
                const charge = stripeInstance.chargeCustomer(ccInfo.id, (amount * 100), description);
                const newBalance = (ccInfo.credit + amount);
                if (charge.success) {
                    BillingInfoDB.insert({
                        customer: ccInfo.id,
                        charge: charge,
                        user: this.userId,
                        amount: amount,
                        description: description,
                        createdDt: new Date()
                    });
                    CCInfoDB.update({_id: ccInfo._id}, {
                        $set: {
                            'credit': newBalance,
                        }
                    });
                    //server.dbConnection.update('accounts', { newBalance }, `id=${this.accountData.id}`);
                } else {
                    console.log(charge);
                }
            }
        } catch (err) {
            console.log('method[%s]: %s.', AddCredit, err.message);
            return { error: err.message };
        }
    };
    Meteor.publish(CreditCardInfoPub, function () {
        try {
            check(this.userId, String);
            return CCInfoDB.find({user: this.userId});
        } catch (err) {
            console.log('publish[%s]: %s.', CreditCardInfoPub, err.message);
            return [];
        }
    });
    Meteor.publish(InvoicesInfoPub, function () {
        try {
            check(this.userId, String);
            return BillingInfoDB.find({user: this.userId});
        } catch (err) {
            console.log('publish[%s]: %s.', InvoicesInfoPub, err.message);
            return [];
        }
    });
    Meteor.methods(functions);
}
