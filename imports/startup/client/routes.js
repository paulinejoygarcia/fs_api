import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router, Route, Switch} from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Main from '../../ui/components/Main';
import ApiDoc from '../../ui/components/api/doc';
import NotFound from '../../ui/NotFound';
import Reports from '../../ui/Reports.jsx';

const customHistory = createBrowserHistory();
const unauthenticatedPages = ['/login', '/register'];
export const onAuthChange = (isAuthenticated) => {
    const pathname = customHistory.location.pathname;
    const isUnauthenticatedPage = unauthenticatedPages.includes(pathname);
    if (isUnauthenticatedPage && isAuthenticated)
        customHistory.replace('/');
    else if (!isUnauthenticatedPage && !isAuthenticated)
        customHistory.replace('/login');
};

export default routes = (
  <Router history={customHistory}>
    <Switch>
      <Route path="/docs/api/rest/:section?" component={ApiDoc} />
      <Route path="/:component" component={Main} />
      <Route path="/" component={Main} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);
