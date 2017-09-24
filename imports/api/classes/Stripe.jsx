import npmStripe from 'stripe';
import Future from 'fibers/future';

export default class Stripe {
    constructor(secret) {
        this.instance = new npmStripe(secret);
    }

    createCustomer(source) {
        const fut = new Future();
        this.instance.customers.create({ source }, (err, customer) => {
            let result = {};
            if (err) {
                result = {
                    success: false,
                    data: {
                        type: err.type,
                        msg: err.message
                    }
                };
            } else {
                result = {
                    success: true,
                    id: customer.id
                };
            }
            fut.return(result);
        });
        return fut.wait();
    }

    chargeCustomer(customer, amount, description, currency = 'usd') {
        const fut = new Future();
        this.instance.charges.create({
            customer,
            amount: amount * 100,
            currency,
            description
        }, (err, charge) => {
            let result = {};
            if (err) {
                result = {
                    success: false,
                    data: {
                        type: err.type,
                        msg: err.message
                    }
                };
            } else {
                result = {
                    success: true,
                    data: {
                        id: charge.id,
                        paid: charge.captured & charge.paid,
                        captured: charge.captured
                    }
                };
            }
            fut.return(result);
        });
        return fut.wait();
    }
}