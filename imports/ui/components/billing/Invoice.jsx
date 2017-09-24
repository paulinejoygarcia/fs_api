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
            ready: false,
        };
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    componentDidMount() {
        this.tracker = Tracker.autorun(() => {
            this.setState({
                ready: false
            });
            this.mainSub = Meteor.subscribe(payment.InvoicesInfoPub, () => {
                let temp = payment.BillingInfoDB.findOne();
                this.setState({ ready: true });
            });
        });
    }

    componentWillUnmount() {
        this.tracker.stop();
        if (this.mainSub)
            this.mainSub.stop();
    }

    renderInvoices() {
        if (this.props.invoices.length)
            return this.props.invoices.map((l) => {
                return (
                    <tr key={l._id}>
                        <td>{(l.charge.success) ? "Success" : "failed"}</td>
                        <td>{l.amount}</td>
                        <td>{l.description}</td>
                        <td>{moment(l.createdDt).format('MMMM Do YYYY')}</td>
                        <td>{l.type}</td>
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
                        <div className="col-md-12">
                            {(this.props.invoices.length) ? (
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
                    </div>
                </div>
            </div>
        );
    }
}

Invoice.propTypes = {};

export default createContainer(() => {
    return {
        invoices: payment.BillingInfoDB.find().fetch()
    };
}, Invoice);
