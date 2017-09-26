
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { API_BASE } from '../../../../api/classes/Const';
import JSONPretty from 'react-json-pretty';

let auth = {
    "success": true,
    "code": 200,
    "data": {
        "code": "FiZ+a21BZg87XgdXJUNjAS8kBHciYQI1Lw8vcjMnBxI0SHwwZnxbQyxYPB4RPTJjEwkhJBUpChYiJSBqEllwNycHcV0uWR5nLAIWYA4fHgIbFgx3FiUHKTZzYDc8WHdYUV9oOBgcKmUkPyIgOikHFgxcBxc5SQp7"
    },
    "error": ""
};

class Intro extends Component {
    renderRequestDetails() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Your Request</h5>
                    <h6>Base URL:</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}'}</code><br /><br />
                    <p className="mb-4 docs">All requests to uConnectedIT's REST API require you to authenticate via Basic Authentication with the <code>username</code> set to your <code>API Key</code> and the <code>password</code> set to your <code>API Secret</code>. Your <code>Account ID</code>, <code>API Key</code> and <code>API Secret</code> can be found in your Account Dashboard.</p>
                    <p className="mb-4 docs">All requests to uConnectedIT's REST API also require you to pass the <code>accessCode</code> parameter. An access code can only be used in a maximum of 3 hours. If expired, you have to request for a new access code again. An access code can be obtained by making a GET request with basic authentication to:</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/auth'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={auth}></JSONPretty>
                </div>
            </div>
        );
    }
    renderResponseDetails() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">uConnectedIT's Response</h5>
                    <p className="mb-4 docs">All responses of uConnectedIT's REST API are in JSON format. It contains a <code>success</code> key which represents whether the request was processed successfully or not. It also contains a <code>code</code> key which represents the status code of the response. The most important key is <code>data</code> which contains the details of the response (i.e. ID of a created instance resource, list of instance resources, etc). The <code>error</code> key provides the details of a failed request (i.e. missing parameters, insufficient funds, etc).</p>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Using the API</h4>
                </div>
                {this.renderRequestDetails()}
                {this.renderResponseDetails()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, Intro);