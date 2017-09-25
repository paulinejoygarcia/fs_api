
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
        "id": "1",
        "friendly_name": "Sample App",
        "call_url": "http://www.acme.com/call.php",
        "call_method": "GET",
        "call_fb_url": "http://www.acme.com/call_fallback.php",
        "call_fb_method": "GET",
        "msg_url": "http://www.acme.com/msg.php",
        "msg_method": "GET",
        "msg_fb_url": "http://www.acme.com/msg_fallback.php",
        "msg_fb_method": "GET",
        "fax_url": "http://www.acme.com/fax.php",
        "fax_method": "GET",
        "fax_fb_url": "http://www.acme.com/fax_fallback.php",
        "fax_fb_method": "GET",
    },
    "error": ""
};
let getAll = {
    "success": true,
    "code": 200,
    "data": [
        {
            "id": "1",
            "friendly_name": "Sample App",
            "call_url": "http://www.acme.com/call.php",
            "call_method": "GET",
            "call_fb_url": "http://www.acme.com/call_fallback.php",
            "call_fb_method": "GET",
            "msg_url": "http://www.acme.com/msg.php",
            "msg_method": "GET",
            "msg_fb_url": "http://www.acme.com/msg_fallback.php",
            "msg_fb_method": "GET",
            "fax_url": "http://www.acme.com/fax.php",
            "fax_method": "GET",
            "fax_fb_url": "http://www.acme.com/fax_fallback.php",
            "fax_fb_method": "GET",
        }
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

class Application extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">An Application instance resource represents an application that you have created with uConnectedIT. An application inside of uConnectedIT is just a set of URLs and other configuration data that tells uConnectedIT how to behave when one of your uConnectedIT numbers receives a call, SMS or fax message.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Application Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/app/{APPLICATION_ID}'}</code><br /><br />
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
                                <th>friendly_name</th>
                                <td>A human readable descriptive text for this resource, up to 64 characters long.</td>
                            </tr>
                            <tr>
                                <th>call_url</th>
                                <td>The URL uConnectedIT will request when a phone number assigned to this application receives a call.</td>
                            </tr>
                            <tr>
                                <th>call_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>call_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>call_fb_url</th>
                                <td>The URL that uConnectedIT will request if an error occurs while retrieving uConnectML requested by <code>call_url</code>.</td>
                            </tr>
                            <tr>
                                <th>call_fb_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>call_fb_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>msg_url</th>
                                <td>The URL uConnectedIT will request when a phone number assigned to this application receives an incoming SMS or MMS message.</td>
                            </tr>
                            <tr>
                                <th>msg_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>msg_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>msg_fb_url</th>
                                <td>The URL that uConnectedIT will request if an error occurs while retrieving uConnectML requested by <code>msg_url</code>.</td>
                            </tr>
                            <tr>
                                <th>msg_fb_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>msg_fb_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>fax_url</th>
                                <td>The URL uConnectedIT will request when a phone number assigned to this application receives an incoming fax.</td>
                            </tr>
                            <tr>
                                <th>fax_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>fax_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>fax_fb_url</th>
                                <td>The URL that uConnectedIT will request if an error occurs while retrieving uConnectML requested by <code>fax_url</code>.</td>
                            </tr>
                            <tr>
                                <th>fax_fb_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>fax_fb_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
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
                    <p className="mb-4 docs">Get a single Application Instance Resource</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/app/{APPLICATION_ID}'}</code><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={getOne}></JSONPretty>
                    <hr />
                    <p className="mb-4 docs">Get the list of Application Instance Resources</p>
                    <code>GET {API_BASE}{'{ACCOUNT_ID}/app'}</code><br /><br />
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
                    <p className="mb-4 docs">Create an Application Instance Resource</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/app'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>friendly_name</th>
                                <td>A human readable descriptive text for this resource, up to 64 characters long.</td>
                            </tr>
                            <tr>
                                <th>call_url</th>
                                <td>The URL uConnectedIT will request when a phone number assigned to this application receives a call.</td>
                            </tr>
                            <tr>
                                <th>call_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>call_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>call_fb_url</th>
                                <td>The URL that uConnectedIT will request if an error occurs while retrieving uConnectML requested by <code>call_url</code>.</td>
                            </tr>
                            <tr>
                                <th>call_fb_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>call_fb_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>msg_url</th>
                                <td>The URL uConnectedIT will request when a phone number assigned to this application receives an incoming SMS or MMS message.</td>
                            </tr>
                            <tr>
                                <th>msg_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>msg_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>msg_fb_url</th>
                                <td>The URL that uConnectedIT will request if an error occurs while retrieving uConnectML requested by <code>msg_url</code>.</td>
                            </tr>
                            <tr>
                                <th>msg_fb_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>msg_fb_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>fax_url</th>
                                <td>The URL uConnectedIT will request when a phone number assigned to this application receives an incoming fax.</td>
                            </tr>
                            <tr>
                                <th>fax_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>fax_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                            <tr>
                                <th>fax_fb_url</th>
                                <td>The URL that uConnectedIT will request if an error occurs while retrieving uConnectML requested by <code>fax_url</code>.</td>
                            </tr>
                            <tr>
                                <th>fax_fb_method</th>
                                <td>The HTTP method uConnectedIT will use when requesting the <code>fax_fb_url</code>. Either <code>GET</code> or <code>POST</code>.</td>
                            </tr>
                        </tbody>
                    </table><br /><br />
                    <h6>Sample Response</h6>
                    <JSONPretty json={post}></JSONPretty>
                </div>
            </div>
        );
    }
    renderPutRequest() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">HTTP PUT</h5>
                    <p className="mb-4 docs">Update an existing Application Instance Resource</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/app/{APPLICATION_ID}'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <p className="mb-4 docs">Request parameters are identical to HTTP POST request when creating an application instance resource.</p><br /><br />
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
                    <h4 className="mb-4">REST API: Application</h4>
                </div>
                {this.renderDefinition()}
                {this.renderInstanceResource()}
                {this.renderGetRequest()}
                {this.renderPostRequest()}
                {this.renderPutRequest()}
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, Application);