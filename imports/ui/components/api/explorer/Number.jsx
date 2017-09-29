
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { CurrentApiCredentialsForm } from './Intro';
import RequestManager from './RequestManager';

const ACTION = {
    incoming: 1,
    available: 2,
    owned: 3
};

class Number extends Component {
    submit() {
        switch (this.props.action) {
            case ACTION.available:
                this.lib.getNumberAvailable(data => this.setState({ response: data }));
                break;
            case ACTION.owned:
                this.lib.getNumberOwned(data => this.setState({ response: data }));
                break;
            case ACTION.incoming:
                this.lib.purchaseNumber(this.json, data => this.setState({ response: data }));
                break;
        }
    }
    renderAvailable() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Get Available Numbers</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.available} submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderOwned() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Get Owned Numbers</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.owned} submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderIncoming() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Provision a Number</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.incoming} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Number</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderAvailable()}
                {this.renderOwned()}
                {this.renderIncoming()}
            </div>
        );
    }
}

export default createContainer((props) => {
    return {};
}, Number);