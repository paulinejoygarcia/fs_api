import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import payment from '/imports/api/payment';
import moment from 'moment-timezone';
import Modal from '../extra/Modal';
import '../../stylesheets/reports.css';
class Invoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoading2: true,
            ready: true,
            invoices: [],
            cdrs: [],
            viewInvoice: false,
            data: {}
        };
        this.style = {
            overlay: {
                zIndex: '9999',
                backgroundColor: 'rgba(0, 0, 0, 0.75)'
            },
            content: {
                width: '800px',
                height: 'calc(100vh - 130px)',
                margin: '1% auto',
                padding: '0px'
            }
        };
    }

    componentDidMount() {
        Meteor.call(payment.FetchInvoices, (err, result) => {
            if (err) alert(err);
            this.setState({ invoices: result, isLoading:false});
        });
        Meteor.call(payment.FetchCDRSInvoices, (err, result) => {
            if (err) alert(err);
            this.setState({ cdrs: result, isLoading2:false });
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
                        <td>{"#"+l.iid}</td>
                        <td>{status}</td>
                        <td>${(amount) ? amount.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : l.amount}</td>
                        <td>{l.description}</td>
                        <td>{moment(l.date).format('MMMM Do YYYY')}</td>
                        <td>{l.item}</td>
                        <td>
                            {l.status !== "Success"?
                                <button onClick={()=>{
                                    this.setState({viewInvoice:true,data:l});
                                }} className="btn btn-sm btn-primary">View</button>: null
                            }
                        </td>
                    </tr>
                );
            });
        else return (<tr/>)
    }

    renderCDRS() {
        if (this.state.cdrs.length > 0)
            return this.state.cdrs.map((l) => {
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

    renderInfo() {
        if (!this.state.ready) return <div/>;
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h3 className="reports-header">
                            Refill / DIDCHRG / etc...
                        </h3>
                        {(this.state.invoices.length > 0) ? (
                            <table className="table table-responsive table-hover">
                                <thead>
                                <tr>
                                    <th>Invoice ID</th>
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
                        ) : (<h3>{this.state.isLoading?
                                <i className="fa fa-spin fa-circle-o-notch" />:
                                "No Transactions have been made..."}
                            </h3>)}
                    </div>
                    <div className="col-md-12">
                        <h3 className="reports-header">
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
                        ) : (<h3>{this.state.isLoading2?
                            <i className="fa fa-spin fa-circle-o-notch" />:
                            "No Transactions have been made..."}
                        </h3>)}
                    </div>
                </div>
                <Modal
                    shouldCloseOnOverlayClick={true}
                    onRequestClose={() => this.setState({ viewInvoice: false })}
                    onAfterOpen={()=>{}}
                    isOpen={this.state.viewInvoice}
                    style={this.style}
                    contentLabel="View Invoice Details"
                >
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12" style={{padding:"20px"}}>
                                <div className="row">
                                    <h2 className="col-md-12">Invoice
                                        <span className="pull-right"><h3>Order # {this.state.data.iid}</h3></span>
                                    </h2>
                                    <hr style={{width:"calc(100% - 10px)"}} />
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <h4>Invoice To:</h4><br />
                                        {this.state.data.company}<br />
                                        {this.state.data.address} {this.state.data.city},{this.state.data.province} <br />
                                        {this.state.data.country}
                                    </div>
                                    <div className="col-md-6 text-right">
                                        <h4>Order Date:</h4><br />
                                        {moment(this.state.data.date).format("MMM DD, YYYY")}<br /><br />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading">
                                        <h3 className="panel-title"><strong>Order summary</strong></h3>
                                    </div>
                                    <div className="panel-body">
                                        <div className="table-responsive">
                                            <table className="table table-condensed">
                                                <thead>
                                                <tr>
                                                    <td><strong>Item</strong></td>
                                                    <td className="text-center"><strong>Price</strong></td>
                                                    <td className="text-center"><strong>Quantity</strong></td>
                                                    <td><strong>Description</strong></td>
                                                    <td className="text-right"><strong>Totals</strong></td>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                <tr>
                                                    <td>{this.state.data.item}</td>
                                                    <td className="text-center">
                                                        ${(this.state.data.amount) ? parseFloat(this.state.data.amount).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : this.state.data.amount}
                                                    </td>
                                                    <td className="text-center">{1}</td>
                                                    <td>{this.state.data.description}</td>
                                                    <td className="text-right">${(this.state.data.amount) ? parseFloat(this.state.data.amount * 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : (this.state.data.amount * 1)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="thick-line" />
                                                    <td className="thick-line" />
                                                    <td className="thick-line" />
                                                    <td className="no-line text-center"><strong>Total</strong></td>
                                                    <td className="no-line text-right">${(this.state.data.amount) ? parseFloat(this.state.data.amount * 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') : (this.state.data.amount * 1)}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <button className="pull-right btn btn-default" onClick={()=>{
                                            this.setState({viewInvoice:false});
                                        }}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
    render(){
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Invoices</h4>
                </div>
                {this.renderInfo()}
            </div>
        );
    }
}

Invoice.propTypes = {};

export default createContainer(() => {
    return {};
}, Invoice);
