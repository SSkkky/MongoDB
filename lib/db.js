var mysql = require('mysql2');

const db_info = {
    host: 'localhost',
    user: 'root',
    password: 'gkrtod12!@',
    database: 'test2',
    port: '3306'
}

module.exports = {
    queryExecute: async (query) => {
        const connection = mysql.createConnection(db_info);
        connection.connect((err) => {
            console.log(err)
        });

        return await new Promise((resolve, reject) => {
            connection.query(query, function (error, results, fields) {
                resolve(results);
                connection.end();
            });
        })
    }
};
