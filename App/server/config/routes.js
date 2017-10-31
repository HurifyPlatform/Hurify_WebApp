'use strict'
let controller = require('./../controllers/controller')

module.exports = function(app) {
    app.get('/api/test/', controller.getTestData)
}