var path = require('path');

var config = require('./config.global');

config.env = 'production';
config.dbhost = "dexterdb.cetqrhjlkynl.us-west-2.rds.amazonaws.com";
config.username = "root";
config.password = "MoboproDB2018";
config.db = "hurify";
config.logging = true;
config.port = 1800;

config.aws_access_key_id = '';
config.aws_secret_access_key = '';
config.aws_region = ''

config.oauth_client_Id = '821532206562-mqna1s7l8b2enmgc1fvbceltv26pqgvo.apps.googleusercontent.com';
config.oauth_client_secret = 'vW918isTjtErmVNg8OzN8Xqk';
config.oauth_refresh_token = '1/Glyw8QPmAr9i0ZIX8jnFaE7e-j4OefURw-o1kjqowX0';

config.email = 'accounts@hurify.co';
config.name_and_email = 'Accounts <accounts@hurify.co>';


config.googleEmail = 'hello@hurify.co';
config.googlePassword = 'admin@hurify654';

config.recaptcha_siteKey = '';
config.recaptcha_secretKey = '';

module.exports = config;
