// Server entry point, imports all server code
import '/imports/api/pushNotifications';
import Server from '/imports/api/classes/Server';
import '/imports/startup/server';
import '/imports/startup/both';

server = new Server();