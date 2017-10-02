
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

class VoiceCall extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">A Voice Call instance resource represents a voice call that you have created or received through uConnectedIT's number.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Voice Call Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/voice/{CALL_ID}'}</code><br /><br />
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
                                <td>The callee phone number (in E.164 format).</td>
                            </tr>
                            <tr>
                                <th>from</th>
                                <td>The caller phone number (in E.164 format).</td>
                            </tr><tr>
                                <th>call_id</th>
                                <td>The call ID returned by the network.</td>
                            </tr>
                            <tr>
                                <th>price</th>
                                <td>The total price charged in your account for this voice call.</td>
                            </tr>
                            <tr>
                                <th>created_dt</th>
                                <td>The timestamp this call was created. It is in YYYY-MM-DD HH:mm:ss format.</td>
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
                    <p className="mb-4 docs">Get a single Voice Call Instance Resource</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/voice/{CALL_ID}'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getOne}></JSONPretty>
                    <hr />
                    <p className="mb-4 docs">Get the list of Voice Call Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/voice'}</code><br /><br />
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
                    <h4 className="mb-4">REST API: Voice Call</h4>
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
}, VoiceCall);