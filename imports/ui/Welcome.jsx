import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';
import ReactDOM from 'react-dom';
import { createContainer } from 'meteor/react-meteor-data';

class Welcome extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="notfoundpanel">
                <h3>Welcome to txtConsole! <small>make your business numbers SMART</small></h3>
                <hr className="darken" />
            </div>
        );
    }
}

Welcome.propTypes = {
};

export default createContainer(() => {
    return {

    };
}, Welcome);