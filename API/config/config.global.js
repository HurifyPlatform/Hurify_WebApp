var config = module.exports = {};

var winston = require('winston');
winston.transports.DailyRotateFile = require('winston-daily-rotate-file');

var transport = new (winston.transports.DailyRotateFile)({
	filename: '../logs/winston.log',
	datePattern: 'yyyy-MM-dd.',
	prepend: true,
	level: process.env.ENV === 'development' ? 'debug' : 'info'
});

var logger = new (winston.Logger)({
	transports: [ transport ]
});

config.logger = logger

config.logging = true;