
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { CurrentApiCredentialsForm } from './Intro';
import RequestManager from './RequestManager';

const ACTION = {
    get: 1,
    send: 2,
};

class PushNotification extends Component {
    submit() {
        switch (this.props.action) {
            case ACTION.get:
                this.lib.getPushNotification(this.state.id, data => this.setState({ response: data }));
                break;
            case ACTION.send:
                let params = {
                    ...this.json,
                    ...this.state
                };
                this.lib.sendPushNotification(params, data => this.setState({ response: data }));
                break;
        }
    }
    renderGetPushNotification() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Get Push Notification</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.get} hasId="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderSendPushNotification() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Send Push Notification</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.send} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Push Notifications</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderGetPushNotification()}
                {this.renderSendPushNotification()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, PushNotification);