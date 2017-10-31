var coreapi = require("./CoreAPI");
var express = require("express");
var bodyParser = require("body-parser");
var namespace = require("./namespace");
var router = express.Router();
var crypto = require('crypto')
var path = require('path')
// const Web3 = require('web3');
var archiver = require('archiver');
var user = {}
const config = require('./config')
var Promise = require("bluebird");

var requestId = "";

router.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const fileUpload = require('express-fileupload');
router.use(fileUpload());

router.use(function timeLog(req, res, next) {
    try {
        return coreapi.validateRequest(req.body).then(function(user) {
            namespace.set("user", user);
            return coreapi.addNewRequest(req.body, req.originalUrl).then(function(result) {
                requestId = result.requestId;
                next();
            }).catch(function(err) {
                sendError(res, err, requestId);
            });
        }).catch(function(err) {
            res.json({
                "success": false,
                "error": err,
                "requestId": requestId
            });
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

function sendError(res, err, requestId) {
    var result = {
        "success": false,
        "error": err,
        "requestId": requestId
    };
    return coreapi.updateRequest("false", requestId, JSON.stringify(err)).then(function(updated) {
        return res.json(result);
    }).catch(function(err) {
        return res.json(result);
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
        return res.json(finalResult);
    });
}

router.post('/uploadprofilephoto', function(req, res) {
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    let file = req.files.file;
    let filename = crypto.randomBytes(20).toString('hex');
    let extname = path.extname(file.name);
    var absPath = path.join(__dirname, 'uploads/profile_pics/' + filename + extname);
    let hostUrl;

    if (config.env == "local") {
        hostUrl = "http://localhost:1800";
    } else {
        hostUrl = "http://52.41.46.86:1800";
    }

    var serverFilePath = hostUrl + '/profile_pics/' + filename + extname;
    file.mv(absPath, function(err) {
        if (err) {
            return res.status(500).send(err);
        }

        return coreapi.updateProfilePhoto({userId : req.body.userId, profilePhotoPath : serverFilePath}).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err)
            sendError(res, err, requestId);
        });
    });
});

router.post('/getallprojects', function(req, res) {
    try {
        return coreapi.getAllProjects(req.body.clientId).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/addproject', function(req, res) {
    try {
        return coreapi.addProject(req.body.project).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/findproject', function(req, res) {
    try {
        return coreapi.findProject(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err)
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/editproject', function(req, res) {
    try {
        return coreapi.editProject(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err)
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updateuserandaddprofile', function(req, res) {
    try {
        let data = req.body;
        return coreapi.updateUserAndAddProfile(data).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getuserprofile', function(req, res) {
    try {
        let id = req.body.userId;
        return coreapi.getUserProfile(id).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/edituserprofile', function(req, res) {
    try {
        let data = req.body;
        return coreapi.editUserProfile(data).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/viewpostedprojects', function(req, res) {
    try {
        return coreapi.getPostedProjects(req.body.clientId).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/findproject', function(req, res) {
    try {
        return coreapi.findProject(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/viewappliedprojects', function(req, res) {
    try {
        return coreapi.getAppliedProjects(req.body.developerId).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {

            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/applyproject', function(req, res) {
    try {
        return coreapi.applyProject(req.body.project).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/approvedeveloper', function(req, res) {
    try {
        return coreapi.approveDeveloperForProject(req.body.project).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/getsingleprojectdetails', function(req, res) {
   try {
       return coreapi.getSingleProjectDetails(req.body.projectId).then(function(result) {
         console.log(JSON.stringify(result));
           sendSuccess(res, result, requestId);
       }).catch(function(err) {
           sendError(res, err, requestId);
       });
   } catch (err) {
       sendError(res, err, requestId);
   }
});


router.post('/checkhurbalance', function(req, res){
    try{
        let web3 = new Web3();
        web3.setProvider(new web3.providers.HttpProvider('http://54.212.192.158:8545'));
        // var hurAddress = req.body.hurAddress; //0x5EC3d2f42252641c79cB709c07537Decb4F55369
        var abi =   [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"balances","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"},{"name":"_extraData","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Burn","type":"event"}];

        var myContract = new web3.eth.Contract(abi, '0x79a2f02E0C0fDf674f77c8d1Da5693091EA2D754', {
            from: '0x5fEe371e2030aE20258b5C95e6B6490ce9630975', // default from address
            gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
        });

        myContract.methods.balanceOf("0x5EC3d2f42252641c79cB709c07537Decb4F55369").call({from: '0x5fEe371e2030aE20258b5C95e6B6490ce9630975'})
        .then(function(result){
            console.log(result/1000000000000000000);
            console.log(result);
            var balanceAmount = result/1000000000000000000;
            sendSuccess(res, balanceAmount, requestId);
          }).catch(function(err) {
              sendError(res, err, requestId);
          })
    } catch(err){
        sendError(res, err, requestId);
    }
});

router.post('/addnotification', function(req, res) {
    try {
        return coreapi.addNotification(req.body.notification).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getnotifications', function(req, res) {
    try {
        return coreapi.getNotifications(req.body.userId).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/deleteproject', function(req, res) {
   try {
       return coreapi.deleteProject(req.body.projectId).then(function(result) {
           sendSuccess(res, result, requestId);
       }).catch(function(err) {
           sendError(res, err, requestId);
       });
   } catch (err) {
       sendError(res, err, requestId);
   }
});

module.exports = router;
