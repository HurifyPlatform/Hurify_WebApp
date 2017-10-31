const mysql = require('mysql')
const pool = mysql.createPool({
    host: 'dexterdb.cetqrhjlkynl.us-west-2.rds.amazonaws.com',
    port: '3306',
    user: 'root',
    password: 'Hiveypaas2017',
    database: 'paasmer',
    timezone: 'UTC'
})

module.exports = {
    getTestData: getTestData
}

function getTestData(callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.log(err)
            callback(true)
        }
        let query = "select temperature, timeStamp from plotly order by timeStamp asc limit 10"
        connection.query(query, (err, results) => {
            connection.release()
            if (err) {
                console.log(err)
                callback(true)
                return
            }
            callback(false, results)
        })
    })
}