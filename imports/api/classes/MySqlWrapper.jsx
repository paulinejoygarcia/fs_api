import mysql from 'mysql';
import npmFuture from 'fibers/future';

export default class MySqlWrapper {
    constructor(host = 'localhost', user = 'root', password = '', database = 'admin', port = 3306) {
        showStatus('Connecting to MySql Server... ip:`%s`', host || 'localhost');

        this.connection = mysql.createConnection({ host, user, password, database, port });
        this.connection.connect((err) => {
            if (err) {
                showError('Cannot connect to db server. err: `%s`', err.message);
                return;
            }
            showStatus('Successfully connected to db server. threadId: `%s`', this.connection.threadId);
        });
    }
    isConnected() {
        return this.connection && this.connection.threadId && (this.connection.state === 'connected' || this.connection.state === 'authenticated');
    }
    select(query, values = [], timeout = 40000) {
        if (this.isConnected()) {
            let future = new npmFuture();
            this.connection.query({ sql: query, timeout: timeout }, values,
                function (error, results, fields) {
                    if (error) {
                        showDebug('SQL ERROR: %s (%s) query: `%s`', error.sqlMessage, error.sqlState, query);
                        future.return(false);
                    } else {
                        future.return(results);
                    }
                }
            );
            return future.wait();
        }
        showWarning('Cannot use `%` db server is close.', 'SELECT');
        return null;
    }
    selectOne(query, values = [], timeout = 40000) {
        let result = this.select(query, values, timeout);
        if (result && result.length)
            return result[0];
        return null;
    }
    insert(table, values) {
        if (this.isConnected()) {
            let future = new npmFuture();
            let query = `INSERT INTO ${table} SET ?`;
            this.connection.query(query, values, function (error, results, fields) {
                if (error) {
                    showDebug('SQL ERROR: %s (%s) query: `%s`', error.sqlMessage, error.sqlState, query);
                    future.return(false);
                } else {
                    future.return(results.insertId);
                }
            });
            return future.wait();
        }
        showWarning('Cannot use `%` db server is close.', 'INSERT');
        return null;
    }
    update(table, values, where) {
        if (this.isConnected()) {
            let future = new npmFuture();
            let query = `UPDATE ${table} SET ?`;
            if (where) query += ` WHERE ${where}`;
            this.connection.query(query, values, function (error, results, fields) {
                if (error) {
                    showDebug('SQL ERROR: %s (%s) query: `%s`', error.sqlMessage, error.sqlState, query);
                    future.return(false);
                } else {
                    future.return(results.changedRows);
                }
            });
            return future.wait();
        }
        showWarning('Cannot use `%` db server is close.', 'UPDATE');
        return null;
    }
}