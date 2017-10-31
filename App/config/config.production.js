var path = require('path');

var config = require('./config.global');

config.env = 'production';

config.serverAPI = 'https://platform.hurify.co:1800'

module.exports = config;
