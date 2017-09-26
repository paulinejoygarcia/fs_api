import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import Header from './Header';
import Section from './Section';
import Menu from './Menu';
import Login from './Login';
import Register from './Register';
import '../stylesheets/main.scss';

class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.match.params.component === "login") {
            return (
                <Login />
            );
        }
        if(this.props.match.params.component === "register"){
            return (
                <Register />
            );
        }
        // if(!this.props.user && this.props.match.params.component !== "register" && this.props.match.params.component !== "login")
        //     return (
        //         <div className="container">
        //             <div className="col-md-12 text-center">
        //                 <i className="fa fa-spin fa-circle-o-notch" /> Loading...
        //             </div>
        //         </div>
        //     );
        return (
            <div className="tc-wrapper">
                <Header />
                <div className="site-wrapper">
                    <Menu history={this.props.history} />
                    <Section route={this.props.match.params.component} />
                </div>
            </div>
        );
    }
}

Main.propTypes = {
};

export default createContainer(() => {
    return {
        user: Meteor.user()
    };
}, Main);