import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';
import PropTypes from 'prop-types';

export default NotFound = (props) => {
    switch (props.type) {
        case 'BusinessRetired':
            return (
                <div className="notfoundpanel">
                    <h1>404</h1>
                    <h3>The Business page you are looking is suspended!</h3>
                    <h4>Please contact <a href="mailto:support@txtmeQuick.com">support@txtmeQuick.com</a> for further instructions.</h4>
                    <a href="/" className="btn btn-success" type="button"><i className="fa fa-location-arrow"/>&nbsp; Home</a>
                    <hr className="darken" />
                </div>
            );
        case 'BusinessNotFound':
            return (
                <div className="notfoundpanel">
                    <h1>404</h1>
                    <h3>The Business page you are looking is not valid!</h3>
                    <h4>The page you are looking for might have been removed, had its name changed,<br />or unavailable.</h4>
                    <a href="/" className="btn btn-success" type="button"><i className="fa fa-location-arrow"/>&nbsp; Home</a>
                    <hr className="darken" />
                </div>
            );
        case 'ComponentNotFound':
            return (
                <div className="notfoundpanel">
                    <h1>404</h1>
                    <h3>The page you are looking is not valid!</h3>
                    <h4>The page you are looking for might have been removed, had its name changed,<br />or unavailable.</h4>
                    <a href={props.route} className="btn btn-success" type="button"><i className="fa fa-location-arrow"/>&nbsp; Home</a>
                    <hr className="darken" />
                </div>
            );
        default:
            return (
                <div className="notfoundpanel">
                    <h1>404!</h1>
                    <h3>The page you are looking for has not been found!</h3>
                    <h4>The page you are looking for might have been removed, had its name changed,<br />or unavailable.</h4>
                    <a href="/" className="btn btn-success" type="button"><i className="fa fa-location-arrow"/>&nbsp; Home</a>
                    <hr className="darken" />
                </div>
            );
    }
}
