
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import '../../stylesheets/dashboard';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    renderInfo(){
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Account Summary</h5>
                    <hr />
                    <h5 className="mb-4">Products</h5>
                    <hr />

                    <div className="row">
                        <div className="col-md-6 col-sm-6">
                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-print" />
                                </div>
                                <h5>Fax</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-comment-alt" />
                                </div>
                                <h5>SMS</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-image" />
                                </div>
                                <h5>MMS</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>

                        <div className="col-md-6 col-sm-6">
                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-notifications" />
                                </div>
                                <h5>Push Notification</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-videocam" />
                                </div>
                                <h5>Video</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-mic" />
                                </div>
                                <h5>Voice</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-share" />
                                </div>
                                <h5>Social Networks</h5>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    render() {
        console.log(this.props.user);
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">Dashboard</h4>
                </div>
                {this.renderInfo()}
            </div>
        );
    }
}

Dashboard.propTypes = {
};

export default createContainer(() => {
    return {
        user: Meteor.user()
    };
}, Dashboard);