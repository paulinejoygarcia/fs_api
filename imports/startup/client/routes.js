import React from 'react';
import { Meteor } from 'meteor/meteor';
import { Router, Route, Switch } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import Main from '../../ui/components/Main';
import NotFound from '../../ui/NotFound';
import Welcome from '../../ui/Welcome';

const customHistory = createBrowserHistory();
let handleLoginSession = (nextState, replace, next) => {
  console.log(nextState, replace);
  if (!!Meteor.user()) {

  }
  next();
}
export default routes = (
  <Router history={customHistory}>
    <Switch>
      <Route exact path="/" component={Welcome} />
      <Route path="/:route/:component" component={Main} onEnter={handleLoginSession} />
      <Route path="/:route/" component={Main} />
	  <Route path="/login/" component={Main} />
	  <Route path="/register/" component={Main} />
      <Route component={NotFound} />
    </Switch>
  </Router>
);
