
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { API_BASE } from '../../../../api/classes/Const';
import JSONPretty from 'react-json-pretty';

let post = {
    "success": true,
    "code": 200,
    "data": "Social comment posted successfully",
    "error": ""
};

class SocialComment extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">An Social Comment instance resource represents a comment posted to a social network account that you have connected with uConnectedIT. The supported social networks are: Facebook, Instagram and Twitter.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Social Comment Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/social/comment/{SOCIAL_NETWORK'}</code>
                </div>
            </div>
        );
    }
    renderPost() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">HTTP POST</h5>
                    <p className="mb-4 docs">Create a Facebook, Instagram or Twitter Comment</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/comment/{`fb` or `ig` or `tw`}'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>post_id</th>
                                <td>The ID of the post that you want to add a comment on.</td>
                            </tr>
                            <tr>
                                <th>comment</th>
                                <td>The content of the comment you want to be posted.</td>
                            </tr>
                        </tbody>
                    </table><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={post}></JSONPretty>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">REST API: Social Comment</h4>
                </div>
                {this.renderDefinition()}
                {this.renderInstanceResource()}
                {this.renderPost()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, SocialComment);