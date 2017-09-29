
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

class MessageMms extends Component {
    submit() {
        switch (this.props.action) {
            case ACTION.get:
                this.lib.getMms(this.state.id, data => this.setState({ response: data }));
                break;
            case ACTION.send:
                let params = {
                    ...this.json,
                    ...this.state
                };
                this.lib.sendMms(params, data => this.setState({ response: data }));
                break;
        }
    }
    renderGetMms() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Get MMS</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.get} hasId="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderSendMms() {
        let fileInputs = [
            {
                name: 'attachment',
                label: 'Attachment',
                required: true
            }
        ];
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Send MMS</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.send} files={fileInputs} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Message > MMS</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderGetMms()}
                {this.renderSendMms()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, MessageMms);