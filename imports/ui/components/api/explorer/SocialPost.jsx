
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
    piBoard: 4,
    piPin: 5,
    tw: 6,
};

class SocialPost extends Component {
    submit() {
        let type = '';
        let params = { ...this.json };
        switch (this.props.action) {
            case ACTION.fb:
                type = 'fb';
                if (this.state.image)
                    params.image = this.state.image;
                break;
            case ACTION.ig:
                type = 'ig';
                if (this.state.image) {
                    params.image = this.state.image;
                } else if (this.state.video) {
                    params.video = this.state.video;

                    if (this.state.cover_photo)
                        params.cover_photo = this.state.cover_photo;
                }
                break;
            case ACTION.li:
                type = 'li';
                break;
            case ACTION.piBoard:
                type = 'pi';
                params.type = 'board';
                break;
            case ACTION.piPin:
                type = 'pi';
                params.type = 'pin';
                if (this.state.image)
                    params.image = this.state.image;
                break;
            case ACTION.tw:
                type = 'tw';
                if (this.state.image)
                    params.image = this.state.image;
                break;
        }
        if (type) {
            this.lib.addSocialPost(type, params, data => this.setState({ response: data, isProcessing: false }));
        }
    }
    renderFB() {
        let fileInputs = [
            {
                name: 'image',
                label: 'Image',
                accept: 'image/*'
            }
        ];
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a Facebook Post</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.fb} jsonRequired="true" files={fileInputs} submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderIG() {
        let fileInputs = [
            {
                name: 'image',
                label: 'Image',
                accept: 'image/*'
            },
            {
                name: 'video',
                label: 'Video',
                accept: 'video/*'
            },
            {
                name: 'cover_photo',
                label: 'Video Cover Photo',
                accept: 'image/*'
            }
        ];
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create an Instagram Post</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.ig} jsonRequired="true" files={fileInputs} submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderLI() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a LinkedIn Post</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.li} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderPIBoard() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a Pinterest Board</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.piBoard} jsonRequired="true" submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderPIPin() {
        let fileInputs = [
            {
                name: 'image',
                label: 'Image',
                accept: 'image/*'
            }
        ];
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a Pinterest Pin</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.piPin} jsonRequired="true" files={fileInputs} submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    renderTW() {
        let fileInputs = [
            {
                name: 'image',
                label: 'Image',
                accept: 'image/*'
            }
        ];
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Create a Twitter Post</h5>
                    <div className="col-md-12">
                        <RequestManager {...this.props} action={ACTION.tw} jsonRequired="true" files={fileInputs} submit={this.submit} />
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Social Post</h4>
                </div>
                {CurrentApiCredentialsForm.call(this, this.props.credentials)}
                {this.renderFB()}
                {this.renderIG()}
                {this.renderLI()}
                {this.renderPIBoard()}
                {this.renderPIPin()}
                {this.renderTW()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, SocialPost);