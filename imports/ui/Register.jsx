import React, { Component } from 'react';
import {UsersRegister} from '../api/users';
import './stylesheets/register.css';
export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
        };
    }
    onSubmit(e) {
        e.preventDefault();
        let email = this.email.value.trim(),
            password = this.password1.value.trim(),
            first = this.first.value.trim(),
            last = this.last.value.trim();
        if(password.length < 6)
            return Bert.alert( 'Password must be more than 5 characters long!', 'danger', 'growl-top-right');
        if(password !== this.password2.value.trim())
            return Bert.alert( 'Password must be matched!', 'danger', 'growl-top-right');
        if(email.length < 1 || first.length < 1 || last.length < 1)
            return Bert.alert( 'All fields are required!', 'danger', 'growl-top-right');
        this.setState({saving:true});
        Meteor.call(UsersRegister,{email, password, first, last}, (err) => {
            if (err)
                Bert.alert( err.reason, 'danger', 'growl-top-right');
            else {
                Bert.alert( 'New user registered! Redirecting to login page...', 'success', 'growl-top-right');
                this.email.value
                    = this.password1.value
                    = this.password2.value
                    = this.first.value
                    = this.last.value
                    = "";
                setTimeout(function(){
                    browserHistory.push('/');
                },3000);
            }
            this.setState({saving:false});
        });
    }
    render() {
        return (
            <div className="container">
                <div className="col-md-4 col-md-offset-4">
                    <div className="row">
                        <form className="form-horizontal form-width mt100" onSubmit={this.onSubmit.bind(this)}>
                            <div className="row form-row">
                                <div className="col-md-12 sign-up-header">Register to {this.props.title || "FS-API"}</div>
                                <div className="form-group col-md-6">
                                    <input type="text" ref={(e)=>{this.first = e;}} className="form-control" name="first" placeholder="First Name" />
                                </div>

                                <div className="form-group col-md-6">
                                    <input type="text" ref={(e)=>{this.last = e;}} className="form-control" name="last" placeholder="Last Name" />
                                </div>

                                <div className="form-group col-md-12">
                                    <input type="email" ref={(e)=>{this.email = e;}} className="form-control" name="email" placeholder="Email Address" />
                                </div>

                                <div className="form-group col-md-6">
                                    <input type="password" ref={(e)=>{this.password1 = e;}} className="form-control" name="password1" placeholder="Password" />
                                </div>
                                <div className="form-group col-md-6">
                                    <input type="password" ref={(e)=>{this.password2 = e;}} className="form-control" name="password2" placeholder="Confirm Password" />
                                </div>
                                <button disabled={this.state.saving} type="submit" className="btn btn-primary button-register">
                                    {this.state.saving?<i className="fa fa-spin fa-circle-o-notch" />:"Create Account"}
                                </button>
                            </div>
                        </form>
                        <a href="#" className="text-center new-account">Sign In Account</a>
                    </div>
                </div>
            </div>
        );
    }
}