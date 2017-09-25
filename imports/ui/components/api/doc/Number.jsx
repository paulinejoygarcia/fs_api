
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { API_BASE } from '../../../../api/classes/Const';
import JSONPretty from 'react-json-pretty';

let getAll = {
    "success": true,
    "code": 200,
    "data": [
        {
            "id": 1,
            "number": "17034512457",
            "setup": 0.99,
            "monthlycost": 1
        }
    ],
    "error": ""
};
let post = {
    "success": true,
    "code": 200,
    "data": "DID number purchased successfully"
};

class Number extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">An Number instance resource represents uConnectedIT's number. It is used as the phone number to send message or fax, etc.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Number Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/number/{REQUEST_ACTION}'}</code><br /><br />
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
                                <th>number</th>
                                <td>The phone number (in E.164 format).</td>
                            </tr>
                            <tr>
                                <th>setup</th>
                                <td>The setup cost of this number.</td>
                            </tr>
                            <tr>
                                <th>monthlyCost</th>
                                <td>The monthly cost of this number.</td>
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
                    <p className="mb-4 docs">Get the list of available Number Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/number/available'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getAll}></JSONPretty>
                    <hr />
                    <p className="mb-4 docs">Get the list of owned Number Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/number/owned'}</code><br /><br />
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
                    <p className="mb-4 docs">Provision a Number</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/incoming'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>did_id</th>
                                <td>The ID of the number that you want to purchase.</td>
                            </tr>
                            <tr>
                                <th>app_id</th>
                                <td>The ID of the application instance resource that you want to be used by this number.</td>
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
                    <h4 className="mb-4">REST API: Number</h4>
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
}, Number);