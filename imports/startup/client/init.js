import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import routes,{ onAuthChange} from './routes';

Meteor.startup(function () {
    document.title = Meteor.settings.public.config ? Meteor.settings.public.config.title : 'uConnectIT';
    Tracker.autorun(() => {
        const isAuthenticated = !!Meteor.userId();
        onAuthChange(isAuthenticated);
    });
    render(routes, document.getElementById('react-wrapper'));
})