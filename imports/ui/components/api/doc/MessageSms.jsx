
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { API_BASE } from '../../../../api/classes/Const';
import JSONPretty from 'react-json-pretty';

let getOne = {
    "success": true,
    "code": 200,
    "data": {},
    "error": ""
};
let getAll = {
    "success": true,
    "code": 200,
    "data": [],
    "error": ""
};
let post = {
    "success": true,
    "code": 200,
    "data": {
        "id": 1
    }
};

class MessageSMS extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">An SMS instance resource represents an SMS message that you have sent or received through uConnectedIT's number.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">SMS Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/message/sms/{MESSAGE_ID}'}</code><br /><br />
                    <h6>Resource Properties</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PROPERTY</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>id</th>
                                <td>The unique identification of this resource.</td>
                            </tr>
                            <tr>
                                <th>to</th>
                                <td>The phone number (in E.164 format) recipient of the SMS.</td>
                            </tr>
                            <tr>
                                <th>from</th>
                                <td>The phone number (in E.164 format) sender of the SMS.</td>
                            </tr>
                            <tr>
                                <th>body</th>
                                <td>The body of the message.</td>
                            </tr>
                            <tr>
                                <th>messageId</th>
                                <td>The message ID returned by the network.</td>
                            </tr>
                            <tr>
                                <th>price</th>
                                <td>The total price charged in your account for this SMS.</td>
                            </tr>
                            <tr>
                                <th>createdDt</th>
                                <td>The timestamp this SMS was created. It is in YYYY-MM-DD HH:mm:ss format.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
    renderGetRequest() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">HTTP GET</h5>
                    <p className="mb-4 docs">Get a single SMS Instance Resource</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/message/sms/{MESSAGE_ID}'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getOne}></JSONPretty>
                    <hr />
                    <p className="mb-4 docs">Get the list of SMS Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/message/sms'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getAll}></JSONPretty>
                </div>
            </div>
        );
    }
    renderPostRequest() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">HTTP POST</h5>
                    <p className="mb-4 docs">Send an SMS message</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/message/sms'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>to</th>
                                <td>The phone number (in E.164 format) recipient of the SMS.</td>
                            </tr>
                            <tr>
                                <th>from</th>
                                <td>The phone number (in E.164 format) sender of the SMS. It must be a uConnectedIT number.</td>
                            </tr>
                            <tr>
                                <th>body</th>
                                <td>The body of the message.</td>
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
                    <h4 className="mb-4">REST API: Message - SMS</h4>
                </div>
                {this.renderDefinition()}
                {this.renderInstanceResource()}
                {this.renderGetRequest()}
                {this.renderPostRequest()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, MessageSMS);