import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Util from '../../../api/classes/Utilities';
import { GRITTER_STATUS } from '../../../api/classes/Const';
import ReactFileReader from 'react-file-reader';
import { Avatar } from '../../../api/files';
import { UsersProfile } from '../../../api/users';
import '../../stylesheets/reports.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            upload: false,
            src: (props.avatar instanceof Object) ? Avatar.link(props.avatar) : props.avatar,
            toUpload: null,
        };
        this.handleFiles = this.handleFiles.bind(this);
    }

    componentDidUpdate(prevProps) {
        console.log(this.props.avatar);
        if (prevProps.avatar !== this.props.avatar)
            this.setState({ src: (this.props.avatar instanceof Object) ? Avatar.link(this.props.avatar) : this.props.avatar });
    }

    renderInfo() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <img src={this.state.src} className="mb10"/>
                    <ReactFileReader className="mb10" base64={true} multipleFiles={false}
                                     handleFiles={this.handleFiles}>
                        <button style={{ display: !this.state.saving ? "block" : "none" }}
                                className='btn btn-primary mb10'>Browse
                        </button>
                    </ReactFileReader>
                    <button disabled={!this.state.upload} className='btn btn-success mb10'
                            onClick={this.uploadAvatar.bind(this)}>
                        {!this.state.saving ? "Upload" : <i className="fa fa-spin fa-circle-o-notch"/>}
                    </button>
                </div>
            </div>
        );
    }

    handleFiles(files) {
        if (files && files.fileList[0])
            this.setState({ toUpload: files.fileList[0], src: files.base64, upload: true });
        else
            this.setState({
                src: (this.props.avatar instanceof Object) ? Avatar.link(this.props.avatar) : this.props.avatar,
                upload: false,
                toUpload: null,
            });
    }

    uploadAvatar() {
        let uploadInstance = Avatar.insert({
            file: this.state.toUpload,
            streams: 'dynamic',
            chunkSize: 'dynamic'
        }, false);
        uploadInstance.on('start', () => {
            this.setState({ saving: true, upload: false });
        });
        uploadInstance.on('end', (error, fileObj) => {
            this.setState({
                saving: false,
                toUpload: null,
                src: (this.props.avatar instanceof Object) ? Avatar.link(this.props.avatar) : this.props.avatar,
                upload: false
            });
            if (error)
                return Util.showGritter("Upload avatar", error.reason, GRITTER_STATUS.WARNING);
            else
                Util.showGritter("Upload avatar", "New avatar uploaded!", GRITTER_STATUS.SUCCESS);
            Meteor.call(UsersProfile, fileObj);
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

Profile.propTypes = {};

export default createContainer(() => {
    return {
        user: Meteor.user(),
        avatar: (Meteor.user() && Meteor.user().profile.avatar)? Meteor.user().profile.avatar : "/img/default.png"
    };
}, Profile);