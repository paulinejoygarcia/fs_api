
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
import React, { Component } from 'react';
import { ROUTE_API_DOC } from '/imports/api/classes/Const';
import { Meteor } from 'meteor/meteor';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selected: null
        };
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
        let menu = this.props.list.map((item, index) => {
            let href = '#';
            if (item.route && item.route.charAt(0) == '/') {
                href = item.route;
            }
            if (item.separator) {
                return (<li key={index} className="menu-separator"><hr /></li>);
            }
            return (
                <li key={index}>
                    <a href={href} className="submenu-toggle" onClick={(event) => {
                        if (item.route && item.route.charAt(0) != '/') {
                            this.props.history.push(item.route);
                            event.preventDefault();
                        } else if (!item.route) {
                            this.toggleSubMenu(item.name);
                        }
                    }}>
                        <i className={`menu-icon zmdi zmdi-hc-lg ${item.icon}`} />
                        <span className="menu-text">{item.name}</span>
                        {
                            item.subList && item.subList.length > 0 ?
                                <i className={`menu-caret zmdi zmdi-hc-sm ${item.name == this.state.selected ? 'zmdi-chevron-down' : 'zmdi-chevron-right'}`}></i>
                                :
                                ''
                        }
                    </a>
                    <ul className="submenu" style={{ display: item.name == this.state.selected ? 'block' : 'none', paddingLeft: '30px' }}>
                        <li className="menu-heading"><a href="javascript:void(0)">{item.name}</a></li>
                        {
                            item.subList && item.subList.map((subItem, index) => {
                                return (
                                    <li key={index}>
                                        <a href="#" onClick={(event) => { subItem.route ? this.props.history.replace(subItem.route) : null; event.preventDefault() }}
                                        >
                                            <i className={`menu-icon zmdi zmdi-hc-lg ${subItem.icon}`} />
                                            <span className="menu-text">{subItem.name}</span>
                                        </a>
                                    </li>
                                );
                            })
                        }
                    </ul>
                </li>
            );
        });
        return menu;
    }
    render() {
        return (
            <aside className="site-menubar">
                <div className="site-user">
                    <div className="media align-items-center">
                        <div className="media-body hidden-fold">
                            <h6 className="mborder-a-0">
                                <a href="javascript:void(0)" className="username">REST API</a>
                            </h6>
                        </div>
                    </div>
                </div>
                <div className="menu-container" ref={instance => { this.list = instance; }}>
                    <div className="site-menubar-inner">
                        <ul className="site-menu">
                            {this.renderMenuList()}
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
    };
}, Menu);