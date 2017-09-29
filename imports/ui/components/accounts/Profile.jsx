import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import Util from '../../../api/classes/Utilities';
import { GRITTER_STATUS } from '../../../api/classes/Const';
import { UsersProfile } from '../../../api/users';
import '../../stylesheets/reports.css';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
            upload: false,
            uploading: false,
            src: null,
            toUpload: null,
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.avatar !== this.props.avatar)
            this.setState({ src: this.props.avatar });
    }

    renderInfo() {
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <img src={this.state.src} className="mb10"
                         style={{ width: "100px", height: "100px", borderRadius: "50%" }}/>
                    <br />
                    <label className="mb10 btn btn-primary">
                        {(!this.state.uploading) ? ("Browse") : "Uploading..."}
                        <input type="file" style={{ display: "none" }} disabled={this.state.uploading}
                               onChange={this.uploadFile.bind(this)}/>
                    </label>
                </div>
            </div>
        );
    }

    uploadFile(event) {
        let that = this;
        this.setState({ uploading: true });
        Util.encodeImageFileAsURL(event, function (result) {
            if (result) {
                Util.showGritter("Upload avatar", "New avatar uploaded!", GRITTER_STATUS.SUCCESS);
                Meteor.call(UsersProfile, result);
                that.setState({ uploading: false, src: result });
            }
        })
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
        avatar: (Meteor.user() && Meteor.user().profile.avatar) ? Meteor.user().profile.avatar : "/img/default.png"
    };
}, Profile);