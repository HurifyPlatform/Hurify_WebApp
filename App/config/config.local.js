var path = require('path');

var config = require('./config.global');

config.env = 'local';

config.serverAPI = 'http://localhost:1800'

module.exports = config;
