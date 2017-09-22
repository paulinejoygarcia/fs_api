import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';

import Reports from '../imports/ui/Reports.jsx';
import Login from '../imports/ui/Login.jsx';
import Register from '../imports/ui/Register.jsx';

Meteor.startup(() => {
    render(<Reports />, document.getElementById('render-target'));
});