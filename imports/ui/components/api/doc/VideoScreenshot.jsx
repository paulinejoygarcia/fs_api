
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

class VideoScreenshot extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">A Video Screenshot instance resource represents a screenshot that you have sent or received through uConnectedIT's number.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Video Screenshot Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/video/screensot/{SCREENSHOT_ID}'}</code><br /><br />
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
                                <td>The phone number (in E.164 format) recipient of the screenshot.</td>
                            </tr>
                            <tr>
                                <th>from</th>
                                <td>The phone number (in E.164 format) sender of the screenshot.</td>
                            </tr>
                            <tr>
                                <th>body</th>
                                <td>The body of the message.</td>
                            </tr>
                            <tr>
                                <th>attachment</th>
                                <td>The array representation of <code>media</code> files that consist of this screenshot.</td>
                            </tr>
                            <tr>
                                <th>message_id</th>
                                <td>The message ID returned by the network.</td>
                            </tr>
                            <tr>
                                <th>price</th>
                                <td>The total price charged in your account for this screenshot.</td>
                            </tr>
                            <tr>
                                <th>created_dt</th>
                                <td>The timestamp this screenshot was created. It is in YYYY-MM-DD HH:mm:ss format.</td>
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
                    <p className="mb-4 docs">Get a single Video Screenshot Instance Resource</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/video/screensot/{SCREENSHOT_ID}'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getOne}></JSONPretty>
                    <hr />
                    <p className="mb-4 docs">Get the list of Video Screenshot Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/video/screensot'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getAll}></JSONPretty>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">REST API: Video Screenshot</h4>
                </div>
                {this.renderDefinition()}
                {this.renderInstanceResource()}
                {this.renderGetRequest()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, VideoScreenshot);