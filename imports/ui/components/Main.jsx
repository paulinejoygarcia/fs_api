
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Header from './Header';
import Section from './Section';
import Menu from './Menu';
import '../stylesheets/main.scss';

class Main extends Component {
    constructor(props) {
        super(props);
    }
    render() {
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