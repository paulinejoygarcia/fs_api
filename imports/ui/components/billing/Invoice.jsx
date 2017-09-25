import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import payment from '/imports/api/payment';
import moment from 'moment-timezone';

class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            ready: true,
            invoices: [],
            cdrs: []
        };
    }

    componentDidMount() {
        Meteor.call(payment.FetchInvoices, (err, result) => {
            if (err) alert(err);
            this.setState({ invoices: result });
        });
        Meteor.call(payment.FetchCDRSInvoices, (err, result) => {
            if (err) alert(err);
            this.setState({ cdrs: result });
        });
    }


    componentWillUnmount() {
    }

    renderInvoices() {
        if (this.state.invoices.length > 0)
            return this.state.invoices.map((l) => {
                let status = "failed";
                switch (l.status) {
                    case 0:
                        status = "Success";
                        break;
                    case 1:
                        break;
                    case 2:
                        status = "failed";
                        break;
                    default:
                        status = "failed";
                }
                let amount = (l.amount * 1);
                return (
                    <tr key={l.id}>
                        <td>{status}</td>
                        <td>${(amount) ? amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : l.amount}</td>
                        <td>{l.description}</td>
                        <td>{moment(l.created_date).format('MMMM Do YYYY')}</td>
                        <td>{l.item_type}</td>
                    </tr>
                );
            });
        else return (<tr/>)
    }

    renderCDRS() {
        if (this.state.cdrs.length > 0)
            return this.state.cdrs.map((l) => {
            console.log(l);
                return (
                    <tr key={l.uniqueid}>
                        <td>{l.calltype}</td>
                        <td>{l.billseconds}</td>
                        <td>{l.disposition}</td>
                        <td>{l.call_direction}</td>
                        <td>{l.notes}</td>
                        <td>{moment(l.profile_start_stamp).format('MMMM Do YYYY')}</td>
                    </tr>
                );
            });
        else return (<tr/>)
    }

    render() {
        if (!this.state.ready) return <div/>;
        return (
            <div className="container">
                <legend>Invoices</legend>
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="text-center">
                            Refill / DIDCHRG / etc...
                        </h3>
                        {(this.state.invoices.length > 0) ? (
                            <table className="table table-responsive table-hover">
                                <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th>Type</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.renderInvoices()}
                                </tbody>
                            </table>
                        ) : (<h3>No Transactions have been made...</h3>)}
                    </div>
                    <div className="col-md-12">
                        <h3 className="text-center">
                            CDRS
                        </h3>
                        {(this.state.invoices.length > 0) ? (
                            <table className="table table-responsive table-hover">
                                <thead>
                                <tr>
                                    <th>Call Type</th>
                                    <th>Bill Seconds</th>
                                    <th>Disposition</th>
                                    <th>Call Direction</th>
                                    <th>Notes</th>
                                    <th>Profile Start Stamp / Date</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.renderCDRS()}
                                </tbody>
                            </table>
                        ) : (<h3>No Transactions have been made...</h3>)}
                    </div>
                </div>
            </div>
        );
    }
}

Invoice.propTypes = {};

export default createContainer(() => {
    return {};
}, Invoice);
