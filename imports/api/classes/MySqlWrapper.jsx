import mysql from 'mysql';
import npmFuture from 'fibers/future';

export default class MySqlWrapper {
    constructor(host, user, password, database, port = 3306) {
        const that = this;

        let fut = new npmFuture();

        showStatus('Connecting to MySql Server... ip:`%s`', host || 'localhost');

        let connection = mysql.createConnection({ host, user, password, database, port });
        connection.connect(function (err) {
            if (err) {
                showError('Cannot connect to db server. err: `%s`', err.message);
                fut.return(false);
                return;
            }

            showStatus('Successfully connected to db server. threadId: `%s`', connection.threadId);
            fut.return(true);
        });

        if (fut.wait()) {
            this.connection = connection;
        }
    }

    select(sql, values = [], timeout = 40000) {
        if (this.connection) {
            let fut = new npmFuture();
            this.connection.query({ sql, timeout }, values,
                function (error, results, fields) {
                    if (error) {
                        fut.return(false);
                    } else {
                        fut.return(results);
                    }
                }
            );

            return fut.wait();
        }
    }

    selectOne(sql, values = [], timeout = 40000) {
        let result = this.select(sql, values, timeout);
        if (result && result.length)
            return result[0];
    }

    insert(table, values) {
        if (this.connection) {
            let fut = new npmFuture();
            this.connection.query(`INSERT INTO ${table} SET ?`, values, function (error, results, fields) {
                if (error) {
                    fut.return(false);
                } else {
                    fut.return(results.insertId);
                }
            });
            return fut.wait();
        }
    }

    update(table, values, where) {
        if (this.connection) {
            let fut = new npmFuture();
            let sql = `UPDATE ${table} SET ?`;
            if (where) sql += ` WHERE ${where}`;
            this.connection.query(sql, values, function (error, results, fields) {
                if (error) {
                    fut.return(false);
                } else {
                    fut.return(results.changedRows);
                }
            });
            return fut.wait();
        }
    }
}