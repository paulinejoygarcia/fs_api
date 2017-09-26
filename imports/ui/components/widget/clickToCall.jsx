import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
var Twilio = require('twilio-js');

class ClickToCall extends Component {
    constructor(props) {
        super(props);
        this.state = {
            number:"",
            audio:true,
            microphone:true,
            start: false,
            ready: true,
        };
        this.device = null;
        Twilio.AccountSid = Meteor.settings.twilio.sid;
        Twilio.AuthToken  = Meteor.settings.twilio.token;
    }
    componentDidMount(){
        Twilio.CapabilityToken.create({
            allowIncoming: 'unique_identifier_for_this_user',
            allowOutgoing: 'your_application_sid',
        });
        // Twilio.Device.setup(this.props.token, {
        //     // sounds: {
        //     //     incoming: 'http://mysite.com/incoming.mp3',
        //     //     outgoing: 'http://mysite.com/outgoing.mp3',
        //     //     dtmf8: 'http://mysite.com/funny_noise.mp3'
        //     // }
        // });
        // Twilio.Device.ready((device)=>{
        //     this.device = device;
        //     this.setState({ready:true});
        //     console.log("WIDGET - Twilio.Device is now ready for connections");
        // });
    }
    dialNumber(str){
        this.setState({number:this.state.number+str});
    }
    goBack(){
        this.endCall();
        this.props.toggleWidget("ctc");
    }
    endCall(){
        //TODO end call
        this.setState({number:"",start:false,audio:true,microphone:true});
    }
    startCall(){
        let connected = false;
        Twilio.Call.create({to: "7314510880", from: "+18322401550", url: "https://eefd5765.ngrok.io/voice.php"}, function(err,res) {
            if(err)
                console.log(err);
            console.log('HOLY MOLY! PHONES ARE RINGING');
            this.setState({start:true});
        });
    }
    render() {
        let willShow = (this.props.isOpen) ? "" : "hidden";
        return (
            <div className={"ctcListBox_1 " + willShow}>
                <div className="ctcListBox_2">
                    <div className="ctcListBox_3">
                        Click to Call
                    </div>
                    <div className="ctcListBox_4">
                        <div className="ctcListBox_5" onClick={this.goBack.bind(this)}>
                            
                        </div>
                    </div>
                    <div className="ctcListBox_6" onClick={() => {
                        this.props.toggleWidget('close/open')
                    }}>
                        <div className="ctcListBox_7">
                            
                        </div>
                    </div>
                </div>
                <div className="ctcListBox_8">
                    {this.state.start?
                        <div className="ctcListBox_9">
                            <div className="gacListBox_10">
                                <div className="gacListBox_11">
                                    {this.state.number}
                                </div>
                            </div>
                            <div className="gacListBox_12">
                                <div className="gacListBox_13">
                                    <div onClick={this.dialNumber.bind(this,"1")} className="gacListBox_14">
                                        <div className="gacListBox_15">
                                            1
                                        </div>
                                        <div className="gacListBox_16">
                                            .
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"2")} className="gacListBox_17">
                                        <div className="gacListBox_18">
                                            2
                                        </div>
                                        <div className="gacListBox_19">
                                            ABC
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"3")} className="gacListBox_20">
                                        <div className="gacListBox_21">
                                            3
                                        </div>
                                        <div className="gacListBox_22">
                                            def
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"4")} className="gacListBox_23">
                                        <div className="gacListBox_24">
                                            4
                                        </div>
                                        <div className="gacListBox_25">
                                            ghi
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"5")} className="gacListBox_26">
                                        <div className="gacListBox_27">
                                            5
                                        </div>
                                        <div className="gacListBox_28">
                                            jkl
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"6")} className="gacListBox_29">
                                        <div className="gacListBox_30">
                                            6
                                        </div>
                                        <div className="gacListBox_31">
                                            mno
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"7")} className="gacListBox_32">
                                        <div className="gacListBox_33">
                                            7
                                        </div>
                                        <div className="gacListBox_34">
                                            pqrs
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"8")} className="gacListBox_35">
                                        <div className="gacListBox_36">
                                            8
                                        </div>
                                        <div className="gacListBox_37">
                                            tuvw
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"9")} className="gacListBox_38">
                                        <div className="gacListBox_39">
                                            9
                                        </div>
                                        <div className="gacListBox_40">
                                            xyz
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"*")} className="gacListBox_41">
                                        <div className="gacListBox_42">
                                            *
                                        </div>
                                        <div className="gacListBox_43">
                                            .
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"0")} className="gacListBox_44">
                                        <div className="gacListBox_45">
                                            0
                                        </div>
                                        <div className="gacListBox_46">
                                            +
                                        </div>
                                    </div>
                                    <div onClick={this.dialNumber.bind(this,"#")} className="gacListBox_47">
                                        <div className="gacListBox_48">
                                            #
                                        </div>
                                        <div className="gacListBox_49">
                                            .
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ctcListBox_12">
                                <div className="ctcListBox_13" onClick={()=>{
                                    this.setState({audio:!this.state.audio});
                                }}>
                                    {this.state.audio?
                                        <div className="ctcListBox_14" style={{display:this.state.audio?"flex":"none"}}>
                                            <div className="ctcListBox_15">
                                                
                                            </div>
                                            <div className="ctcListBox_16">
                                                Audio
                                            </div>
                                        </div>:
                                        <div className="ctcListBox_17">
                                            <div className="ctcListBox_18">
                                                
                                            </div>
                                            <div className="ctcListBox_19">
                                                Audio
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="ctcListBox_20" onClick={()=>{
                                    this.setState({microphone:!this.state.microphone});
                                }}>
                                    {this.state.microphone ?
                                        <div className="ctcListBox_21" style={{display:this.state.microphone?"flex":"none"}}>
                                            <div className="ctcListBox_22">
                                                
                                            </div>
                                            <div className="ctcListBox_23">
                                                Mute
                                            </div>
                                        </div> :
                                        <div className="ctcListBox_24">
                                            <div className="ctcListBox_25">
                                                
                                            </div>
                                            <div className="ctcListBox_26">
                                                Mute
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="ctcListBox_27" onClick={this.endCall.bind(this)}>
                                    <div className="ctcListBox_28">
                                        <div className="ctcListBox_29">
                                            
                                        </div>
                                        <div className="ctcListBox_30">
                                            End call
                                        </div>
                                    </div>
                                    <div className="ctcListBox_31">
                                        <div className="ctcListBox_32">
                                            
                                        </div>
                                        <div className="ctcListBox_33">
                                            End call
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>:
                        <div className="gacListBox_50">
                            <div className="ctcListBox_10">
                                <img src="/img/widget---10.svg" className="ctcListBoxImg_11" alt=''/>
                            </div>
                            {this.state.ready ?
                                <div onClick={this.startCall.bind(this)} className="gacListBox_51">
                                    Start a Call
                                </div> :
                                <div id="widgetBox_13">
                                    Can't start a call right now &nbsp; <i className="fa fa-spin fa-circle-o-notch" />
                                </div>
                            }
                        </div>
                    }
                </div>
                <div className="ctcListBox_34" onClick={() => {
                    this.setState({number:"",start:false,audio:true,microphone:true});
                    this.endCall();
                    this.props.toggleWidget('close/open')
                }}>
                    <div className="ctcListBox_35">
                        Close widget
                    </div>
                    <div className="ctcListBox_36">
                        <div className="ctcListBox_37">
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ClickToCall.propTypes = {
    toggleWidget: PropTypes.func,
    selected: PropTypes.object,
    token: PropTypes.object,
};

export default createContainer(() => {
    return {
    };
}, ClickToCall);