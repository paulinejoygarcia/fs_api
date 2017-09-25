
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { API_BASE } from '../../../../api/classes/Const';
import JSONPretty from 'react-json-pretty';

let getOne = {
    "success": true,
    "code": 200,
    "data": {
        "id": "324a66da1241ed8798125a54",
        "to": 12345,
        "from": 12345,
        "direction": "outbound",
        "files": [],
        "price": 0.04,
        "uuid": "123",
        "totalPages": 0,
        "transferredPages": 0,
        "createdDt": "2017-09-22 15:44:52"
    },
    "error": ""
};
let getAll = {
    "success": true,
    "code": 200,
    "data": [
        {
            "id": "324a66da1241ed8798125a54",
            "to": 12345,
            "from": 12345,
            "direction": "outbound",
            "files": [],
            "price": 0.04,
            "uuid": "123",
            "totalPages": 0,
            "transferredPages": 0,
            "createdDt": "2017-09-22 15:44:52"
        }
    ],
    "error": ""
};
let post = {
    "success": true,
    "code": 200,
    "data": "Fax queued successfully"
};

class Fax extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">An Fax instance resource represents an fax that you have sent or received through uConnectedIT's number.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Fax Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/fax/{FAX_ID}'}</code><br /><br />
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
                                <td>The phone number (in E.164 format) recipient of the fax.</td>
                            </tr>
                            <tr>
                                <th>from</th>
                                <td>The phone number (in E.164 format) sender of the fax.</td>
                            </tr>
                            <tr>
                                <th>direction</th>
                                <td>The direction of the fax. Either <code>outbound</code> or <code>inbound</code>.</td>
                            </tr>
                            <tr>
                                <th>files</th>
                                <td>The array representation of <code>pdf</code> files that consist of this fax.</td>
                            </tr>
                            <tr>
                                <th>price</th>
                                <td>The total price charged in your account for this fax.</td>
                            </tr>
                            <tr>
                                <th>uuid</th>
                                <td>The fax ID returned by the fax machine.</td>
                            </tr>
                            <tr>
                                <th>totalPages</th>
                                <td>The number of total pages in this fax.</td>
                            </tr>
                            <tr>
                                <th>transferredPages</th>
                                <td>The number of transferred pages sent or received in this fax.</td>
                            </tr>
                            <tr>
                                <th>createdDt</th>
                                <td>The timestamp this fax was created. It is in YYYY-MM-DD HH:mm:ss format.</td>
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
                    <p className="mb-4 docs">Get a single Fax Instance Resource</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/fax/{FAX_ID}'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getOne}></JSONPretty>
                    <hr />
                    <p className="mb-4 docs">Get the list of Fax Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/fax'}</code><br /><br />
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
                    <p className="mb-4 docs">Send a Fax</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/fax'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>to</th>
                                <td>The phone number (in E.164 format) recipient of the fax.</td>
                            </tr>
                            <tr>
                                <th>from</th>
                                <td>The phone number (in E.164 format) sender of the fax. It must be a uConnectedIT number.</td>
                            </tr>
                            <tr>
                                <th>files</th>
                                <td>The array representation of <code>pdf</code> files that consist of this fax.</td>
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
                    <h4 className="mb-4">REST API: Fax</h4>
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
}, Fax);