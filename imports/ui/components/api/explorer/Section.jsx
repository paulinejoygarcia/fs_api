
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { ROUTE_API_DOC } from '/imports/api/classes/Const';
import { Meteor } from 'meteor/meteor';
import Intro from './Intro';
import Application from './Application';
import Fax from './Fax';
import MessageSms from './MessageSms';
import MessageMms from './MessageMms';
import Number from './Number';
import PushNotification from './PushNotification';
import SocialAccount from './SocialAccount';
import SocialComment from './SocialComment';
import SocialPost from './SocialPost';
import VideoCall from './VideoCall';
import VideoScreenshot from './VideoScreenshot';
import VoiceCall from './VoiceCall';

class Section extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let content = null;
        console.log(this.props);
        switch (this.props.route) {
            case ROUTE_API_DOC.APPLICATION:
                content = <Application credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.FAX:
                content = <Fax credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.MESSAGE.SMS:
                content = <MessageSms credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.MESSAGE.MMS:
                content = <MessageMms credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.NUMBER:
                content = <Number credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.PUSH:
                content = <PushNotification credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.SOCIAL.ACCOUNT:
                content = <SocialAccount credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.SOCIAL.COMMENT:
                content = <SocialComment credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.SOCIAL.POST:
                content = <SocialPost credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.VIDEO.CALL:
                content = <VideoCall credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.VIDEO.SCREENSHOT:
                content = <VideoScreenshot credentials={this.props.credentials} />;
                break;
            case ROUTE_API_DOC.VOICE:
                content = <VoiceCall credentials={this.props.credentials} />;
                break;


            case ROUTE_API_DOC.EXPLORER:
                content = <ApiExplorer credentials={this.props.credentials} />;
                break;

            default:
                content = <Intro credentials={this.props.credentials} />;
        }
        return (
            <main className="site-main">
                <div className="site-content">
                    {content}
                </div>
            </main>
        );
    }
}

Section.propTypes = {
    route: PropTypes.string
};

export default createContainer((props) => {
    return {
    };
}, Section);