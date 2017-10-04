
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import '../../stylesheets/dashboard';

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state ={
            showSecret: false
        };
    }
    renderInfo(){
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Account Summary</h5>
                    API KEY: {this.props.user?this.props.user.profile.api:""} <br />
                    API SECRET:&nbsp;
                    <button className="btn btn-default btn-sm" onClick={()=>{
                        this.setState({showSecret:!this.state.showSecret});
                    }}>
                        <i className="fa fa-eye" aria-hidden="true" />
                    </button>&nbsp;
                    {(this.props.user && this.state.showSecret)?this.props.user.profile.secret:""}
                    {(this.props.user && !this.state.showSecret)?"****************************":""}
                    <br />
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
                                    telephonic transmission of scanned printed material
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-comment-alt" />
                                </div>
                                <h5>SMS</h5>
                                <p>
                                    text messaging service
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-image" />
                                </div>
                                <h5>MMS</h5>
                                <p>
                                    send messages that include multimedia content
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
                                    message that pops up on a device
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-videocam" />
                                </div>
                                <h5>Video</h5>
                                <p>
                                    see and hear the person you're talking to on your device and lets them see and hear you
                                </p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-mic" />
                                </div>
                                <h5>Voice</h5>
                                <p>
                                    hear the person you're talking to on your device and lets them hear you</p>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-share" />
                                </div>
                                <h5>Social Networks</h5>
                                <p>
                                    use to build social networks or social relations with other people
                                </p>
                            </div>
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