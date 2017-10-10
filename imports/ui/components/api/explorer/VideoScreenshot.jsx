
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { CurrentApiCredentialsForm } from './Intro';
import RequestManager from './RequestManager';

const ACTION = {
    send: 1,
};

class VideoScreenshot extends Component {
    submit() {
        switch (this.props.action) {
            case ACTION.send:
                let params = {
                    ...this.json,
                    ...this.state
                };
                this.lib.sendScreenshot(params, data => this.setState({ response: data, isProcessing: false }));
                break;
        }
    }
    renderSendScreenshot() {
        let fileInputs = [
            {
                name: 'attachment',
                label: 'Attachment',
                accept: 'image/*',
                required: true
            }
        ];
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Send Screenshot</h5>
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
                    <h4 className="mb-4">Video Screenshot</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderSendScreenshot()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, VideoScreenshot);