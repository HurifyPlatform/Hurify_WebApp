require('sqreen');
var bodyParser = require("body-parser");
var express = require('express');
var namespace = require("./namespace");
ns = namespace.createNamespace();
var winston = require("winston");

var patchBlueBird = require('cls-bluebird');
patchBlueBird(ns);
var crypt = require('./crypt');
var configObj = require("./config");
var config = JSON.parse(crypt.decrypt(configObj.allConfigData));
console.log('\n\n\n');
console.log(config);
var app = express();

if (config.env === 'production') {
	app.use(function(req, res, next) {
		if((!req.secure) && (req.get('X-Forwarded-Proto') !== 'https')) {
			res.redirect('https://' + req.get('Host') + req.url);
		} else {
			next();
		}
	});
}

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
});
// var Ddos = require('ddos')
// var ddos = new Ddos({burst:10, limit:50})
// app.use(ddos.express);

app.use(function(res, req, next) {
	ns.bindEmitter(req);
	ns.bindEmitter(res);
	ns.run(function() {
		try {
			return next();
		} catch (err) {
			console.error(err);
			var result = {
				"success": false,
				"error": err,
				"requestId": ""
			};
			return res.json(result);
		}
	});
});

var orm = require("./orm").setup('./models', config.db, config.username, config.password, {
	host: config.dbhost,
	dialect: 'mysql',
	//logging: false,

	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
});

require("./CoreAPI").setup();

var apicall = require("./apicall");
var auth = require("./auth");

var jsonParser = bodyParser.json({
	limit: 1024 * 1024 * 2048,
	type: 'application/json'
});
var urlencodedParser = bodyParser.urlencoded({
	extended: true,
	limit: 1024 * 1024 * 2048,
	type: 'application/x-www-form-urlencoding'
});

app.use(jsonParser);
app.use(urlencodedParser);

app.use(express.static(require('path').join(__dirname, '/')));

app.use("/auth", auth);

app.use("/apicall", apicall);

app.use(logErrors);
app.use(errorHandler);

function logErrors(err, req, res, next) {
	winston.error("logging errors", err.stack);
}

function errorHandler(err, req, res, next) {
	winston.log("error handler", err);
}

var server = app.listen(config.port, function() {
	var host = server.address().address;
	var port = server.address().port;
	winston.log('info', 'Hurify API listening at http://%s:%s', host, port);
});

process.on('uncaughtException', function(err) {
	winston.log('Oh shit... recover somehow ??');
});

module.exports = server;
