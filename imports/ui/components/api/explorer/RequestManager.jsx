
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import APILibrary from '../../../../api/classes/APILibrary';
import Util from '../../../../api/classes/Utilities';
import JSONPretty from 'react-json-pretty';

class RequestManager extends Component {
    constructor(props) {
        super(props);

        this.state = {
            json: '',
            response: {},
            error: null,
            isProcessing: false
        };

        this.submit = this.submit.bind(this);
        this.inputChanged = this.inputChanged.bind(this);
        this.fileChanged = this.fileChanged.bind(this);
    }
    inputChanged(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    fileChanged(e) {
        this.setState({ [e.target.name]: e.target.multiple ? e.target.files : e.target.files[0] });
    }
    submit(e) {
        e.preventDefault();

        const that = this;
        this.setState({ isProcessing: true, response: {} });
        if (this.props.credentials) {
            this.lib = new APILibrary(this.props.credentials.apiKey, this.props.credentials.apiSecret, this.props.credentials.accountId, true);
            this.lib.setAccessCode(this.props.credentials.accessCode);
            this.json = Util.tryParseJSON(this.state.json);

            if (this.props.files) {
                let hasError = false;
                this.props.files.forEach((file) => {
                    if (file.required && !this.state[file.name]) {
                        this.setState({ error: `${file.label} field is required` });
                        hasError = true;
                    }
                });
                if (hasError)
                    return;
            }

            if (this.props.idRequired && !this.json) {
                this.setState({ error: 'ID is required' });
                return;
            }

            if (this.props.jsonRequired && !this.json) {
                this.setState({ error: 'Invalid JSON' });
                return;
            }

            this.props.submit.call(this);
            this.setState({ error: '' });
        } else {
            this.setState({ error: 'No API Credentials found.' });
        }
    }
    renderForm() {
        let fileInputs = [];
        if (this.props.files) {
            this.props.files.forEach((file, i) => {
                fileInputs.push(
                    <div key={i} className="form-group">
                        <label>{file.label}</label>
                        <input name={file.name} onChange={this.fileChanged} accept={file.accept || '*'} multiple={file.multiple} type="file" className="form-control-file input-sm" />
                    </div>
                );
            });
        }
        return (
            <div className="col-md-12">
                {this.state.error &&
                    <div className="alert mb-4 alert-danger">
                        <h6>Error!</h6><div>{this.state.error}</div>
                    </div>
                }
                <form onSubmit={this.submit}>
                    <div className="row">
                        <div className="col-md-6">
                            {(this.props.hasId || this.props.idRequired) &&
                                <div className="form-group">
                                    <label>Record ID</label>
                                    <input name="id" value={this.state.id} onChange={this.inputChanged} type="text" className="form-control input-sm" placeholder="Enter record ID" />
                                </div>
                            }
                            {fileInputs}
                            {this.props.jsonRequired &&
                                <div className="form-group">
                                    <label>Request Parameters</label>
                                    <textarea name="json" value={this.state.json} onChange={this.inputChanged} className="form-control" placeholder="Enter valid JSON Object"></textarea>
                                </div>
                            }
                            <button type="submit" className="btn btn-primary" disabled={this.state.isProcessing}>Try it now</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    {this.renderForm()}
                </div>
                <div className="col-md-12">
                    <hr />
                    <label>Response:</label>
                    <JSONPretty json={this.state.response}></JSONPretty>
                </div>
            </div>
        );
    }
}

export default createContainer(() => {
    return {};
}, RequestManager);