
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
    "data": [
        {}
    ],
    "error": ""
};
let post = {
    "success": true,
    "code": 200,
    "data": {
        "id": 1
    }
};

class PushNotification extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">A Push Notification instance resource represents a push notification created with uConnectedIT. It uses Google's Firebase Cloud Messaging.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Push Notification Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/push/{NOTIFICATION_ID}'}</code><br /><br />
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
                                <th>server_key</th>
                                <td>The server key from your Google FCM console.</td>
                            </tr>
                            <tr>
                                <th>registration_id</th>
                                <td>The registration ID from your Google FCM console.</td>
                            </tr>
                            <tr>
                                <th>title</th>
                                <td>The title of the notification.</td>
                            </tr>
                            <tr>
                                <th>body</th>
                                <td>The body of the notification.</td>
                            </tr>
                            <tr>
                                <th>icon</th>
                                <td>The URL of the icon to be used for the notification.</td>
                            </tr>
                            <tr>
                                <th>action</th>
                                <td>The URL to be called when the notification is clicked.</td>
                            </tr>
                            <tr>
                                <th>priority</th>
                                <td>The priority of this notification.</td>
                            </tr>
                            <tr>
                                <th>message_id</th>
                                <td>The message ID returned by the Google FCM.</td>
                            </tr>
                            <tr>
                                <th>price</th>
                                <td>The total price charged in your account for this notification.</td>
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
                    <p className="mb-4 docs">Get a single Push Notification Instance Resource</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/push/{NOTIFICATION_ID}'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getOne}></JSONPretty>
                    <hr />
                    <p className="mb-4 docs">Get the list of Push Notification Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/push'}</code><br /><br />
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
                    <p className="mb-4 docs">Send a Push Notification</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/push'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>server_key</th>
                                <td>The server key from your Google FCM console.</td>
                            </tr>
                            <tr>
                                <th>registration_id</th>
                                <td>The registration ID from your Google FCM console.</td>
                            </tr>
                            <tr>
                                <th>title</th>
                                <td>The title of the notification.</td>
                            </tr>
                            <tr>
                                <th>body</th>
                                <td>The body of the notification.</td>
                            </tr>
                            <tr>
                                <th>icon</th>
                                <td>The URL of the icon to be used for the notification.</td>
                            </tr>
                            <tr>
                                <th>action</th>
                                <td>The URL to be called when the notification is clicked.</td>
                            </tr>
                            <tr>
                                <th>priority</th>
                                <td>The priority of this notification.</td>
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
                    <h4 className="mb-4">REST API: Push Notification</h4>
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
}, PushNotification);