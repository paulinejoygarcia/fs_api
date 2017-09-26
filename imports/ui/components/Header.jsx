
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Header extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <nav className="site-navbar navbar fixed-top navbar-toggleable-sm navbar-inverse bg-red-500">
                <div className="navbar-header">
                    <a href="/" className="navbar-brand">
                        <span className="brand-icon">
                            <i className="fa fa-houzz" />
                        </span>
                        <span className="brand-name hidden-fold">uConnectIT</span>
                    </a>
                </div>
                <div className="collapse navbar-collapse">
                    <div className="navbar-nav mr-auto"></div>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <a href="#" className="nav-link">
                                <i className="zmdi zmdi-hc-lg zmdi-settings" />
                            </a>
                        </li>
                    </ul>
                </div>
            </nav >
        );
    }
}

Header.propTypes = {
};

export default createContainer(() => {
    return {
    };
}, Header);