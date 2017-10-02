
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import APILibrary from '../../../../api/classes/APILibrary';
import JSONPretty from 'react-json-pretty';

class Intro extends Component {
    constructor(props) {
        super(props);

        this.state = {
            accountId: '',
            apiKey: '',
            apiSecret: '',
            currentCredentials: null,
            response: null,
            error: null
        };

        this.submit = this.submit.bind(this);
        this.clearCredentials = this.clearCredentials.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
    }
    componentDidMount() {
        let apiCredentials = Session.get('API_CREDENTIALS');
        if (apiCredentials) {
            console.log(apiCredentials);
            if (apiCredentials.expiration > moment().valueOf()) {
                this.setState({ currentCredentials: apiCredentials });
            } else {
                Session.set('API_CREDENTIALS', null);
            }
        }
    }
    inputChanged(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    submit(e) {
        e.preventDefault();

        if (this.state.accountId && this.state.apiKey && this.state.apiSecret) {
            let lib = new APILibrary(this.state.apiKey, this.state.apiSecret, this.state.accountId, true);
            lib.init(result => {
                console.log(result);
                this.setState({ response: result });
                if (result && result.success) {
                    const creds = {
                        accountId: this.state.accountId,
                        apiKey: this.state.apiKey,
                        apiSecret: this.state.apiSecret,
                        accessCode: result.data.code,
                        expiration: moment().add(30, 'minutes').valueOf(),
                    };
                    this.setState({ currentCredentials: creds });
                    Session.set('API_CREDENTIALS', creds);
                }
            });
            this.setState({ error: '' });
        } else {
            this.setState({ error: 'All fields are required' });
        }
    }
    clearCredentials() {
        if (confirm('Are you sure you want to clear these API credentials?')) {
            this.setState({ currentCredentials: null });
            Session.set('API_CREDENTIALS', null);
        }
    }
    renderCurrentCredentials() {
        return CurrentApiCredentialsForm.call(this, this.state.currentCredentials);
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Current API Credentials</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Account ID</label>
                                <input name="accountId" value={this.state.currentCredentials.accountId} type="text" className="form-control input-sm" disabled />
                            </div>
                            <div className="form-group">
                                <label>API Key</label>
                                <input name="apiKey" value={this.state.currentCredentials.apiKey} type="text" className="form-control input-sm" disabled />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Access Code</label>
                                <input name="access_code" value={this.state.currentCredentials.accessCode} type="text" className="form-control input-sm" disabled />
                            </div>
                            <div className="form-group">
                                <label>API Secret</label>
                                <input name="apiSecret" value={this.state.currentCredentials.apiSecret} type="text" className="form-control input-sm" disabled />
                            </div>
                        </div>
                    </div>
                    <button onClick={this.clearCredentials} type="button" className="btn btn-danger">Clear API Credentials</button>
                </div>
            </div>
        );
    }
    renderAccessCodeForm() {
        return (
            <div className="col-md-6" style={{ float: 'left' }}>
                {this.state.error &&
                    <div className="alert mb-4 alert-danger">
                        <h6>Error!</h6><div>{this.state.error}</div>
                    </div>
                }
                <form onSubmit={this.submit}>
                    <div className="form-group">
                        <label>Account ID</label>
                        <input name="accountId" value={this.state.accountId} onChange={this.inputChanged} type="text" className="form-control" placeholder="Enter account ID" />
                    </div>
                    <div className="form-group">
                        <label>API Key</label>
                        <input name="apiKey" value={this.state.apiKey} onChange={this.inputChanged} type="text" className="form-control" placeholder="Enter API key" />
                    </div>
                    <div className="form-group">
                        <label>API Secret</label>
                        <input name="apiSecret" value={this.state.apiSecret} onChange={this.inputChanged} type="text" className="form-control" placeholder="Enter API secret" />
                    </div>
                    <button type="submit" className="btn btn-primary">Generate Access Code</button>
                </form>
            </div>
        );
    }
    renderAccessCode() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Access Code</h5>
                    <p className="mb-4 docs">Every API request should have an <code>access_code</code> parameter. Fill up the form below to generate one using your credentials.</p>
                    <div className="col-md-12">
                        {this.renderAccessCodeForm()}
                        <div className="col-md-6" style={{ float: 'right' }}>
                            <label>Response:</label>
                            {this.state.response && <JSONPretty json={this.state.response}></JSONPretty>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Using the API Explorer</h4>
                </div>
                {this.state.currentCredentials && this.renderCurrentCredentials()}
                {this.renderAccessCode()}
            </div>
        );
    }
}

export const CurrentApiCredentialsForm = function (creds = {}) {
    if (creds && creds.accountId) {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Current API Credentials</h5>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Account ID</label>
                                <input value={creds.accountId} type="text" className="form-control input-sm" disabled />
                            </div>
                            <div className="form-group">
                                <label>API Key</label>
                                <input value={creds.apiKey} type="text" className="form-control input-sm" disabled />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Access Code</label>
                                <input value={creds.accessCode} type="text" className="form-control input-sm" disabled />
                            </div>
                            <div className="form-group">
                                <label>API Secret</label>
                                <input value={creds.apiSecret} type="text" className="form-control input-sm" disabled />
                            </div>
                        </div>
                    </div>
                    {this.clearCredentials && <button onClick={this.clearCredentials} type="button" className="btn btn-danger">Clear API Credentials</button>}
                </div>
            </div>
        );
    }
    return <div />;
}

export default createContainer(() => {
    return {};
}, Intro);
