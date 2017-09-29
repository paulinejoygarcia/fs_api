
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { CurrentApiCredentialsForm } from './Intro';
import RequestManager from './RequestManager';

const ACTION = {
    get: 1,
};

class VideoCall extends Component {
    submit() {
        switch (this.props.action) {
            case ACTION.get:
                this.lib.getVideoCall(this.state.id, data => this.setState({ response: data, isProcessing: false }));
                break;
        }
    }
    renderGetCall() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Get Video Call</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.get} hasId="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Video Call</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderGetCall()}
            </div>
        );
    }
}

export default createContainer((props) => {
    return {};
}, VideoCall);