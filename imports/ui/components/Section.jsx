
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { ROUTE_COMPONENT } from '../../api/classes/Const';
import Dashboard from './dashboard/Dashboard';
import Reports from './reports/Reports';
import Info from './accounts/Info';
import Profile from './accounts/Profile';
import Billing from './billing/Billing';
import Invoice from './billing/Invoice';
import { Meteor } from 'meteor/meteor';

class Section extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let content = null;
        switch (this.props.route) {
            case ROUTE_COMPONENT.DASHBOARD:
                content = <Dashboard />;
                break;
            case ROUTE_COMPONENT.ACCOUNT.INFO:
                content = <Info />;
                break;
            case ROUTE_COMPONENT.ACCOUNT.PROFILE:
                content = <Profile />;
                break;
            case ROUTE_COMPONENT.REPORTS:
                content = <Reports />;
                break;
            case ROUTE_COMPONENT.ACCOUNT.BILLING:
                content = <Billing />;
                break;
            case ROUTE_COMPONENT.ACCOUNT.INVOICE:
                content = <Invoice />;
                break;
        }
        return (
            <main className="site-main">
                <div className="site-content">
                    {content}
                </div>
            </main>
        );
    }
}

Section.propTypes = {
    route: PropTypes.string
};

export default createContainer(() => {
    return {
    };
}, Section);