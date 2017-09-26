
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { ROUTE_API_DOC } from '../../../../api/classes/Const';
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
            {
                name: 'Application',
                route: ROUTE_API_DOC.APPLICATION,
                icon: 'zmdi-font',
            },
            {
                name: 'Fax',
                route: ROUTE_API_DOC.FAX,
                icon: 'zmdi-print',
            },
            {
                name: 'Message',
                route: null,
                icon: 'zmdi-email',
                subList: [
                    {
                        name: 'SMS',
                        route: ROUTE_API_DOC.MESSAGE.SMS,
                        icon: 'zmdi-comment-alt',
                    },
                    {
                        name: 'MMS',
                        route: ROUTE_API_DOC.MESSAGE.MMS,
                        icon: 'zmdi-image',
                    }
                ]
            },
            {
                name: 'Number',
                route: ROUTE_API_DOC.NUMBER,
                icon: 'zmdi-smartphone-iphone',
            },
            {
                name: 'Push Notification',
                route: ROUTE_API_DOC.PUSH,
                icon: 'zmdi-notifications',
            },
            {
                name: 'Social',
                route: null,
                icon: 'zmdi-share',
                subList: [
                    {
                        name: 'Account',
                        route: ROUTE_API_DOC.SOCIAL.ACCOUNT,
                        icon: 'zmdi-account-circle',
                    },
                    {
                        name: 'Comment',
                        route: ROUTE_API_DOC.SOCIAL.COMMENT,
                        icon: 'zmdi-comment',
                    },
                    {
                        name: 'Post',
                        route: ROUTE_API_DOC.SOCIAL.POST,
                        icon: 'zmdi-edit',
                    }
                ]
            },
            {
                name: 'Video',
                route: null,
                icon: 'zmdi-videocam',
                subList: [
                    {
                        name: 'Call',
                        route: ROUTE_API_DOC.VIDEO.CALL,
                        icon: 'zmdi-phone',
                    },
                    {
                        name: 'Screenshot',
                        route: ROUTE_API_DOC.VIDEO.SCREENSHOT,
                        icon: 'zmdi-camera-alt',
                    }
                ]
            },
            {
                name: 'Voice',
                route: ROUTE_API_DOC.VOICE,
                icon: 'zmdi-mic',
            },
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
                    <Menu history={this.props.history} list={this.menuList}/>
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