
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { CurrentApiCredentialsForm } from './Intro';
import RequestManager from './RequestManager';

const ACTION = {
    fb: 1,
    li: 2,
    tw: 3,
};

class SocialComment extends Component {
    submit() {
        let type = '';
        switch (this.props.action) {
            case ACTION.fb:
                type = 'fb';
                break;
            case ACTION.li:
                type = 'li';
                break;
            case ACTION.tw:
                type = 'tw';
                break;
        }
        if (type) {
            this.lib.addSocialComment(type, this.json, data => this.setState({ response: data }));
        }
    }
    renderFB() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a Facebook Comment</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.fb} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderLI() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a LinkedIn Comment</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.li} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderTW() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a Twitter Comment</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.tw} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Create a Social Comment</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderFB()}
                {this.renderLI()}
                {this.renderTW()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, SocialComment);