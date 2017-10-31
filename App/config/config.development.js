var path = require('path');

var config = require('./config.global');

config.env = 'development';

config.serverAPI = 'https://platform.hurify.co:1800'

module.exports = config;
