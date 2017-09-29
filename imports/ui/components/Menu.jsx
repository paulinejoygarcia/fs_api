import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { ROUTE_COMPONENT } from '../../api/classes/Const';
import { Avatar } from '../../api/files';
import { Meteor } from 'meteor/meteor';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        };
        this.menuList = [
            {
                name: 'Dashboard',
                route: ROUTE_COMPONENT.DASHBOARD,
                icon: 'zmdi-view-dashboard',
                subList: []
            },
            {
                name: 'Accounts',
                route: null,
                icon: 'zmdi-account-circle',
                subList: [
                    {
                        name: 'Information', route: ROUTE_COMPONENT.ACCOUNT.INFO
                    },
                    {
                        name: 'Profile', route: ROUTE_COMPONENT.ACCOUNT.PROFILE
                    },
                    {
                        name: 'Billing', route: ROUTE_COMPONENT.ACCOUNT.BILLING
                    },
                    {
                        name: 'Invoices', route: ROUTE_COMPONENT.ACCOUNT.INVOICE
                    }
                ]
            },
            {
                name: 'Reports',
                route: ROUTE_COMPONENT.REPORTS,
                icon: 'zmdi-file-text',
                subList: []
            },
        ];
    }

    componentDidMount() {
        $(this.list).mCustomScrollbar({ theme: "dark-thick" });
    }

    toggleSubMenu(name) {
        if (this.state.selected === name)
            this.setState({ selected: null });
        else
            this.setState({ selected: name });
    }

    renderMenuList() {
        return this.menuList.map((item, index) => {
            return (
                <li key={index}>
                    <a href="#" className="submenu-toggle" onClick={(event) => {
                        item.route ? this.props.history.replace(item.route) : this.toggleSubMenu(item.name);
                        event.preventDefault()
                    }}>
                        <i className={`menu-icon zmdi zmdi-hc-lg ${item.icon}`}/>
                        <span className="menu-text">{item.name}</span>
                        {
                            item.subList.length > 0 ?
                                <i className={`menu-caret zmdi zmdi-hc-sm ${item.name == this.state.selected ? 'zmdi-chevron-down' : 'zmdi-chevron-right'}`}></i>
                                :
                                ''
                        }
                    </a>
                    <ul className="submenu" style={{ display: item.name == this.state.selected ? 'block' : 'none' }}>
                        <li className="menu-heading"><a href="javascript:void(0)">{item.name}</a></li>
                        {
                            item.subList.map((subItem, index) => {
                                return (
                                    <li key={index}>
                                        <a href="#" onClick={(event) => {
                                            subItem.route ? this.props.history.replace(subItem.route) : null;
                                            event.preventDefault()
                                        }}
                                        >{subItem.name}
                                        </a>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </li>
            );
        });
    }

    render() {
        return (
            <aside className="site-menubar">
                <div className="site-user">
                    <div className="media align-items-center">
                        <a href="javascript:void(0)">
                            <img className="avatar avatar-circle"
                                 src={(this.props.user && this.props.user.profile.avatar) ? this.props.user.profile.avatar : "img/default.png"}
                                 alt="avatar"/>
                        </a>
                        <div className="media-body hidden-fold">
                            <h6 className="mborder-a-0">
                                <a href="javascript:void(0)"
                                   className="username">{this.props.user ? this.props.user.profile.first + " " + this.props.user.profile.last : ""}</a>
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="menu-container" ref={instance => {
                    this.list = instance;
                }}>
                    <div className="site-menubar-inner">
                        <ul className="site-menu">
                            {this.renderMenuList()}
                            <li>
                                <a href="#" onClick={() => {
                                    Meteor.logout((err, data) => {
                                        console.log("err", err, data);
                                    });
                                }}>
                                    <i className="menu-icon zmdi zmdi-hc-lg zmdi-lock-outline"/>
                                    <span className="menu-text">Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </aside>
        );
    }
}

Menu.propTypes = {
    history: PropTypes.object
};

export default createContainer(() => {
    return {
        user: Meteor.user()
    };
}, Menu);