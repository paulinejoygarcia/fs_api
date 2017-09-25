import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import StripeCheckout from 'react-stripe-checkout';
import payment from '/imports/api/payment';
import {STRIPE} from '/imports/api/classes/Const';
class Billing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            ready: false,
            amount: 5
        };
        this.defaultAmount = 0;
        this.onToken = this.onToken.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    onToken(token) {
        this.setState({ isLoading: true });
        Meteor.call(payment.PaymentDetails, token, (err, result) => {
            if (err) alert(err);
            this.setState({ isLoading: false });
        });
    }

    getAmount() {
        if (this.defaultAmount > 0)
            return parseFloat(this.defaultAmount) * 100;
        return 0;
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({ [name]: value });
    }

    addCredit(ccInfo) {
        this.setState({ isLoading: true });
        Meteor.call(payment.AddCredit, ccInfo, this.state.amount, (err, result) => {
            if (err) alert(err);
            this.setState({ isLoading: false });
        });
    }

    componentDidMount() {
        this.tracker = Tracker.autorun(() => {
            this.setState({
                ready: false
            });
            this.mainSub = Meteor.subscribe(payment.CreditCardInfoPub, () => {
                let temp = payment.CCInfoDB.findOne();
                this.setState({ ready: true });
            });
        });
    }

    componentWillUnmount() {
        this.tracker.stop();
        if (this.mainSub)
            this.mainSub.stop();
    }

    renderCCInfo() {
        if (this.props.ccInfo.length)
            return this.props.ccInfo.map((l) => {
                return (
                    <tr key={l._id}>
                        <td>{l.card.name}</td>
                        <td>{l.card.brand}</td>
                        <td>{l.card.last4}</td>
                        <td>${l.credit.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')}</td>
                        <td>
                            <button className="btn btn-default" onClick={this.addCredit.bind(this, l)} disabled={this.state.isLoading}>Add Selected
                                Amount
                            </button>
                        </td>
                    </tr>
                );
            });
        else return (<tr/>)
    }

    render() {
        if (!this.state.ready) return <div/>;
        return (
            <div className="container">
                <div className="row">
                    <legend><strong>Step 1:</strong> Enter your Payment information</legend>
                    {(this.props.ccInfo.length) ?
                        (
                            <div className="panel-group">
                                <div className="panel panel-success text-center">
                                    <h3>Successfully Added Payment Information</h3>
                                </div>
                            </div>
                        ) :
                        (
                            <div className="text-center">
                                <h3>Fill out Stripe form</h3>
                                <StripeCheckout
                                    name="uConnectedIT"
                                    ComponentclassName="div"
                                    panelLabel="Add"
                                    amount={this.getAmount()}
                                    currency="USD"
                                    stripeKey={STRIPE.PUBLIC}
                                    locale="en"
                                    billingAddress={false}
                                    zipCode={true}
                                    allowRememberMe
                                    token={this.onToken}
                                    reconfigureOnUpdate={false}
                                    triggerEvent="onClick">
                                    <button className="btn btn-default btn-lg">
                                        <i className="fa fa-location-arrow" /> Open Form
                                    </button>
                                </StripeCheckout>
                            </div>

                        )
                    }
                </div>
                <hr/>
                <div className="row">
                    <legend><strong>Step 2:</strong> Add Credit / Funds</legend>
                    <div className="col-md-12">
                        <div className="col-md-8 col-md-push 4">
                            <div className="form-group">
                                <label htmlFor="">Select Amount To Add</label>
                                <select name="amount" value={this.state.amount} onChange={this.handleInputChange}
                                        className="form-control">
                                    <option value="5">$5.00</option>
                                    <option value="10">$10.00</option>
                                    <option value="15">$15.00</option>
                                    <option value="20">$20.00</option>
                                    <option value="25">$25.00</option>
                                    <option value="30">$30.00</option>
                                    <option value="35">$35.00</option>
                                    <option value="40">$40.00</option>
                                    <option value="45">$45.00</option>
                                    <option value="50">$50.00</option>
                                    <option value="55">$55.00</option>
                                    <option value="60">$60.00</option>
                                    <option value="65">$65.00</option>
                                    <option value="70">$70.00</option>
                                    <option value="75">$75.00</option>
                                    <option value="80">$80.00</option>
                                    <option value="85">$85.00</option>
                                    <option value="90">$90.00</option>
                                    <option value="95">$95.00</option>
                                    <option value="100">$100.00</option>
                                    <option value="105">$105.00</option>
                                    <option value="110">$110.00</option>
                                    <option value="115">$115.00</option>
                                    <option value="120">$120.00</option>
                                    <option value="125">$125.00</option>
                                    <option value="130">$130.00</option>
                                    <option value="135">$135.00</option>
                                    <option value="140">$140.00</option>
                                    <option value="145">$145.00</option>
                                    <option value="150">$150.00</option>
                                    <option value="155">$155.00</option>
                                    <option value="160">$160.00</option>
                                    <option value="165">$165.00</option>
                                    <option value="170">$170.00</option>
                                    <option value="175">$175.00</option>
                                    <option value="180">$180.00</option>
                                    <option value="185">$185.00</option>
                                    <option value="190">$190.00</option>
                                    <option value="195">$195.00</option>
                                    <option value="200">$200.00</option>
                                    <option value="205">$205.00</option>
                                    <option value="210">$210.00</option>
                                    <option value="215">$215.00</option>
                                    <option value="220">$220.00</option>
                                    <option value="225">$225.00</option>
                                    <option value="230">$230.00</option>
                                    <option value="235">$235.00</option>
                                    <option value="240">$240.00</option>
                                    <option value="245">$245.00</option>
                                    <option value="250">$250.00</option>
                                    <option value="255">$255.00</option>
                                    <option value="260">$260.00</option>
                                    <option value="265">$265.00</option>
                                    <option value="270">$270.00</option>
                                    <option value="275">$275.00</option>
                                    <option value="280">$280.00</option>
                                    <option value="285">$285.00</option>
                                    <option value="290">$290.00</option>
                                    <option value="295">$295.00</option>
                                    <option value="300">$300.00</option>
                                    <option value="305">$305.00</option>
                                    <option value="310">$310.00</option>
                                    <option value="315">$315.00</option>
                                    <option value="320">$320.00</option>
                                    <option value="325">$325.00</option>
                                    <option value="330">$330.00</option>
                                    <option value="335">$335.00</option>
                                    <option value="340">$340.00</option>
                                    <option value="345">$345.00</option>
                                    <option value="350">$350.00</option>
                                    <option value="355">$355.00</option>
                                    <option value="360">$360.00</option>
                                    <option value="365">$365.00</option>
                                    <option value="370">$370.00</option>
                                    <option value="375">$375.00</option>
                                    <option value="380">$380.00</option>
                                    <option value="385">$385.00</option>
                                    <option value="390">$390.00</option>
                                    <option value="395">$395.00</option>
                                    <option value="400">$400.00</option>
                                    <option value="405">$405.00</option>
                                    <option value="410">$410.00</option>
                                    <option value="415">$415.00</option>
                                    <option value="420">$420.00</option>
                                    <option value="425">$425.00</option>
                                    <option value="430">$430.00</option>
                                    <option value="435">$435.00</option>
                                    <option value="440">$440.00</option>
                                    <option value="445">$445.00</option>
                                    <option value="450">$450.00</option>
                                    <option value="455">$455.00</option>
                                    <option value="460">$460.00</option>
                                    <option value="465">$465.00</option>
                                    <option value="470">$470.00</option>
                                    <option value="475">$475.00</option>
                                    <option value="480">$480.00</option>
                                    <option value="485">$485.00</option>
                                    <option value="490">$490.00</option>
                                    <option value="495">$495.00</option>
                                    <option value="500">$500.00</option>
                                    <option value="505">$505.00</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-12">
                            {(this.props.ccInfo.length) ? (
                                <table className="table table-responsive table-hover">
                                    <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>type</th>
                                        <th>last 4</th>
                                        <th>Credits</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {this.renderCCInfo()}
                                    </tbody>
                                </table>
                            ) : (<div/>)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Billing.propTypes = {};

export default createContainer(() => {
    return {
        stripeKey: "pk_test_WfftiwPoPXztjgJuInczhsQD",
        ccInfo: payment.CCInfoDB.find().fetch()
    };
}, Billing);
