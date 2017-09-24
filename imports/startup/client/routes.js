import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Main from '../../ui/components/Main';
import ApiDoc from '../../ui/components/api/doc';
import NotFound from '../../ui/NotFound';

const customHistory = createBrowserHistory();
let handleLoginSession = (nextState, replace, next) => {
  if (!!Meteor.user()) {

  }
  next();
}
export default routes = (
  <Router history={customHistory}>
    <Switch>
      <Route path="/docs/api/rest/:section?" component={ApiDoc} />
      <Route path="/:component" component={Main} onEnter={handleLoginSession} />
      <Route path="/" component={Main} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);
