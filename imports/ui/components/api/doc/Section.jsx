
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { ROUTE_API_DOC } from '/imports/api/classes/Const';
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
import { Meteor } from 'meteor/meteor';

class Section extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let content = null;
        switch (this.props.route) {
            case ROUTE_API_DOC.APPLICATION:
                content = <Application />;
                break;
            case ROUTE_API_DOC.FAX:
                content = <Fax />;
                break;
            case ROUTE_API_DOC.MESSAGE.SMS:
                content = <MessageSms />;
                break;
            case ROUTE_API_DOC.MESSAGE.MMS:
                content = <MessageMms />;
                break;
            case ROUTE_API_DOC.NUMBER:
                content = <Number />;
                break;
            case ROUTE_API_DOC.PUSH:
                content = <PushNotification />;
                break;
            case ROUTE_API_DOC.SOCIAL.ACCOUNT:
                content = <SocialAccount />;
                break;
            case ROUTE_API_DOC.SOCIAL.COMMENT:
                content = <SocialComment />;
                break;
            case ROUTE_API_DOC.SOCIAL.POST:
                content = <SocialPost />;
                break;
            case ROUTE_API_DOC.VIDEO.CALL:
                content = <VideoCall />;
                break;
            case ROUTE_API_DOC.VIDEO.SCREENSHOT:
                content = <VideoScreenshot />;
                break;
            case ROUTE_API_DOC.VOICE:
                content = <VoiceCall />;
                break;


            case ROUTE_API_DOC.EXPLORER:
                content = <ApiExplorer />;
                break;

            default:
                content = <Intro />;
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