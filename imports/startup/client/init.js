import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import routes from './routes';

Meteor.startup(function () {
    render(routes, document.getElementById('react-wrapper'));
    console.log("");
    console.log('Initializing browser setup...');
    console.log('Please report any issues or error found in this console to betasupport@txtmeQuick.com. Thank you!');
})