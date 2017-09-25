
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { UsersSave } from '../../../api/users';
import { UsersSavePassword } from '../../../api/users';
//import {showGritter} from '../../../api/classes/Utilities';
import {GRITTER_STATUS} from '../../../api/classes/Const';

class Info extends Component {

    constructor(props) {
        super(props);
        this.state = {
            saving:false
        }
    }
    componentDidMount(){
        this.firstName.value = this.props.user?this.props.user.profile.first:"";
        this.lastName.value = this.props.user?this.props.user.profile.last:"";
        this.email.value = this.props.user?this.props.user.emails[0].address:"";
        this.astpp.value = this.props.user?this.props.user.profile.astppId:"";
    }
    componentDidUpdate(){
        this.firstName.value = this.props.user?this.props.user.profile.first:"";
        this.lastName.value = this.props.user?this.props.user.profile.last:"";
        this.email.value = this.props.user?this.props.user.emails[0].address:"";
        this.astpp.value = this.props.user?this.props.user.profile.astppId:"";
    }
    saveInfo(e){
        e.preventDefault();
        if(this.firstName.value.trim() !== "" && this.lastName.value.trim()){
            this.setState({saving:true});
            Meteor.call(UsersSave,this.firstName.value.trim(),this.lastName.value.trim(),(err)=>{
                //if(err)
                    //showGritter('Saving Info', err.reason, GRITTER_STATUS.WARNING);
                //else
                    this.setState({saving:false});
                //showGritter('Saving Info', "Saving info successful!", GRITTER_STATUS.SUCCESS);
            });
        }
    }
    changePass(e){
        e.preventDefault();
        if(this.npass1.value.trim().length >= 6 && this.npass2.value.trim() === this.npass1.value.trim()){
            this.setState({saving:true});
            Meteor.call(UsersSavePassword,this.npass1.value.trim(),(err)=>{
                //if(err)
                //showGritter('Changing Password', err.reason, GRITTER_STATUS.WARNING);
                //else
                this.setState({saving:false});
                this.npass1.value = "";
                this.npass2.value = "";
                //showGritter('Changing Password', "Saving info successful!", GRITTER_STATUS.SUCCESS);
            });
        }
        //else
        //showGritter('Changing Password', "Password must matched and  have more than 5 characters.", GRITTER_STATUS.WARNING);
    }
    renderInfo(){
        return (
            <div className="col-md-12">
                <div className="widget p-4">
                    <h5 className="mb-4">Personal</h5>
                    <form className="mb-4" onSubmit={this.saveInfo.bind(this)}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" placeholder="First Name" className="form-control" ref={(e)=>{ this.firstName = e;}} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" placeholder="Last Name" className="form-control" ref={(e)=>{ this.lastName = e;}} />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" disabled readOnly placeholder="Email" className="form-control" ref={(e)=>{ this.email = e;}} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="text" disabled readOnly placeholder="ASTPP ID" className="form-control" ref={(e)=>{ this.astpp = e;}} />
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={this.state.saving} className="btn btn-warning">
                            {this.state.saving?<i className="fa fa-spin fa-circle-o-notch" />:"Save"}
                        </button>
                    </form>
                    <hr />
                    <h5 className="mb-4">Personal</h5>
                    <form className="mb-4" onSubmit={this.changePass.bind(this)}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="password" placeholder="Password" className="form-control" ref={(e)=>{ this.npass1 = e;}} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <input type="password" placeholder="Confirm Password" className="form-control" ref={(e)=>{ this.npass2 = e;}} />
                                </div>
                            </div>
                        </div>
                        <button type="submit" disabled={this.state.saving} className="btn btn-warning">
                            {this.state.saving?<i className="fa fa-spin fa-circle-o-notch" />:"Change Password"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }
    render() {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h4 className="mb-4">My Account Information</h4>
                </div>
                {this.renderInfo()}
            </div>
        );
    }
}

Info.propTypes = {
};

export default createContainer(() => {
    return {
        user: Meteor.user()
    };
}, Info);