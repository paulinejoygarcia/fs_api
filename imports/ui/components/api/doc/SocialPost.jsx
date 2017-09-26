
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { API_BASE } from '../../../../api/classes/Const';
import JSONPretty from 'react-json-pretty';

let post = {
    "success": true,
    "code": 200,
    "data": "Social post processed successfully",
    "error": ""
};

class SocialPost extends Component {
    renderDefinition() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <p className="mb-4 docs">An Social Post instance resource represents a post you have created using a social network account that you have connected with uConnectedIT. The supported social networks are: Facebook, Instagram, Linkedin, Pinterest and Twitter.</p>
                </div>
            </div>
        );
    }
    renderInstanceResource() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Social Post Instance Resource</h5>
                    <h6>Resource URI</h6>
                    <code>{API_BASE}{'{ACCOUNT_ID}/social/post/{SOCIAL_NETWORK'}</code>
                </div>
            </div>
        );
    }
    renderPost() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">HTTP POST</h5>
                    <p className="mb-4 docs">Create a Facebook Post</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/post/fb'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>status</th>
                                <td>The text content of your post.</td>
                            </tr>
                            <tr>
                                <th>image</th>
                                <td>The image to be included in your post.</td>
                            </tr>
                            <tr>
                                <th>link</th>
                                <td>The link to be included in your post.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Create an Instagram Post</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/ig'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>caption</th>
                                <td>The text content of your post.</td>
                            </tr>
                            <tr>
                                <th>image</th>
                                <td>The image to be included in your post.</td>
                            </tr>
                            <tr>
                                <th>video</th>
                                <td>The video to be included in your post.</td>
                            </tr>
                            <tr>
                                <th>cover_photo</th>
                                <td>The cover photo of the video in your post.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Create a LinkedIn Post</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/li'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>comment</th>
                                <td>The text content of your post.</td>
                            </tr>
                            <tr>
                                <th>title</th>
                                <td>The title of your post.</td>
                            </tr>
                            <tr>
                                <th>desc</th>
                                <td>The description of your post.</td>
                            </tr>
                            <tr>
                                <th>url</th>
                                <td>The URL to be linked in your post.</td>
                            </tr>
                            <tr>
                                <th>image_url</th>
                                <td>The image URL to be included in your post.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Create a Pinterest Board</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/pi'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>type</th>
                                <td>Should be equal to <code>board</code></td>
                            </tr>
                            <tr>
                                <th>name</th>
                                <td>The name of the board.</td>
                            </tr>
                            <tr>
                                <th>desc</th>
                                <td>The description of the board.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Create a Pinterest Pin</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/pi'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>type</th>
                                <td>Should be equal to <code>pin</code></td>
                            </tr>
                            <tr>
                                <th>board</th>
                                <td>The name of the board where this pin will be included.</td>
                            </tr>
                            <tr>
                                <th>note</th>
                                <td>The text content of the pin.</td>
                            </tr>
                            <tr>
                                <th>link</th>
                                <td>The URL to be linked in to the pin.</td>
                            </tr>
                            <tr>
                                <th>image</th>
                                <td>The image to be included in the pin.</td>
                            </tr>
                            <tr>
                                <th>image_url</th>
                                <td>The URL of the image to be linked in the pin.</td>
                            </tr>
                        </tbody>
                    </table><br /><hr />
                    <p className="mb-4 docs">Create a Twitter Post</p>
                    <code>POST {API_BASE}{'{ACCOUNT_ID}/social/account/tw'}</code><br /><br />
                    <h6>Request Parameters</h6>
                    <table className="table table-bordered table-hover table-responsive">
                        <tbody>
                            <tr>
                                <th>PARAMETER</th>
                                <th>DESCRIPTION</th>
                            </tr>
                            <tr>
                                <th>status</th>
                                <td>The text content of the post.</td>
                            </tr>
                            <tr>
                                <th>image</th>
                                <td>The image to be included in the post.</td>
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
                    <h4 className="mb-4">REST API: Social Post</h4>
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
}, SocialPost);