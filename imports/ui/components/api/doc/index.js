
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { ROUTE_API_DOC, ROUTE_API_MENU } from '../../../../api/classes/Const';
import Header from '../Header';
import Menu from '../Menu';
import Section from './Section';
import '../../../stylesheets/main.scss';
import '../../../stylesheets/api-docs.css';

class Main extends Component {
    constructor(props) {
        super(props);

        this.menuList = [
            {
                name: 'Using the API',
                route: '/docs/api/rest/',
                icon: 'zmdi-forward',
            },
            ...ROUTE_API_MENU,
            {
                separator: true
            },
            {
                name: 'API Explorer',
                route: '/tools/api-explorer',
                icon: 'zmdi-mail-send',
            },
        ];
    }
    render() {
        return (
            <div className="tc-wrapper">
                <Header />
                <div className="site-wrapper">
                    <Menu history={this.props.history} list={this.menuList} />
                    <Section route={this.props.match.params.section} />
                </div>
            </div>
        );
    }
}

Main.propTypes = {
};

export default createContainer((props) => {
    return {
        user: Meteor.user()
    };
}, Main);