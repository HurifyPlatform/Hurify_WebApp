'use strict'
const publicIp = require('public-ip');
var util = require("util");
const config = require("./config");
var crypto = require('crypto');
var mc = require('mc');
var orm = require("./orm");
var Promise = require("bluebird");
var async = require("async");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var namespace = require("./namespace");
var uuid = require('uuid/v1');
var AWS = require('aws-sdk');
var nodemailer = require('nodemailer');
var nodeSes = require('node-ses');

AWS.config.update({
    accessKeyId: config.aws_access_key_id,
    secretAccessKey: config.aws_secret_access_key,
    region: config.aws_region
});
const IoT = new AWS.Iot({
    apiVersion: config.awsiot_api_version
});

var AWSIoT = require('aws-iot-device-sdk');

var https = require("https");

var reCaptcha = require('recaptcha2')

var recaptcha = new reCaptcha({
    siteKey: config.recaptcha_siteKey,
    secretKey: config.recaptcha_secretKey
});

var CoreAPI = function CoreAPI() {
    var sequelize = null;
    var client = null;
    var logger;

    function init() {
        sequelize = orm.getObj();
        client = new mc.Client();
        client.connect(function() {
            console.log("Connected to memcached storage.");
        });
    }

    this.setup = function(consoleLogger) {
        this.logger = consoleLogger;
        init();
    }

    this.getWhereObject = function() {
        var whereObject = {};
        var user = namespace.get("user");
        return whereObject;
    }

    this.getQueryWhere = function(filter) {
        var queryWhere = {};
        return queryWhere;
    }

    this.getLoggedInUser = function(data) {
        return new Promise(function(resolve, reject) {
            var user = namespace.get("user");
            return resolve(user);
        }).catch(function(err) {
            return reject(err);
        });
    }

    this.addNewRequest = function(requestData, requestUrl) {
        return new Promise(function(resolve, reject) {
            try {
                let requestId = crypto.randomBytes(20).toString('hex');
                var Requests = orm.model("Request");
                var options = {}
                options["validate"] = true;
                return Requests.create({
                    requestId: requestId,
                    requestData: JSON.stringify(requestData),
                    requestUrl: requestUrl,
                    requestToken: requestData["token"]
                }, options).then(function(success) {
                    return resolve(success);

                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err);
            }
        });
    }

    this.updateRequest = function(status, requestId, errorMsg) {
        return new Promise(function(resolve, reject) {
            try {
                var Requests = orm.model("Request");
                return Requests.findOne({
                    where: {
                        requestId: requestId
                    }
                }).then(function(request) {
                    if (request) {
                        request["status"] = status;
                        request["errorMsg"] = errorMsg;
                        return request.save().then(function(success) {
                            return resolve(success);
                        }).catch(function(err) {
                            return reject(err);
                        });
                    } else
                        return reject("requestId not found");
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.getAgreement = function(projectId) {
        return new Promise(function(resolve, reject) {
            try {
                var Agreement = orm.model("Agreement");
                var Project = orm.model("Project");
                return Agreement.findOne({
                    where: {
                        projectId: projectId
                    },
                    include: [Project]
                }).then(function(result) {
                    return resolve(result);
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.addProject = function(project) {
        project["projectStatusId"] = 2;
        return new Promise(function(resolve, reject) {
            try {
                var Project = orm.model("Project");
                return Project.create(project, {
                    validate: true
                }).then(function(result) {
                    return resolve(result);
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.getAllProjects = function(clientId) {
        return new Promise(function(resolve, reject) {
            try {
                var Project = orm.model("Project");
                return Project.findOne({
                    where: {
                        clientId: clientId
                    }
                }).then(function(result) {
                    return resolve(result);
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.validateRequest = function(data) {
        return new Promise(function(resolve, reject) {
            try {
                if (!data["token"]) {
                    return reject("Can't read token");
                }
                var key = "login_" + data.token;
                client.get(key, function(err, response) {
                    if (!response) {
                        return reject("API session expired, Please login again!");
                    } else {
                        if (key in response) {
                            var value = JSON.parse(response[key]);
                            client.set(key, JSON.stringify(value), {
                                flags: 0,
                                exptime: 7200
                            }, function(err, status) {
                                if (!err) {
                                    return resolve(value);
                                } else {
                                    return reject(err);
                                }
                            });
                        } else {
                            return reject("API session expired, Please login again!");
                        }
                    }
                });
            } catch (err) {
                return reject(err);
            }
        });
    }

    this.loginAuthenticate = function(data) {
        return new Promise(function(resolve, reject) {
            try {
                var emailId = data.email;
                var pwd = crypto.createHash('md5').update(data.password).digest("hex");
                var Users = orm.model("User");
                return Users.findOne({
                    where: {
                        email: emailId
                    }
                }).then(function(user) {
                    if (!user) {
                        return reject("Email not registered!");
                    } else if (pwd != user.password) {
                        return reject("Incorrect password entered!");
                    } else if (user.active != 1) {
                        return reject("Account is inactive (or) not verified!");
                    } else {
                        var token = crypto.randomBytes(20).toString('hex');
                        var key = "login_" + token;
                        return client.set(key, JSON.stringify(user), {
                            flags: 0,
                            exptime: 7200
                        }, function(err, status) {
                            if (!err) {
                                return resolve({
                                    "token": token,
                                    "user": user
                                });
                            } else {
                                return reject("Failed to generate token!");
                            }
                        });
                    }
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err);
            }
        });
    }

    this.updateUserAccountType = function(data) {
        return new Promise(function(resolve, reject) {
            try {
                let userId = data.userId;
                let accountType = data.accountType;
                var Users = orm.model("User");
                return Users.findOne({
                    where: {
                        id: userId
                    }
                }).then(function(user) {
                    if (user) {
                        user["userAccountType"] = accountType;
                        return request.save().then(function(success) {
                            return resolve(success);
                        }).catch(function(err) {
                            return reject(err);
                        });
                    } else
                        return reject("User Not Found!");
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        })
    }



    this.checkUserExistance = function(emailId) {
        return new Promise(function(resolve, reject) {
            try {
                var Users = orm.model("User");
                return Users.findOne({
                    where: {
                        email: emailId
                    }
                }).then(function(result) {
                    if (result) {
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        })
    }

    this.sendMail = function(data) {
        return new Promise(function(resolve, reject) {
            try {
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465,
                    secure: true,
                    auth : {
                         type: 'OAuth2',
                         user : config.email,
                         clientId : config.oauth_client_Id,
                         clientSecret : config.oauth_client_secret,
                         refreshToken : config.oauth_refresh_token

                  }
                });

                let mailOptions = {
                    from: config.email,
                    to: data.to,
                    subject: data.subject,
                    html: data.body
                };
                transporter.sendMail(mailOptions, function(error, info) {
                    if (error) {
                        console.log(error);
                        return resolve(false);
                    } else {
                        return resolve(true);
                    }
                });

            } catch (err) {
                return reject("Failed to send email!");
            }
        })
    }

    this.sendConfirmationAgain = function(emailId, req) {
        var coreapi = this;
        return new Promise(function(resolve, reject) {
            try {
                var Users = orm.model("User");
                return Users.findOne({
                    where: {
                        email: emailId
                    }
                }).then(function(user) {
                    if (!user) {
                        return reject("User not exist!");
                    }
                    let to = user.email;
                    let subject = "Hurify account confirmation!";
                    var url;
                    if (config.env == "local") {
                        url = "http://localhost:3500/confirm/" + user.emailConfirmationToken;
                    } else {
                        url = "https://platform.hurify.co/confirm/" +user.emailConfirmationToken;
                    }

                    let body = '<body style="background: #ffffff;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;"><div style="max-width: 560px;padding: 20px;background: #2C1D4F;border-radius: 5px;margin:40px auto;font-family: Open Sans,Helvetica,Arial;font-size: 15px;color: #666;"><div style="color: #ffffff;font-weight: normal;"><div style="text-align: center;font-weight:600;font-size:26px;padding: 10px 0;border-bottom: solid 3px #eeeeee;">Hurify</div><div style="clear:both"></div></div><div style="padding: 0 30px 30px 30px;border-bottom: 3px solid #eeeeee;"><div style="padding: 30px 0;font-size: 24px;color:#ffffff;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">Please click the following link to activate your account.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><a href="' + url + '" style="background: #555555;color: #fff;padding: 12px 30px;text-decoration: none;border-radius: 3px;letter-spacing: 0.3px;">Activate your Account</a></div><div style="padding: 15px;background: #eee;border-radius: 3px;text-align: center;">Need help? <a href="mailto:test.hurify.co" style="color: #3ba1da;text-decoration: none;">contact  us</a> today.</div></div><div style="color: #999;padding: 20px 30px"><div style="">Thank you!</div><div style="">The <a href="https://platform.hurify.co" style="color: #3ba1da;text-decoration: none;">Hurify</a> Team</div></div></div></body>';
                    return coreapi.sendMail({
                        "to": to,
                        "subject": subject,
                        "body": body
                    }).then(function(success) {
                        if (success) {
                            return resolve("Mail sent successfully!");
                        } else {
                            return reject("Failed to send confirmatiom email!");
                        }
                    }).catch(function(err) {
                        return reject(err);
                    });
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err);
            }
        });
    }

    this.createAccount = function(user, req) {
        var coreapi = this;
        return new Promise(function(resolve, reject) {
            try {
                coreapi.checkUserExistance(user.email).then(function(success) {
                    if (success) {
                        return reject("User Already exists!!");
                    }
                    var Users = orm.model("User");
                    var options = {};
                    options["validate"] = true;
                    user["password"] = crypto.createHash('md5').update(user["password"]).digest("hex");
                    var emailConfirmationToken = crypto.randomBytes(20).toString('hex');
                    var today = new Date();
                    var tomorrow = today.setDate(today.getDate() + 1);

                    user["emailConfirmationToken"] = emailConfirmationToken;
                    user["emailConfirmationTokenExpTime"] = tomorrow;
                    return Users.create(user, options).then(function(user) {
                        let to = user.email;
                        let subject = "Hurify account confirmation!";
                        var url;
                        if (config.env == "local") {
                            url = "http://localhost:3500/confirm/" + emailConfirmationToken;
                        } else {
                            // url = req.headers.host + "/confirm/" + user.emailConfirmationToken;
                            url = "https://platform.hurify.co/confirm/" +emailConfirmationToken;
                        }
                        let body = '<body style="background: #ffffff;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;"><div style="max-width: 560px;padding: 20px;background: #2C1D4F;border-radius: 5px;margin:40px auto;font-family: Open Sans,Helvetica,Arial;font-size: 15px;color: #666;"><div style="color: #ffffff;font-weight: normal;"><div style="text-align: center;font-weight:600;font-size:26px;padding: 10px 0;border-bottom: solid 3px #eeeeee;">Hurify</div><div style="clear:both"></div></div><div style="padding: 0 30px 30px 30px;border-bottom: 3px solid #eeeeee;"><div style="padding: 30px 0;font-size: 24px;color:#ffffff;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">Please click the following link to activate your account.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><a href="' + url + '" style="background: #555555;color: #fff;padding: 12px 30px;text-decoration: none;border-radius: 3px;letter-spacing: 0.3px;">Activate your Account</a></div><div style="padding: 15px;background: #eee;border-radius: 3px;text-align: center;">Need help? <a href="mailto:test.hurify.co" style="color: #3ba1da;text-decoration: none;">contact  us</a> today.</div></div><div style="color: #999;padding: 20px 30px"><div style="">Thank you!</div><div style="">The <a href="https://platform.hurify.co" style="color: #3ba1da;text-decoration: none;">Hurify</a> Team</div></div></div></body>';
                        return coreapi.sendMail({
                            "to": to,
                            "subject": subject,
                            "body": body
                        }).then(function(success) {
                            if (success) {
                                return resolve("Account created successfully!");
                            } else {
                                return reject("Failed to send confirmatiom email!");
                            }
                        }).catch(function(err) {
                            return reject(err);
                        });
                    });
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err);
            }
        });
    }

    this.updateUserAndAddProfile = function(params) {
        return new Promise(function(resolve, reject) {
            try {
                var data = params.user;
                let userId = data.userId;
                let accountType = params.userAccountType;
                var Users = orm.model("User");

                return Users.findOne({
                    where: {
                        id: userId
                    }
                }).then(function(user) {
                    if (user) {
                        user["userAccountType"] = accountType;
                        return user.save().then(function(success) {
                            if (accountType == 'client') {
                                var Client = orm.model("Client");
                                Client.create(params.user, {
                                    validate: true
                                }).then(function(user) {
                                    return resolve("Successfully Added Profile Details!")
                                });
                            } else if (accountType == 'developer') {
                                var Developer = orm.model("Developer");
                                Developer.create(params.user, {
                                    validate: true
                                }).then(function(user) {
                                    return resolve("Successfully Added Profile Details!")
                                });
                            }
                        }).catch(function(err) {
                            return reject(err);
                        });
                    } else
                        return reject("User Not Found!");
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        })
    }

    this.getUserProfile = function(userId) {
        return new Promise(function(resolve, reject) {
            try {
                var User = orm.model("User");
                return User.findOne({
                    where: {
                        id: userId
                    }
                }).then(function(user) {
                    let accountType = user.userAccountType;
                    if (accountType == 'client') {
                        var Client = orm.model("Client");
                        return Client.findOne({
                            where: {
                                userId: userId
                            }
                        }).then(function(client) {
                            return resolve({
                                user: user,
                                profile: client
                            })
                        });
                    } else if (accountType == 'developer') {
                        var Developer = orm.model("Developer");
                        return Developer.findOne({
                            where: {
                                userId: userId
                            }
                        }).then(function(developer) {
                            return resolve({
                                user: user,
                                profile: developer
                            })
                        });
                    }
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.forgotPassword = function(emailId) {
        var coreapi = this;
        return new Promise(function(resolve, reject) {
            try {
                let User = orm.model("User")
                User.findOne({
                    where: {
                        email: emailId
                    }
                }, {
                    validate: true
                }).then(function(result) {
                    if (!result) {
                        return reject("User not exist!")
                    }
                    var forgotPasswordToken = crypto.randomBytes(3).toString('hex');
                    var today = new Date();
                    var expDate = today.setDate(today.getDate() + 1)
                    let body = 'Your forgot password token is : ' + forgotPasswordToken;
                    User.update({
                        forgotPasswordToken: forgotPasswordToken,
                        forgotPasswordTokenExpTime: expDate
                    }, {
                        where: {
                            email: emailId
                        }
                    }).then(function() {
                        return coreapi.sendMail({
                            "to": emailId,
                            "subject": 'Forgot Password',
                            "body": body
                        }).then(function(success) {
                            if (success) {
                                return resolve("Token sent Successfully!");
                            } else {
                                return reject("Failed to send token!");
                            }
                        }).catch(function(err) {
                            return reject(err);
                        });
                    })

                })
            } catch (err) {
                return reject(err)
            }
        })
    }

    this.updateForgotPassword = function(data) {
        return new Promise(function(resolve, reject) {
            try {
                var Users = orm.model("User");
                return Users.findOne({
                    where: {
                        forgotPasswordToken: data.forgotPasswordToken
                    }
                }).then(function(user) {
                    if (user) {
                        user['forgotPasswordToken'] = 'expired';
                        var password = crypto.createHash('md5').update(data.password).digest("hex");
                        user["password"] = password;
                        user['active'] = 1;
                        return user.save().then(function(success) {
                            return resolve("Successfully changed password!");
                        }).catch(function(err) {
                            return reject(err);
                        });
                    } else
                        return reject("Invalid token or expired!");
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.editUserProfile = function(data) {
        var userId = data.user.userId;
        return new Promise(function(resolve, reject) {
            try {
                var User = orm.model("User");
                return User.findOne({
                    where: {
                        id: userId
                    }
                }).then(function(user) {
                    let accountType = user.userAccountType;
                    if (accountType == 'client') {
                        var Client = orm.model("Client");
                        return Client.findOne({
                            where: {
                                userId: userId
                            }
                        }).then(function(client) {
                            for (var key in data.user) {
                                if (key == 'userId')
                                    continue;
                                client[key] = data.user[key]
                            }
                            return client.save({
                                where: {
                                    userId: userId
                                }
                            }).then(function() {
                                return resolve("Profile updated Successfully!")
                            });
                        });
                    } else if (accountType == 'developer') {
                        var Developer = orm.model("Developer");
                        return Developer.findOne({
                            where: {
                                userId: userId
                            }
                        }).then(function(developer) {
                            for (var key in data.user) {
                                if (key == 'userId')
                                    continue;
                                developer[key] = data.user[key]
                            }
                            return developer.save({
                                where: {
                                    userId: userId
                                }
                            }).then(function() {
                                return resolve("Profile updated Successfully!")
                            });
                        });
                    }
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.editProject = function(data) {
    	var project = data.project;
        var projectId = project.projectId;
        return new Promise(function(resolve, reject) {
            try {
                var Project = orm.model("Project");
                return Project.update(project, {
                    where: {
                        id: projectId
                    }
                }).then(function(updated) {
                	return resolve("Project updated Successfully!")
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.updateProfilePhoto = function(data) {
        var userId = data.userId;
        return new Promise(function(resolve, reject) {
            try {
                var User = orm.model("User");
                return User.update({profilePhotoPath : data.profilePhotoPath}, {
                    where: {
                        id: userId
                    }
                }).then(function(updated) {
                    return resolve("Profile Photo Uploaded Successfully!")
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.confirmRegistration = function(emailConfirmationToken) {
        return new Promise(function(resolve, reject) {
            try {
                var Users = orm.model("User");
                return Users.findOne({
                    where: {
                        emailConfirmationToken: emailConfirmationToken
                    }
                }).then(function(user) {
                    if (user) {
                        user['active'] = 1;
                        user['emailConfirmationToken'] = 'expired';
                        return user.save().then(function(success) {
                            return resolve("Successfully verified user!");
                        }).catch(function(err) {
                            return reject(err);
                        });
                    } else {
                        return reject("Invalid token or expired!");
                    }
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.getPostedProjects = function(clientId) {
        return new Promise(function(resolve, reject) {
            try {
                var Project = orm.model("Project");
                Project.findAll({
                    where: {
                        clientId: clientId
                    },
                    include: [orm.model("AppliedProject"), orm.model("ProjectStatus")]
                }).then(function(result) {
                    return resolve(result)
                }).catch(function(err) {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        })
    }

    this.applyProject = function(projectDetails) {
        return new Promise(function(resolve, reject) {
            try {
                var AppliedProject = orm.model("AppliedProject");
                AppliedProject.create(
                    projectDetails, {
                        validate: true
                    }).then(function(result) {
                    return resolve(result);
                }).catch(function(err) {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        })
    }

    this.getAppliedProjects = function(developerId) {
        return new Promise(function(resolve, reject) {
            try {
                var AppliedProject = orm.model("AppliedProject");
                AppliedProject.findAll({
                    where: {
                        developerId: developerId
                    },
                    include: [{ model : orm.model("Project"), include : [{model : orm.model("ProjectStatus")}]}]
                }).then(function(result) {
                    return resolve(result)
                }).catch(function(err) {
                    return reject(err);
                })
            } catch (err) {
                return reject(err);
            }
        })
    }


this.findProject = function(data) {
       return new Promise(function(resolve, reject) {
           try {
               var categories = data.categories;
               var experienceLevel = data.experienceLevel;
               var Project = orm.model("Project");
               var queryWhere = {};
               queryWhere["projectStatusId"] = {
                   [Op.gt]: 1,
                   [Op.lt]: 4
               };
               if (categories != '') {
                   categories = categories.split(",");
                   var categoryArray = [],
                       pipedCategoryString = "";

                   for (var i = 0; i < categories.length; i++) {
                       categoryArray.push(categories[i].trim());
                   }

                   for (var i = 0; i < categoryArray.length; i++) {
                       pipedCategoryString += categoryArray[i];
                       if (i < categoryArray.length - 1)
                           pipedCategoryString += '|';
                   }

                   queryWhere["category"] = {
                       [Op.regexp]: pipedCategoryString
                   }
               }

               if (experienceLevel != '') {

                 var experienceLevel = experienceLevel.split(",");
                 var experienceArray = [],
                     pipedExperienceString = "";

                 for (var i = 0; i < experienceLevel.length; i++) {
                     experienceArray.push(experienceLevel[i].trim());
                 }

                 for (var i = 0; i < experienceArray.length; i++) {
                     pipedCategoryString += experienceArray[i];
                     if (i < experienceArray.length - 1)
                         pipedExperienceString += '|';
                 }

                   queryWhere["experienceLevel"] = {
                       [Op.regexp]: pipedExperienceString
                   }
               }
               return Project.findAll({
                   where: queryWhere,
                   include : [ orm.model("ProjectStatus")]
               }).then(function(success) {
                   return resolve(success);
               }).catch(function(err) {
                   return reject(err);
               });
           } catch (err) {
               return reject(err)
           }
       });
   }

    this.getSingleProjectDetails = function(projectId) {
           return new Promise(function(resolve, reject) {
               try {
                   var Project = orm.model("Project");
                   return Project.findOne({
                       where: {
                           id: projectId
                       },
                       include : [{model : orm.model("AppliedProject"),  include: [{model: orm.model("Developer") }]}, orm.model("ProjectStatus")]
                   }).then(function(result) {
                       return resolve(result);
                   }).catch(function(err) {
                       return reject(err);
                   });
               } catch (err) {
                   return reject(err)
               }
           });
       }

    this.addNotification = function(notification) {
        return new Promise(function(resolve, reject) {
            try {
                var Notification = orm.model("Notification");
                return Notification.create(notification, {
                    validate: true
                }).then(function(result) {
                    return resolve(result);
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.getNotifications = function(userId) {
        return new Promise(function(resolve, reject) {
            try {
                var Notification = orm.model("Notification");
                return Notification.findAll({
                    where: {
                        to: userId
                    }
                }).then(function(result) {
                    return resolve(result);
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }

    this.deleteProject = function(projectId){
           return new Promise(function(resolve, reject) {
               try{
                   var Project = orm.model("Project");
                   return Project.destroy({
                     where : {
                       id : projectId,
                       projectStatusId :{ [Op.lt] : 4}
                     }
                   }).then(function(success){
                           return resolve("Project deleted successfully.");
                   }).catch(function(err){
                       return reject(err);
                   })
               } catch (err){
                   return reject(err);
               }
           })
       }


}



CoreAPI.instance = null;

CoreAPI.getInstance = function() {
    if (this.instance === null) {
        this.instance = new CoreAPI();
    }
    return this.instance;
}

module.exports = CoreAPI.getInstance();
