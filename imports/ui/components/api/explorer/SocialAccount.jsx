
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { CurrentApiCredentialsForm } from './Intro';
import RequestManager from './RequestManager';

const ACTION = {
    fb: 1,
    ig: 2,
    li: 3,
    pi: 4,
    tw: 5,
};

class SocialAccount extends Component {
    submit() {
        let type = '';
        switch (this.props.action) {
            case ACTION.fb:
                type = 'fb';
                break;
            case ACTION.ig:
                type = 'ig';
                break;
            case ACTION.li:
                type = 'li';
                break;
            case ACTION.pi:
                type = 'pi';
                break;
            case ACTION.tw:
                type = 'tw';
                break;
        }
        if (type) {
            this.lib.saveSocialAccount(type, this.json, data => this.setState({ response: data, isProcessing: false }));
        }
    }
    renderAddSocialAccountFB() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Facebook Account</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.fb} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderAddSocialAccountIG() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Instagram Account</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.ig} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderAddSocialAccountLI() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">LinkedIn Account</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.li} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderAddSocialAccountPI() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Pinterest Account</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.pi} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderAddSocialAccountTW() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Twitter Account</h5>
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
                    <h4 className="mb-4">Social Account</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderAddSocialAccountFB()}
                {this.renderAddSocialAccountIG()}
                {this.renderAddSocialAccountLI()}
                {this.renderAddSocialAccountPI()}
                {this.renderAddSocialAccountTW()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, SocialAccount);