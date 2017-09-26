import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import routes from './routes';

Meteor.startup(function () {
    document.title = Meteor.settings.public.config ? Meteor.settings.public.config.title : 'uConnectIT';
    render(routes, document.getElementById('react-wrapper'));
})