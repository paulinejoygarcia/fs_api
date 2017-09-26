import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import util from './classes/Utilities';
import moment from 'moment';

export const PaymentDetails = 'payment-details';
export const AddCredit = 'add-credit';
export const FetchInvoices = 'fetch-invoices';
export const FetchCDRSInvoices = 'fetch-cdrs-invoices';
export const CreditCardInfoPub = 'credit-card-info-pub';
export const InvoicesInfoPub = 'invoices-info-pub';
export const RefillInvoicesInfoPub = 'refill-invoices-info-pub';
export const CCInfoDB = new Mongo.Collection('ccInfo', { idGeneration: 'MONGO' });
export const BillingInfoDB = new Mongo.Collection('billingInfo', { idGeneration: 'MONGO' });

let functions = {};
if (Meteor.isServer) {

    let updateInvoice = function(userId, amount, type, status, description, charge = null){


        let userQuery = "SELECT * FROM `accounts` WHERE `id`= ?";
        let invoiceConfQuery = "SELECT * FROM `invoice_conf`";
        let lastRecordQuery = "SELECT * FROM astpp.invoices ORDER BY id DESC limit 1";

        let user = server.dbConnection.selectOne(userQuery, [userId]);
        let invoiceConf = server.dbConnection.selectOne(invoiceConfQuery, []);
        let lastRecord = server.dbConnection.selectOne(lastRecordQuery, []);
        if (!user && !invoiceConf) return { error: "error" };
        let invoiceId = (lastRecord) ? (lastRecord.invoiceid * 1 + 1) : "0000";
        let isCharge = (charge) ? charge : null;
        const newBalance = (user.balance + amount);
        let invoice = server.dbConnection.insert('invoices', {
            invoice_prefix: "INV_",
            invoiceid: invoiceId,
            accountid: user.id,
            status: status,
            amount: amount,
            from_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            to_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            due_date: util.addDaysToDate(invoiceConf.interval),
            invoice_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            type: "I",
            balance: user.balance,
            confirm: isCharge.data.paid,
            invoice_note: description,
        }, `id=${user.id}`);

        server.dbConnection.insert('invoice_details', {
            invoiceid: invoice,
            accountid: user.id,
            item_type: "Refill",
            description: description,
            created_date: moment().format('YYYY-MM-DD HH:mm:ss'),
            before_balance: user.balance,
            after_balance: newBalance,
        }, `id=${user.id}`);

        return server.dbConnection.update('accounts', { balance: newBalance }, `id=${user.id}`);
    };










    functions[FetchInvoices] = function () {
        try {
            this.userId = "LNGZyhhWcXej85ysq";
            check(this.userId, String);

            let query = 'SELECT * FROM astpp.invoices i JOIN invoice_details id ON id.invoiceid = i.id WHERE i.accountid = ?';
            return server.dbConnection.select(query, [4]);

        } catch (err) {
            showError('method[%s]: %s.', FetchInvoices, err.message);
            return { error: err.message };
        }
    };
    functions[FetchCDRSInvoices] = function () {
        try {
            this.userId = "LNGZyhhWcXej85ysq";
            check(this.userId, String);

            let query = 'SELECT * FROM astpp.cdrs where accountid = ? ';
            return server.dbConnection.select(query, [4]);

        } catch (err) {
            showError('method[%s]: %s.', FetchCDRSInvoices, err.message);
            return { error: err.message };
        }
    };
    functions[PaymentDetails] = function (token) {
        try {
            this.userId = "LNGZyhhWcXej85ysq";
            check(token, Object);
            check(this.userId, String);
            const secretKey = Meteor.settings.stripe.test.private;
            if (secretKey && token.id) {
                const Stripe = require('./classes/Stripe').default;
                const stripeInstance = new Stripe(secretKey);
                const customer = stripeInstance.createCustomer(token.id);
                const data = Object.assign({}, customer, {
                    card: token.card,
                    credit: 0,
                    user: this.userId,
                    createdDt: new Date()
                });
                return CCInfoDB.insert(data);
            }
        } catch (err) {
            showError('method[%s]: %s.', PaymentDetails, err.message);
            return { error: err.message };
        }
    };
    functions[AddCredit] = function (ccInfo, amount) {
        try {
            this.userId = "LNGZyhhWcXej85ysq";
            check(this.userId, String);
            check(ccInfo, Object);
            check(amount, Number);
            const secretKey = Meteor.settings.stripe.test.private;
            if (ccInfo.id && secretKey) {
                let status = 1;
                const Stripe = require('./classes/Stripe').default;
                const stripeInstance = new Stripe(secretKey);
                const description = `[UCI CREDIT] Payment for Adding of Credit of Amount: ${amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}`;
                const charge = stripeInstance.chargeCustomer(ccInfo.id, (amount * 100), description);
                if (charge.success)
                    status = 0;
                else
                    status = 1;
                let userId = 1;
                return updateInvoice(userId, amount, "Refill", status, description, charge);
            }
        } catch (err) {
            showError('method[%s]: %s.', AddCredit, err.message);
            return { error: err.message };
        }
    };
    Meteor.publish(CreditCardInfoPub, function () {
        try {
            this.userId = "LNGZyhhWcXej85ysq";
            check(this.userId, String);
            return CCInfoDB.find({ user: this.userId });
        } catch (err) {
            showError('publish[%s]: %s.', CreditCardInfoPub, err.message);
            return [];
        }
    });
    Meteor.methods(functions);
}
