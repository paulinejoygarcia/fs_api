import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
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
    componentDidUpdate(){
        console.log(this.props.user);
    }
    render() {
        // if (!this.props.user && typeof this.props.match.params.component === "undefined") {
        //     return (
        //         <Login />
        //     );
        // }
        //if(!this.props.user && this.props.match.params.component === "register"){
        if(this.props.match.params.component === "register"){
            return (
                <Register />
            );
        }
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
    console.log("meteor user",Meteor.user());
    return {
        user: Meteor.user()
    };
}, Main);