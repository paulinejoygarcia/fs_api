// Server entry point, imports all server code
import Server from '/imports/api/classes/Server';
import '../imports/startup/server';
import '../imports/startup/both';
server = new Server();
server.onConnectMySQL();
server.connectFreeswitch();
server.connectSMPP();
server.connectSMTP();