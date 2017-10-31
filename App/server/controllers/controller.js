'use strict'
var db = require('./../config/database.js')

module.exports = {
    getTestData: getTestData
}

function getTestData(req, res) {
    db.getTestData((err, results) => {
        if (err) {
            console.log(err)
            return res.json({
                success: false
            })
        }
        return res.json({
            success: true,
            data: results
        })
    })
}