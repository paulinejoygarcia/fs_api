
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

class Dashboard extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                Hi i am dashboard!
           </div>
        );
    }
}

Dashboard.propTypes = {
};

export default createContainer(() => {
    return {
    };
}, Dashboard);