
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import List from './List';
import VoiceList from './VoiceList';
import ClickToCall from './clickToCall';
import GetACall from './GetACall';
import ClickToDial from './ClickToDial';
import SNTC from './ShowNumberToCall';
import '../../stylesheets/widget.css';
class Widget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null,
            isOpenWidgetList: false,
            isOpenVoice: false,
            isOpenClickToCall: false,
            isOpenGetACall: false,
            isOpenSNTC: false,
        };
        this.toggleWidget = this.toggleWidget.bind(this);
        this.history = "list";
    }
    toggleWidget(cmd, history = "list"){
        console.log(cmd);
        switch(cmd){
            case 'close/open':
                this.setState({
                    isOpenWidgetList: !this.state.isOpenWidgetList,
                    isOpenVoice: false,
                    isOpenClickToCall: false,
                    isOpenGetACall: false,
                    isOpenSNTC: false,
                });
                break;
            case 'voice':
                this.history = "list";
                this.setState({
                    isOpenVoice: true
                });
                break;
            case 'ctc':
                this.history = history;
                this.setState({
                    isOpenClickToCall: !this.state.isOpenClickToCall
                });
                break;
            case 'gac':
                this.history = history;
                this.setState({
                    isOpenGetACall: true
                });
                break;
            case 'sntc':
                this.history = history;
                this.setState({
                    isOpenSNTC: true
                });
                break;

        }


    }
    render() {
        return (
            <div className="widget">
                <div className="widget-button">
                    <a onClick={() => {this.toggleWidget('close/open')}}>
                        <img src="/img/logo.png" alt='' />
                    </a>
                </div>
                <List isOpen={this.state.isOpenWidgetList} toggleWidget={this.toggleWidget}/>
                <VoiceList isOpen={this.state.isOpenVoice} toggleWidget={this.toggleWidget}/>
                <ClickToCall isOpen={this.state.isOpenClickToCall} selected={this.state.selected} toggleWidget={this.toggleWidget}/>
                <GetACall isOpen={this.state.isOpenGetACall} toggleWidget={this.toggleWidget}/>
                <SNTC isOpen={this.state.isOpenSNTC} toggleWidget={this.toggleWidget}/>
            </div>
        );
    }
}

Widget.propTypes = {
    history: PropTypes.object
};

export default createContainer(() => {
    return {
    };
}, Widget);