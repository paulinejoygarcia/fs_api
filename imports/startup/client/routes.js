import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Main from '../../ui/components/Main';
import ApiDoc from '../../ui/components/api/doc';
import ApiExplorer from '../../ui/components/api/explorer';
import NotFound from '../../ui/NotFound';
import Reports from '../../ui/components/reports/Reports.jsx';

const customHistory = createBrowserHistory();
const unauthenticatedPages = [
    '/login',
    '/register',
    '/tools/api-explorer/',
    '/docs/api/rest/'
];
export const onAuthChange = (isAuthenticated) => {
    const pathname = customHistory.location.pathname;
    const isUnauthenticatedPage = () => {
        return unauthenticatedPages.find(p => {
            if (p.endsWith('/')) {
                let exact = (pathname == p) || (pathname == p.substring(0, p.length - 1));
                return exact || pathname.startsWith(p.substring(0, p.length - 1));
            } else {
                return pathname == p;
            }
        });
    };
    if (isUnauthenticatedPage() && isAuthenticated)
        customHistory.replace('/');
    else if (!isUnauthenticatedPage() && !isAuthenticated)
        customHistory.replace('/login');
};

export default routes = (
    <Router history={customHistory}>
        <Switch>
            <Route path="/tools/api-explorer/:section?" component={ApiExplorer}/>
            <Route path="/docs/api/rest/:section?" component={ApiDoc}/>
            <Route path="/:component" component={Main}/>
            <Route path="/" component={Main}/>
            <Route component={NotFound}/>
        </Switch>
    </Router>
);
