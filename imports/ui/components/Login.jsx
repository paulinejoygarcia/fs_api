import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import '../stylesheets/login.css';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            saving: false,
        };
    }

    onSubmit(e) {
        e.preventDefault();
        let email = this.email.value.trim(),
            password = this.password.value.trim();
        this.setState({ saving: true });
        Meteor.loginWithPassword(email, password, (err) => {
            if (err)
                Bert.alert(err.reason, 'danger', 'growl-top-right');
            else
                this.email.value = this.password.value = "";
            this.setState({ saving: false });
        });
    }

    render() {
        return (
            <div className="container">
                <div className="row">
                    <div className="col-sm-6 col-md-4 col-md-offset-4">
                        <h1 className="text-center login-title mt100 mb10">Sign In
                            to {this.props.title || "UConnectedIt"}</h1>
                        <div className="border-t-1 account-wall">
                            <img className="profile-img"
                                 src="https://lh5.googleusercontent.com/-b0-k99FZlyE/AAAAAAAAAAI/AAAAAAAAAAA/eu7opA4byxI/photo.jpg?sz=120"
                                 alt=""/>
                            <form className="form-signin" onSubmit={this.onSubmit.bind(this)}>
                                <input type="text" ref={(e) => {
                                    this.email = e;
                                }} className="form-control" placeholder="Email" required/>
                                <input type="password" ref={(e) => {
                                    this.password = e;
                                }} className="form-control" placeholder="Password" required/>
                                <button className="btn btn-lg bg-red-500 text-white btn-block" disabled={this.state.saving}
                                        type="submit">
                                    {this.state.saving ? <i className="fa fa-spin fa-circle-o-notch"/> : "Sign In"}
                                </button>
                            </form>
                        </div>
                        <a href="/register" className="fz-lg text-center new-account">Create an account </a>
                    </div>
                </div>
            </div>
        );
    }
}