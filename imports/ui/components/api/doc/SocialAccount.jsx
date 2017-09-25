
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { API_BASE } from '../../../../api/classes/Const';
import JSONPretty from 'react-json-pretty';

let post = {
    "success": true,
    "code": 200,
    "data": "Social account saved",
    "error": ""
};

class SocialAccount extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">An Social Account instance resource represents a social network account that you have connected with uConnectedIT. It can be used by uConnectedIT to post or comment in your behalf. The supported social networks are: Facebook, Instagram, Linkedin, Pinterest and Twitter.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Social Account Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/social/account/{SOCIAL_NETWORK'}</code>
                </div>
            </div>
        );
    }
    renderPost() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">HTTP POST</h5>
                    <p className="mb-4 docs">Add a Facebook Page Account</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/fb'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>access_token</th>
                                <td>The permanent access token of your Facebook page.</td>
                            </tr>
                            <tr>
                                <th>app_id</th>
                                <td>The ID of your application associated with your Facebook page.</td>
                            </tr>
                            <tr>
                                <th>app_secret</th>
                                <td>The application secret associated with your Facebook page.</td>
                            </tr>
                            <tr>
                                <th>page_id</th>
                                <td>The ID of your Facebook page.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Add an Instagram Account</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/ig'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>username</th>
                                <td>The username of your Instagram account.</td>
                            </tr>
                            <tr>
                                <th>password</th>
                                <td>The password of your Instagram account.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Add a LinkedIn Account</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/li'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>access_token</th>
                                <td>The access token of your LinkedIn company account.</td>
                            </tr>
                            <tr>
                                <th>client_id</th>
                                <td>The client ID of the application associated to your LinkedIn company account.</td>
                            </tr>
                            <tr>
                                <th>client_secret</th>
                                <td>The client secret of the application associated to your LinkedIn company account.</td>
                            </tr>
                            <tr>
                                <th>company_id</th>
                                <td>The ID of your LinkedIn company account.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Add a Pinterest Account</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/pi'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>access_token</th>
                                <td>The access token of your Pinterest account.</td>
                            </tr>
                            <tr>
                                <th>client_id</th>
                                <td>The client ID of the application associated to your Pinterest account.</td>
                            </tr>
                            <tr>
                                <th>client_secret</th>
                                <td>The client secret of the application associated to your Pinterest account.</td>
                            </tr>
                            <tr>
                                <th>username</th>
                                <td>The username of your Pinterest account.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Add a Twitter Account</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/tw'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>consumer_key</th>
                                <td>The consumer key of the application associated with your Twitter account.</td>
                            </tr>
                            <tr>
                                <th>consumer_secret</th>
                                <td>The consumer secret of the application associated with your Twitter account.</td>
                            </tr>
                            <tr>
                                <th>access_key</th>
                                <td>The access key of the application associated with your Twitter account.</td>
                            </tr>
                            <tr>
                                <th>access_secret</th>
                                <td>The access secret of the application associated with your Twitter account.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr /><br />
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
                    <h4 className="mb-4">REST API: Social Account</h4>
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
}, SocialAccount);