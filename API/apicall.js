var coreapi = require("./CoreAPI");
var express = require("express");
var bodyParser = require("body-parser");
var namespace = require("./namespace");
var router = express.Router();
var crypto = require('crypto')
var path = require('path')
const Web3 = require('web3');
const schedule = require('node-schedule');
var archiver = require('archiver');
var user = {};
var crypt = require('./crypt');
var configObj = require("./config");
const config = JSON.parse(crypt.decrypt(configObj.allConfigData));
var Promise = require("bluebird");

var requestId = "";

var taskSchedule = new schedule.RecurrenceRule();

// taskSchedule.seconds = 10;

schedule.scheduleJob('*/30 * * * *', checkPaymentStatus);


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
    console.log("Request: ",req.files);
    console.log(req.body);
    if (!req.files)
        return res.status(400).send('No files were uploaded.');
    let file = req.files.file;
    console.log("mimetype: ", req.files.file.mimetype);
    console.log("Ext: ", path.extname(req.files.file.name));
    if (((req.files.file.mimetype) != 'image/png') && ((req.files.file.mimetype) != 'image/jpeg') && ((req.files.file.mimetype) != 'image/jpg')) {
      console.log("Rejected by mimetype.");
      return sendError(res, "Invalid file format.", requestId);
    }
    if ((path.extname(req.files.file.name) != '.png') && (path.extname(req.files.file.name) != '.jpeg') && (path.extname(req.files.file.name) != '.jpg')) {
      console.log("Rejected by file extension.");
      return sendError(res, "Invalid file format.", requestId);
    }
    let filename = crypto.randomBytes(20).toString('hex');
    let extname = path.extname(file.name);
    var absPath = path.join(__dirname, '/public/shared/platform/profile_pics/' + filename + extname);
    var httpMode = (config.env == "production") ? "https://" : "http://";
    var serverFilePath = httpMode + req.headers.host + '/public/shared/platform/profile_pics/' + filename + extname;
    file.mv(absPath, function(err) {
        if (err) {
            return res.status(500).send(err);
        }
        return coreapi.updateProfilePhoto({
            userId: req.body.userId,
            profilePhotoPath: serverFilePath
        }).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
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
	console.log("ProjectData: ", req.body)
        return coreapi.addProject(req, req.body, req.files).then(function(result) {

            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {

        sendError(res, err, requestId);
    }
});

router.post('/updateprojectstatus', function(req, res) {
    try {
        return coreapi.updateProjectStatus(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/editproject', function(req, res) {
    try {
        console.log("Data: ", req.body)
        return coreapi.editProject(req).then(function(result) {
            console.log("edit success");
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

// router.post('/updateuserandaddprofile', function(req, res) {
//     try {
//         return coreapi.updateUserAndAddProfile(req).then(function(result) {
//             sendSuccess(res, result, requestId);
//         }).catch(function(err) {
//             console.log(err)
//             sendError(res, err, requestId);
//         });
//     } catch (err) {
//         sendError(res, err, requestId);
//     }
// });

router.post('/addprofile', function(req, res) {
    try {
        return coreapi.addProfile(req).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updateuseraccounttype', function(req, res) {
    try {
        return coreapi.updateUserAccountType(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err)
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getuserprofile', function(req, res) {
    try {
        console.log("apicall check1:");
        let id = req.body.userId;
        return coreapi.getUserProfile(id).then(function(result) {
          console.log("apicall check2:");
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
          console.log("apicall check3:");
            sendError(res, err, requestId);
        });
    } catch (err) {
      console.log("apicall check4:");
        sendError(res, err, requestId);
    }
});

router.post('/edituserprofile', function(req, res) {
    try {
        return coreapi.editUserProfile(req).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err)
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
        return coreapi.findProject(req.body).then(function(findResult) {
            return coreapi.getAppliedProjects(req.body.developerId).then(function(appliedResult) {


                var finalResult = [];

                var appliedProjects = appliedResult.map(project => (project.projectId))

                for (var i = 0; i < findResult.length; i++) {
                    var project = findResult[i];
                    if (!appliedProjects.includes(project.id)) {
                        finalResult.push(project);
                    }
                }

                sendSuccess(res, finalResult, requestId);
            }).catch(function(err) {
                sendError(res, err, requestId);
            });
        }).catch(function(err) {
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
            console.log(result)
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            console.log(err)

            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/checkhurbalance', function(req, res) {
  try {
	console.log("check1");
      let web3 = new Web3();
      web3.setProvider(new web3.providers.HttpProvider('http://106.51.44.203:8545'));
      // var hurAddress = req.body.hurAddress; //0x5EC3d2f42252641c79cB709c07537Decb4F55369
      var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hurclan","type":"address"}],"name":"ethtransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';
      var myContract = new web3.eth.Contract(abi, '0x40e624d93110a8324920f011b80c6db0fab2b85b', {
          from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706', // default from address
          gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
      });

      myContract.methods.balanceOf("0xbf3b79a27a91a8dc12d66eb1785c37b73c597706").call({
              from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706'
          })
          .then(function(result) {
              var balanceAmount = result / 1000000000000000000;
              sendSuccess(res, balanceAmount, requestId);
          }).catch(function(err) {
              sendError(res, err, requestId);
          })
  } catch (err) {
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

router.post('/selectdeveloperforevaluation', function(req, res) {
    try {
        return coreapi.selectDeveloperForEvaluation(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/sendnegotiationformtodeveloper', function(req, res) {
    try {
        return coreapi.sendNegotiationFormToDeveloper(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/developeracceptsnegotiationform', function(req, res) {
    try {
        return coreapi.developerAcceptsNegotiationForm(req.body.project).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/developerrejectsnegotiationform', function(req, res) {
    try {
        return coreapi.developerRejectsNegotiationForm(req.body.project).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/approveselecteddeveloper', function(req, res) {
    try {
        return coreapi.approveSelectedDeveloper(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/discardselecteddeveloper', function(req, res) {
    try {
        return coreapi.discardSelectedDeveloper(req.body).then(function(result) {
            sendSuccess(res, result, requestId);
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/generateescrowpdf', function(req, res) {
    try {
        return coreapi.generateEscrowPDFAgreement(req).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/deployagreement', function(req, res) {
  try {
    console.log("Check1: ");
      let web3 = new Web3();
      var agreementId = req.body.agreementId;
      return coreapi.getAgreement(agreementId).then(function(agreementData) {
        console.log("Check2: ");
        var bidValue = agreementData.bidValue;
        var walletAddress = agreementData.clientHURAddress;
        return coreapi.walletBalance(walletAddress).then(function(walletResult) {
          console.log("Check3: ",walletResult);
          console.log("BalanceAmount", walletResult.balanceAmount);
          console.log('BidValue', bidValue);
          var balance = walletResult.balanceAmount;
          if (balance >= bidValue) {
            console.log("Check4: ");
            return coreapi.transferAmount(walletAddress, bidValue).then(function(transferResult) {
              if (transferResult.success) {
                console.log("Check5: ");
                return coreapi.deployAgreement(agreementId).then(function(deployResult) {
                  console.log("Check6: ");
                  sendSuccess(res, deployResult, requestId)
                }).catch(function(err) {
                  console.log("api deploy err1: ", err);
                  sendError(res, err, requestId);
                });
              } else {
                sendError(res, err, requestId);
              }
            }).catch(function(err) {
              console.log("api deploy err3: ", err);
              sendError(res, err, requestId);
            });
          } else {
            console.log("insufficient Balance");
            // sendError(res, err, requestId);
          }
        }).catch(function(err) {
          console.log("api deploy err5: ", err);
          sendError(res, err, requestId);
        });
      }).catch(function(err) {
        console.log("api deploy err6: ", err);
        sendError(res, err, requestId);
      })
  } catch (err) {
    console.log("api deploy err7: ", err);
      sendError(res, err, requestId);
  }
});

// router.post('/deployagreement', function(req, res) {
//     try {
//         return coreapi.deployAgreement(req.body).then(function(result) {
//             console.log(result);
//             console.log("result");
//             return sendSuccess(res, result, requestId)
//         }).catch(function(err) {
//             console.log(err)
//             sendError(res, err, requestId);
//         })
//     } catch (err) {
//         sendError(res, err, requestId);
//     }
// });

router.post('/developeracceptscontract', function(req, res) {
    try {
        console.log(req.body.projectId);
        return coreapi.developerAcceptsContract(req.body.projectId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/developerclaimsforpayment', function(req, res) {
    try {
        return coreapi.developerClaimsForPayment(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/clientrejectspayment', function(req, res) {
    try {
        return coreapi.clientRejectsPayment(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/addfeedback', function(req, res) {
    try {
        return coreapi.addFeedback(req.body.feedback).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getfeedbackdetails', function(req, res) {
    try {
        return coreapi.getFeedbackDetails(req.body.developerId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/unlock', function(req, res) {
    try {
        return coreapi.unlock().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        })
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/addpaymentaddress', function(req, res) {
    try {
        return coreapi.addPaymentAddress(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/addtokensaledata', function(req, res) {
    try {
        return coreapi.addTokenSaleData(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/gettokensaledata', function(req, res) {
    try {
        return coreapi.getTokenSaleData(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updatetokensaledata', function(req, res) {
    try {
        return coreapi.updateTokenSaleData(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/clientdashboard', function(req, res) {
    try {
        return coreapi.clientDashboard(req.body.clientId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});
router.post('/getallprojectscount', function(req, res) {
    try {
        return coreapi.getAllProjectsCount().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});
router.post('/developerdashboard', function(req, res) {
    try {
        return coreapi.developerDashboard(req.body.userId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/tokenform1', function(req, res) {
    try {
        return coreapi.tokenForm1(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
          console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
      console.log(err);
        sendError(res, err, requestId);
    }
});

router.post('/tokenform2', function(req, res) {
    try {
        return coreapi.tokenForm2(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/tokenform3', function(req, res) {
    try {
        return coreapi.tokenForm3(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getreferralcode', function(req, res) {
    try {
        return coreapi.getReferralCode(req.body.userId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});
router.post('/getreferreduserscount', function(req, res) {
    try {
        return coreapi.getReferredUsersCount(req.body.referrerCode).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/gettotalstakesearnedbyuser', function(req, res) {
    try {
        return coreapi.getTotalStakesEarnedByUser(req.body.referrerCode).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/checkifairdropdataexists', function(req, res) {
    try {
        return coreapi.checkIfAirDropDataExists(req.body.userId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/addairdropdata', function(req, res) {
    try {
        return coreapi.addAirDropData(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/getairdropdata', function(req, res) {
    try {
        return coreapi.getAirDropData(req.body.userId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/adduserqueryafterlogin', function(req, res) {
    try {
      console.log("Req data: ", req.body);
        return coreapi.addUserQuery(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/checkiftokensalewhitelistdataexists', function(req, res) {
    try {
        return coreapi.checkIfTokenSaleWhiteListDataExists(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/addtokensalewhitelistdata', function(req, res) {
    try {
        return coreapi.addTokenSaleWhiteListData(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/gettokensalewhitelistdata', function(req, res) {
    try {
        return coreapi.getTokenSaleWhiteListData(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/getuserdetails', function(req, res) {
    try {
        return coreapi.getUserDetails(req.body.userId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/checkiftokensaledataexists', function(req, res) {
    try {
        return coreapi.checkIfTokenSaleDataExists(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/gettokencurrencyandwalletaddress', function(req, res) {
    try {
        return coreapi.getTokenCurrencyAndWalletAddress(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/gettokensaleusers', function(req, res) {
    try {
        return coreapi.getTokensaleUsers().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updatetokensaledatawithnooftokens', function(req, res) {
    try {
        return coreapi.updateTokenSaleDataWithNoOfTokens(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getallunsolveduserqueries', function(req, res) {
    try {
        return coreapi.getAllUnsolvedUserQueries().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getuserquerybyid', function(req, res) {
    try {
        return coreapi.getUserQueryById(req.body.queryId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/checkiftelegrambountydataexists', function(req, res) {
    try {
        return coreapi.checkIfTelegramBountyDataExists(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/addtelegrambountydata', function(req, res) {
    try {
        return coreapi.addTelegramBountyData(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/gettelegrambountydatabyemail', function(req, res) {
    try {
        return coreapi.getTelegramBountyDataByEmail(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getalltelegrambountydata', function(req, res) {
    try {
        return coreapi.getAllTelegramBountyData().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

//

router.post('/checkifproducthuntbountydataexists', function(req, res) {
    try {
        return coreapi.checkIfProductHuntBountyDataExists(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/addproducthuntbountydata', function(req, res) {
    try {
        return coreapi.addProductHuntBountyData(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getproducthuntbountydatabyemail', function(req, res) {
    try {
        return coreapi.getProductHuntBountyDataByEmail(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getallproducthuntbountydata', function(req, res) {
    try {
        return coreapi.getAllProductHuntBountyData().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/sendresolutionforuserquery', function(req, res) {
    try {
        return coreapi.sendResolutionForUserQuery(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/checkifkycdataexists', function(req, res) {
    try {
        return coreapi.checkIfKYCDataExists(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/addkycdata', function(req, res) {
    try {
        return coreapi.addKYCdata(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updatetokensalewithtransactionhash', function(req, res) {
    try {
        return coreapi.updateTokenSaleWithTransactionHash(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updatetokensalewithhurtokens', function(req, res) {
    try {
        return coreapi.updateTokenSaleWithHURTokens(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/addanothertransactionintokensale', function(req, res) {
    try {
        return coreapi.addAnotherTransactionInTokenSale(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getalltokensaledata', function(req, res) {
   try {
       return coreapi.getAllTokenSaleData(req.body.email).then(function(result) {
           return sendSuccess(res, result, requestId)
       }).catch(function(err) {
           sendError(res, err, requestId);
       });
   } catch (err) {
       sendError(res, err, requestId);
   }
});

router.post('/gettransactionbyhash', function(req, res) {
   try {
       return coreapi.getTransactionByHash(req.body).then(function(result) {
           return sendSuccess(res, result, requestId)
       }).catch(function(err) {
           sendError(res, err, requestId);
       });
   } catch (err) {
       sendError(res, err, requestId);
   }
});

router.post('/getcurrencyconversionvalue', function(req, res) {
    try {
        return coreapi.getCurrencyConversionValue().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});


router.post('/bestrateddeveloperslist', function(req, res) {
    try {
        return coreapi.bestRatedDevelopersList().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});
router.post('/bestratedclientslist', function(req, res) {
    try {
        return coreapi.bestRatedClientsList().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});
router.post('/topprojectsbasedonprice', function(req, res) {
    try {
        return coreapi.topProjectsBasedOnPrice().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});
router.post('/topprojectsbasedonbids', function(req, res) {
    try {
        return coreapi.topProjectsBasedOnBids().then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});
router.post('/profilecompletenesspercentage', function(req, res) {
    try {
        return coreapi.profileCompletenessPercentage(req.body.userId).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getreferralcount', function(req, res) {
    try {
        return coreapi.getAllTypesOfReferralCount(req.body.email).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/updateuserwalletaddress', function(req, res) {
    try {
        return coreapi.updateUserWalletAddress(req.body).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
});

router.post('/getalluserstakes', function(req, res) {
    try {
        return coreapi.getAllUserStakes(req.body.data).then(function(result) {
            return sendSuccess(res, result, requestId)
        }).catch(function(err) {
            sendError(res, err, requestId);
        });
    } catch (err) {
      console.log(err)
        sendError(res, err, requestId);
    }
});


router.post('/getallproducts', function(req, res) {
    try {
        return coreapi.getAllProductsList().then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
          console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
      console.log(err);
        sendError(res, err, requestId);
    }
})

router.post('/addproductstocart', function(req, res) {
    try {
        return coreapi.addProductsToCart(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


router.post('/removeproductsfromcart', function(req, res) {
    try {
        return coreapi.removeProductsFromCart(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
          console.log(err);
            sendError(res, err, requestId);
        });
    } catch (err) {
      console.log(err);
        sendError(res, err, requestId);
    }
})


router.post('/editproductsincart', function(req, res) {
    try {
      console.log("Req: ", req.body);
        return coreapi.editProductsInCart(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


router.post('/getcartproducts', function(req, res) {
    try {
        return coreapi.getCartProducts(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/addorderdetails', function(req, res) {
    try {
        console.log("Data: ", req.body);
        var data = req.body;
        return coreapi.addShippingDetails(data).then(result => {
            var orderId = result.orderId;
            data.orderId = orderId;
            var orderNo = result.orderNo;
            data.orderNo = orderNo;
            return coreapi.addPaymentstatus(data).then(result1 => {
                var paymentId = result1.paymentId;
                data.paymentId = paymentId;
                return coreapi.addProductDetailsInOrderInfo(data).then(result2 => {
                    return coreapi.deleteCartForSuccessfulOrders(data).then(result3 => {
                        return coreapi.sendMailBasedOnOrderStatus(data).then(result4 => {
                          sendSuccess(res, orderId, requestId);
                        }).catch(err => {
                          console.log("errrr ", err);
                          sendError(res, err, requestId);
                        })
                    }).catch(err => {
                      console.log("Err: ", err);
                        sendError(res, err, requestId);
                    });
                }).catch(err => {
                  console.log("Err1: ", err);
                    sendError(res, err, requestId);
                });
            }).catch(err => {
              console.log("Err2: ", err);
                sendError(res, err, requestId);
            })
        }).catch(err => {
          console.log("Err3: ", err);
            sendError(res, err, requestId);
        });
    } catch (err) {
      console.log("Err4: ", err);
        sendError(res, err, requestId);
    }
})

router.post('/getproductdescription', function(req, res) {
    try {
        return coreapi.getProductDescription(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/getsuccessfulorderinfo', function(req, res) {
    try {
        return coreapi.getSuccessfulOrderInfo(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
          console.log("Err: ", err);
            sendError(res, err, requestId);
        });
    } catch (err) {
      console.log("Err1: ", err);
        sendError(res, err, requestId);
    }
})

router.post('/getallordersforuser', function(req, res) {
    try {
        return coreapi.getAllOrdersForUser(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/cancelplacedorder', function(req, res) {
    try {
        return coreapi.cancelPlacedOrder(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/getallcancelledordersforuser', function(req, res) {
    try {
        return coreapi.getAllCancelledOrdersForUser(req.body).then(result => {

            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/getproductcategoriesandcount', function(req, res) {
    try {
        return coreapi.getProductCategoriesAndCount().then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/getproductsforeachcategories', function(req, res) {
    try {
        return coreapi.getProductsForEachCategories().then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/filterproductsbasedoncategory', function(req, res) {
    try {
        return coreapi.filterProductsBasedOnCategory(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


/*Parameters : categories, */
router.post('/getproductsubcategoriesandcount', function(req, res) {
    try {
        return coreapi.getProductSubCategoriesAndCount(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


/*Parameters : categories*/
router.post('/getproductsforeachsubcategoriesbasedoncategories', function(req, res) {
    try {
        return coreapi.getProductsForEachSubCategoriesBasedOnCategories(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


router.post('/getproductbasedonsubcategories', function(req, res) {
    try {
        return coreapi.getProductBasedOnSubCategories(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/getallorderslistforadmin', function(req, res) {
    try {
        return coreapi.getAllOrdersListForAdmin(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


router.post('/getorderslistbasedonstatusforadmin', function(req, res) {
    try {
        return coreapi.getOrdersListBasedOnStatusForAdmin(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


router.post('/updateorderstatusandtrackingdetailsbyadmin', function(req, res) {
    try {
        return coreapi.updateOrderStatusAndTrackingDetailsByAdmin(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

// router.post('/addtrackingdetailstoorders', function(req, res) {
//     try {
//         return coreapi.addTrackingDetailsToOrders(req.body).then(result => {
//             sendSuccess(res, result, requestId);
//         }).catch(err => {
//             sendError(res, err, requestId);
//         });
//     } catch (err) {
//         sendError(res, err, requestId);
//     }
// })

router.post('/getproductsbasedonorderid', function(req, res) {
    try {
        return coreapi.getProductsBasedOnOrderId(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


router.post('/sendmailforsuccessfulorders', function(req, res) {
    try {
        return coreapi.sendMailForSuccessfulOrders(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})

router.post('/updatecookiepolicyflag', function(req, res) {
    try {
        return coreapi.updateCookiePolicyFlag(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


router.post('/sendordermailtoarrow', function(req, res) {
    try {
        return coreapi.sendOrderMailToArrow(req.body).then(result => {
            sendSuccess(res, result, requestId);
        }).catch(err => {
            sendError(res, err, requestId);
        });
    } catch (err) {
        sendError(res, err, requestId);
    }
})


function checkPaymentStatus() {
    try {
        coreapi.checkPaymentStatus().then(function(success) {
          console.log("Successfully updated the status.");
        }).catch(function(err) {
            console.log(err);
        });
    } catch (err) {
        console.log(err);
    }
}

module.exports = router;
