
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
//import { UsersSave } from '../../../api/users';
//import {showGritter} from '../../../api/classes/Utilities';
import {GRITTER_STATUS} from '../../../api/classes/Const';
import ReactFileReader from 'react-file-reader';
import {Avatar} from '../../../api/files';
import {UsersProfile} from '../../../api/users';
import '../../stylesheets/reports.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving:false,
            upload:false,
            src: (props.user && props.user.profile && props.user.profile.avatar)?props.user.profile.avatar:"#",
        };
        this.handleFiles = this.handleFiles.bind(this);
    }

    renderInfo(){
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <img src={this.state.src} className="mb10" />
                    <ReactFileReader className="mb10" base64={true} multipleFiles={false} handleFiles={this.handleFiles}>
                        <button style={{display:!this.state.saving?"block":"none"}} className='btn btn-primary mb10'>Browse</button>
                    </ReactFileReader>
                    <button disabled={!this.state.upload} className='btn btn-success mb10' onClick={this.uploadAvatar.bind(this)}>
                        {!this.state.saving?"Upload":<i className="fa fa-spin fa-circle-o-notch" />}
                    </button>
                </div>
            </div>
        );
    }
    handleFiles(files){
        if(files && files.base64)
            this.setState({src:files.base64,upload:true});
        else
            this.setState({
                src:(this.props.user && this.props.user.profile && this.props.user.profile.avatar)?
                    this.props.user.profile.avatar:
                    "#",
                upload:false
            });
    }
    uploadAvatar(){
        let uploadInstance = Avatar.insert({
            file: this.state.src,
            isBase64: true,
            fileName: Meteor.userId()+'.png',
            type: 'image/png'
        }, false);
        uploadInstance.on('start',()=>{
            //TODO show progress bar
            this.setState({saving:true});
            console.log("upload started");
        });
        uploadInstance.on('end',(error, fileObj)=>{
            if (error)
                console.log(error);
            Meteor.call(UsersProfile,fileObj,(err)=>{
                if(!err)
                    this.setState({saving:false});
            });
                //showGritter("Upload avatar",error.reason,GRITTER_STATUS.WARNING);
            //else
                //showGritter("Upload avatar","New avatar uploaded!",GRITTER_STATUS.SUCCESS);
            //TODO hide & reset progress bar
        });
        uploadInstance.start();
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">My Account Profile Picture</h4>
                </div>
                {this.renderInfo()}
            </div>
        );
    }
}

Profile.propTypes = {
};

export default createContainer(() => {
    return {
        user: Meteor.user()
    };
}, Profile);