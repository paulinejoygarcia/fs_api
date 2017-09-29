
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { CurrentApiCredentialsForm } from './Intro';
import RequestManager from './RequestManager';

const ACTION = {
    get: 1,
    add: 2,
    update: 3
};

class Application extends Component {
    submit() {
        switch (this.props.action) {
            case ACTION.get:
                this.lib.getApp(this.state.id, data => this.setState({ response: data, isProcessing: false }));
                break;
            case ACTION.add:
                this.lib.createApp(this.json, data => this.setState({ response: data, isProcessing: false }));
                break;
            case ACTION.update:
                this.lib.updateApp(this.state.id, this.json, data => this.setState({ response: data, isProcessing: false }));
                break;
        }
    }
    renderGetApp() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Get Application</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.get} hasId="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderAddApp() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Add Application</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.add} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderUpdateApp() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Update Application</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.update} idRequired="true" jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Application</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderGetApp()}
                {this.renderAddApp()}
                {this.renderUpdateApp()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, Application);