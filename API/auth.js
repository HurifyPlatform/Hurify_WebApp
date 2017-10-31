var coreapi = require("./CoreAPI");
const express = require("express");
var bodyParser = require("body-parser");
var namespace = require("./namespace");
var router = express.Router();
var user = {}
var Promise = require("bluebird");
var crypto = require('crypto');
var path = require('path')
require('es6-promise').polyfill();
require('isomorphic-fetch');
var fs      = require('fs');

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const fileUpload = require('express-fileupload');
router.use(fileUpload());

var requestId = "";

function sendError(res, err, requestId) {
    var result = {
        "success": false,
        "error": err,
        "requestId": requestId
    };
    return coreapi.updateRequest("false", requestId, JSON.stringify(err)).then(function(updated) {
        return res.json(result);
    }).catch(function(err) {
        return res.json(err);
    });
}

function sendSuccess(res, result, requestId) {
    var finalResult = {
        "success": true,
        "data": result,
        "requestId": requestId
    };
    return coreapi.updateRequest("true", requestId, "none").then(function(updated) {
        return res.json(finalResult);
    }).catch(function(err) {
        return res.json(err);
    });
}

router.use(function timeLog(req, res, next) {
    console.log(req.body)
    try {
        req.body["token"] = "no_token_required_in_authentication_section";
        return coreapi.addNewRequest(req.body, req.originalUrl).then(function(result) {
            requestId = result.requestId;
            next();
        }).catch(function(err) {
            console.log('error timeLog')
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/uploadprofilephoto', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    let file = req.files.file;
    let filename = crypto.randomBytes(20).toString('hex');
    let extname = path.extname(file.name);
    file.mv('uploads/' + filename + extname, function(err, result) {
        if (err) {
            return res.status(500).send(err);
        }
        res.send({
            success: true
        });
    });
});

router.post('/uploadprofilephoto1', function(req, res) {
    if (!req.body.data || req.body.data == "" || req.body.data == null)
        return res.status(400).send('No files were uploaded.');
    let filename = crypto.randomBytes(20).toString('hex');
    let extname = req.body.extn;

    var data = req.body.data,
    base64Data,
	binaryData;

	base64Data  =   data.replace(/^data:image\/png;base64,/, "");
	base64Data  +=  base64Data.replace('+', ' ');
	binaryData  =   new Buffer(base64Data, 'base64').toString('binary');

	fs.writeFile('uploads/' + filename + '.' + extname, binaryData, "binary", function (err) {
	    if (err) {
            return res.status(500).send(err);
        }
        return res.send({
            success: true
        });
	});
});

router.post('/signup', function(req, res) {
    try {
        var data = req.body;
        return coreapi.createAccount(data, req).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.get('/confirmregistration/:emailConfirmationToken', function(req, res) {
    try {
        let emailConfirmationToken = req.params.emailConfirmationToken;
        return coreapi.confirmRegistration(emailConfirmationToken).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/login', function(req, res) {
    try {
        return coreapi.loginAuthenticate(req.body).then(function(result) {
            user = result;
            namespace.set("user", user);
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
          console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/sendconfirmationagain', function(req, res) {
    try {
        return coreapi.sendConfirmationAgain(req.body.emailId, req).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/forgotpassword', function(req, res) {
    try {
        return coreapi.forgotPassword(req.body.email).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updateforgotpassword', function(req, res) {
    try {
        return coreapi.updateForgotPassword(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

module.exports = router;
