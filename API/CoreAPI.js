const Sqreen = require('sqreen');
const publicIp = require('public-ip');
var util = require("util");
const csvjson = require('csvjson');
var jsonexport = require('jsonexport');
var crypt = require('./crypt');
var configObj = require("./config");
const config = JSON.parse(crypt.decrypt(configObj.allConfigData));
var crypto = require('crypto');
var mc = require('mc');
var orm = require("./orm");
var request = require('request');
var Promise = require("bluebird");
const moment = require('moment');
var async = require("async");
var Sequelize = require("sequelize");
const Op = Sequelize.Op;
var namespace = require("./namespace");
const pdfkit = require('./pdfkit');
var uuid = require('uuid/v1');
var AWS = require('aws-sdk');
const Web3 = require('web3');
const exec = require('child_process').exec;
var nodemailer = require('nodemailer');
var nodeSes = require('node-ses');
var path = require('path');
const fs = require('fs');
var stringSearcher = require('string-search');
var Hurify = require('./../App/client/components/DApp/build/contracts/Hurify.json');
var randomatic = require('randomatic');
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
const httpMode = (config.env == "production") ? "https://" : "http://";


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

	this.setup = function() {
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

	this.getAgreement = function(agreementId) {
		return new Promise(function(resolve, reject) {
			try {
				var Agreement = orm.model("Agreement");
				var Project = orm.model("Project");
				return Agreement.findOne({
					where: {
						id: agreementId
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

	this.addProject = function(req, reqBody, files) {
		return new Promise(function(resolve, reject) {
			try {
				let project = JSON.parse(reqBody.project);
				project["projectStatusId"] = project.projectStatusId;
				if (files != null) {
					let file = files.file;
					let filename = crypto.randomBytes(20).toString('hex');
					let extname = path.extname(file.name);
					var absPath = path.join(__dirname, '/public/shared/platform/project_files/' + filename + extname);
					var serverFilePath = httpMode + req.headers.host + '/public/shared/platform/project_files/' + filename + extname;
					file.mv(absPath, function(err) {
						if (err) {
							return reject({
								"error": err
							})
						}
						var Project = orm.model("Project");
						project["attachmentPath"] = serverFilePath
						return Project.create(project, {
							validate: true
						}).then(function(result) {
							return resolve(result);
						}).catch(function(err) {
							return reject(err);
						});
					});
				} else {
					var Project = orm.model("Project");
					return Project.create(project, {
						validate: true
					}).then(function(result) {
						return resolve(result);
					}).catch(function(err) {
						return reject(err);
					});
				}
			} catch (err) {
				return reject(err)
			}
		});
	}

	this.updateProjectStatus = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var Project = orm.model("Project");
				return Project.update({
					projectStatusId: data.projectStatusId
				}, {
					where: {
						id: data.projectId
					}
				}).then(function(result) {
					return resolve("Successfully updated project status!");
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err)
			}
		})
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
				console.log("Validate data",data);
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


	this.adminLogin = function(data) {
			return new Promise(function(resolve, reject) {
				try {
							console.log("Data: ", data);
							var Admin = orm.model("Admin");
							var email = data.email;
								email = email.toLowerCase();
							var password = crypto.createHash('sha256').update(data.password).digest('hex');
							return Admin.findOne({
									where : {
											email : email
									}
							}).then(user => {
								if (!user) {
									return reject("No such User exists.");
								} else if(password != user.password) {
									return reject("Invalid UserName/Password.");
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
							console.log("Err: ", err);
							return reject("Failed to generate token!");
						}
					});
								}
							})
				} catch(err) {
					console.log("Err1", err);
					return reject(err);
				}
			})
	}


	// this.loginAuthenticate = function(data) {
	// 	var coreapi = this;
	// 	return new Promise(function(resolve, reject) {
	// 		try {
	// 			console.log("check1: ");
	// 			console.log("Data: ", data);
	// 			var emailId = data.email;
	// 			var pwdsha = coreapi.saltHashPassword(data.password);
	// 			var pwdmd5 = crypto.createHash('md5').update(data.password).digest('hex');
	// 			var Users = orm.model("User");
	// 			return Users.findOne({
	// 				where: {
	// 					email: emailId
	// 				}
	// 			}).then(function(user) {
  //
	// 				if (!user) {
	// 					Sqreen.auth_track(false, { email: data.email });
	// 					console.log("Sqreen Err: ");
	// 					return reject("Email not registered!");
	// 				} else if (user.password != pwdsha && user.password != pwdmd5) {
	// 					Sqreen.auth_track(false, { email: user.email });
	// 					console.log("Sqreen Err: ");
	// 					return reject("Incorrect password entered!");
	// 				} else if (user.active != 1) {
	// 					Sqreen.auth_track(false, { email: user.email });
	// 					return reject("Account is inactive (or) not verified!");
	// 				} else if (user.blackList == 1) {
	// 						return reject("We have encountered an issue with the Transaction submitted by you. Please contact support@hurify.co for further clarification.");
	// 				} else {
	// 					var token = crypto.randomBytes(20).toString('hex');
	// 					var key = "login_" + token;
	// 					return client.set(key, JSON.stringify(user), {
	// 						flags: 0,
	// 						exptime: 7200
	// 					}, function(err, status) {
	// 						if (!err) {
	// 							Sqreen.auth_track(true, { email: user.email });
	// 					console.log("Sqreen Err: ");
	// 							return resolve({
	// 								"token": token,
	// 								"user": user
	// 							});
	// 						} else {
	// 							Sqreen.auth_track(false, { email: user.email });
	// 					console.log("Sqreen Err: ",err);
	// 							return reject("Failed to generate token!");
	// 						}
	// 					});
	// 				}
	// 			}).catch(function(err) {
	// 				console.log("Err1: ", err);
	// 				return reject(err);
	// 			});
	// 		} catch (err) {
	// 			console.log("Err2: ", err);
	// 			return reject(err);
	// 		}
	// 	});
	// }

	this.loginAuthenticate = function(data) {
			var coreapi = this;
			return new Promise(function(resolve, reject) {
				try {
					var emailId = data.email;
					var pwdsha = coreapi.saltHashPassword(data.password);
					var pwdmd5 = crypto.createHash('md5').update(data.password).digest('hex');
					//var pwd = crypto.createHash('md5').update(data.password).digest("hex");
					var Users = orm.model("User");
					var Captcha = orm.model("Captcha");
					return Captcha.findOne({
						where : {
							text : data.text,
							captchaToken : data.captchaToken
						}
					}).then(captchaResult => {
						if(!captchaResult) {
							return reject("Invalid captcha.");
						}
						return Users.findOne({
							where: {
								email: emailId
							}
						}).then(function(user) {
							if (!user) {
								return reject("Email not registered, Please sign up using Linkedin Account.");
							} else if (user.password != pwdsha && user.password != pwdmd5) {
							///Sqreen.auth_track(false, { email: user.email });
							console.log("Sqreen Err: ");
							return reject("Incorrect password entered!");
							}
							else if (user.active != 1) {
								return reject("Account is inactive (or) not verified!");
							}
							else if(user.blackList == 1) {
								return reject("Your account has been blocked due to suspicious activity! Please contact our Support team for further assistance.");
							} else {
								return Captcha.destroy({
									where : {
										id : captchaResult.id
									}
								}).then(destroyed => {
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
								}).catch(err => {
									return reject(err);
								})
							}
						}).catch(function(err) {
							return reject(err);
						});
					}).catch(err => {
						return reject(err);
					})
				} catch (err) {
					return reject(err);
				}
			});
		}

	// this.updateUserAccountType = function(data) {
	//  return new Promise(function(resolve, reject) {
	//      try {
	//          let userId = data.userId;
	//          let accountType = data.accountType;
	//          var Users = orm.model("User");
	//          return Users.findOne({
	//              where: {
	//                  id: userId
	//              }
	//          }).then(function(user) {
	//              if (user) {
	//                  user["userAccountType"] = accountType;
	//                  return request.save().then(function(success) {
	//                      return resolve(success);
	//                  }).catch(function(err) {
	//                      return reject(err);
	//                  });
	//              } else
	//                  return reject("User Not Found!");
	//          }).catch(function(err) {
	//              return reject(err);
	//          });
	//      } catch (err) {
	//          return reject(err)
	//      }
	//  })
	// }

	this.updateUserAccountType = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var userId = data.userId;
				var accountType = data.userAccountType;
				var Users = orm.model("User");
				return Users.findOne({
					where: {
						id: userId
					}
				}).then(function(user) {
					if (user) {
						Users.update({
							userAccountType: accountType
						}, {
							where: {
								id: userId
							}
						}).then(function(success) {
							return resolve("Successfully updated account type");
						}).catch(function(err) {
							return reject(err);
						})
					} else {
						return reject("User Not Found!");
					}
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

	this.checkReferrerCodeExistance = function(code) {
		return new Promise(function(resolve, reject) {
			try {
				if (code == "" || code == null) {
					return resolve(false);
				}
				var Users = orm.model("User");
				return Users.findOne({
					where: {
						referrerCode : code
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
				var email = data.from;
				var auth = {};

				console.log("Data: ", data);
				//Choose the configurations based on 'from' email.
				if(email.indexOf('members@hurify.co') > -1) { //for signup mails linked with ashish@mobodexter.com
				  auth = {
						type : 'OAuth2',
						user: config.email,
						clientId: config.oauth_client_Id,
						clientSecret: config.oauth_client_secret,
						refreshToken: config.oauth_refresh_token
					}
				} else if(email.indexOf('hurifyteam@hurify.co') > -1) { //for whitelist mails linked with sri.krish@mobodexter.com
					auth = {
						type : 'OAuth2',
						user: config.email_2,
						clientId: config.oauth_client_Id_2,
						clientSecret: config.oauth_client_secret_2,
						refreshToken: config.oauth_refresh_token_2
					}
				} else if(email.indexOf('members2@hurify.co') > -1) { //for referral mails linked with srinidhi.murthy@mobodexter.com
					auth = {
						type : 'OAuth2',
						user: config.email_3,
						clientId: config.oauth_client_Id_3,
						clientSecret: config.oauth_client_secret_3,
						refreshToken: config.oauth_refresh_token_3
					}
				} else { //for support mail linked with sri.krish@mobodexter.com
					auth = {
						type : 'OAuth2',
						user: config.email_2,
						clientId: config.oauth_client_Id_2,
						clientSecret: config.oauth_client_secret_2,
						refreshToken: config.oauth_refresh_token_2
					}
				}

				console.log("AuthObject: ", auth);

				let transporter = nodemailer.createTransport({
					host: 'smtp.gmail.com',
					port: 465,
					secure: true,
					auth: auth
				});
				console.log("sendMail check2: ");


				let mailOptions = {
					from: email,//config.email,
					to: data.to,
					bcc : data.bcc,
					subject: data.subject,
					html: data.body,
					attachments : data.attachments
				};


				transporter.sendMail(mailOptions, function(error, info) {
					if (error) {
						console.log("mailError: ",error);
						return resolve(false);
					} else {
						console.log("sendMail check3: ");
						return resolve(true);
					}
				});

			} catch (err) {
				console.log("Err:", err);
				return reject("Failed to send email!");
			}
		})
	}


	this.sendConfirmationAgain = function(emailId, req) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var Users = orm.model("User");
				var emailConfirmationToken = crypto.randomBytes(20).toString('hex');
				var today = new Date();
				var tomorrow = today.setDate(today.getDate() + 1);
				return Users.findOne({
					where: {
						email: emailId
					}
				}).then(function(user) {
					if (!user) {
						return reject("User not exist!");
					}
					return Users.update({
						emailConfirmationToken : emailConfirmationToken,
						emailConfirmationTokenExpTime : tomorrow
					}, {
						where : {
							email : emailId
						}
					}).then(function(updated) {
						let to = user.email;
						let subject = "Hurify account confirmation!";
						var url = 'https://platform.hurify.co/confirm/' + emailConfirmationToken;
						var bcc = "ico@hurify.co";
						let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">Please click the following link to activate your account.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><a href="' + url + '" style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration: none;border-radius:3px;letter-spacing: 0.3px;">Activate your Account</a></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

						var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

						return coreapi.sendMail({
						  "from" : config.name_and_email_3,
						  "to": to,
						  "subject": subject,
						  "body": body,
						  "bcc" : bcc,
						  "attachments" : attachments
						}).then(function(success) {
						  if (success) {
						    return resolve("Mail sent successfully!");
						  } else {
						    return reject("Failed to send confirmation email!");
						  }
						}).catch(function(err) {
							console.log("Err: ", err);
						  return reject(err);
						});
					}).catch(function(err) {
						console.log("Err1: ", err);
						return reject(err);
					});
				}).catch(function(err) {
					console.log("Err2: ", err);
					return reject(err);
				});
			} catch (err) {
				console.log("Err3: ", err);
				return reject(err);
			}
		});
	}


	this.saltHashPassword = function(password) {
		var salt = 'hurifyshapaasmer';
		return crypto.createHmac('sha512', salt).update(password).digest('hex')
	}

	this.createAccountForAndroid = function(user, req) {
		console.log(req.body)
		var coreapi = this;
		const uuidv1 = require("uuid/v1");
		return new Promise(function(resolve, reject) {
			try {
				Sqreen.signup_track({email:user.email});
				coreapi.checkUserExistance(user.email).then(function(success) {
					if (success) {
						return reject("User Already exists!!");
					}
					var Users = orm.model("User");
					var UUId = uuidv1();
					var options = {};
					options["validate"] = true;
					user["password"] = coreapi.saltHashPassword(user["password"]);
					var emailConfirmationToken = crypto.randomBytes(20).toString('hex');
					var today = new Date();
					var tomorrow = today.setDate(today.getDate() + 1);
					user["emailConfirmationToken"] = emailConfirmationToken;
					user["emailConfirmationTokenExpTime"] = tomorrow;
					user["uuid"] = UUId;
					// if (user.referralCode == '7c5798' || user.referralCode == '12efed') {
					// 	user['tokenSalePageFlag'] = 1;
					// }

					if (user.referralCode) {
						user.referralCode = ""
					}

					return Users.create(user, options).then(function(user) {
						// var from = config.name_and_email;
						let to = user.email;
						let subject = "Hurify account confirmation!";
						var bcc = "ico@hurify.co";
						var url = 'https://platform.hurify.co/confirm/' + user.emailConfirmationToken;
						let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">Please click the following link to activate your account.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><a href="' + url + '" style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration: none;border-radius:3px;letter-spacing: 0.3px;">Activate your Account</a></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

						var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

						return coreapi.sendMail({
							"from": config.name_and_email,
							"to": to,
							"bcc" : bcc,
							"subject": subject,
							"body": body,
							"attachments" : attachments
						}).then(function(success) {
							if (success) {
								return resolve("Account created successfully!");
							} else {
								return reject("Failed to send confirmatiom email!");
							}
						}).catch(function(err) {
							return reject(err);
						});
					}).catch(function(err) {
						return reject(err);
					})
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		});
	}

	// this.createAccount = function(user, req) {
	// 	console.log(req.body)
	// 	var coreapi = this;
	// 	const uuidv1 = require("uuid/v1");
	// 	return new Promise(function(resolve, reject) {
	// 		try {
  //
	// 			Sqreen.signup_track({email:user.email});
	// 			recaptcha.validate(req.body.captcha).then(() => {
	// 				coreapi.checkUserExistance(user.email).then(function(success) {
	// 					if (success) {
	// 						return reject("User Already exists!!");
	// 					}
	// 					var Users = orm.model("User");
	// 					var UUId = uuidv1();
	// 					var options = {};
	// 					options["validate"] = true;
	// 					user["password"] = coreapi.saltHashPassword(user["password"]);
	// 					var emailConfirmationToken = crypto.randomBytes(20).toString('hex');
	// 					var today = new Date();
	// 					var tomorrow = today.setDate(today.getDate() + 1);
	// 					user["emailConfirmationToken"] = emailConfirmationToken;
	// 					user["emailConfirmationTokenExpTime"] = tomorrow;
	// 					user["uuid"] = UUId;
	// 					// if (user.referralCode == '7c5798' || user.referralCode == '12efed') {
	// 					// 	user['tokenSalePageFlag'] = 1;
	// 					// }
  //
	// 					if (user.referralCode) {
	// 						user.referralCode = ""
	// 					}
  //
	// 					return Users.create(user, options).then(function(user) {
	// 						// var from = config.name_and_email;
	// 						let to = user.email;
	// 						let subject = "Hurify account confirmation!";
	// 						var bcc = "ico@hurify.co";
	// 						var url = 'https://platform.hurify.co/confirm/' + user.emailConfirmationToken;
	// 						let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">Please click the following link to activate your account.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><a href="' + url + '" style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration: none;border-radius:3px;letter-spacing: 0.3px;">Activate your Account</a></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';
  //
	// 						var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];
  //
	// 						return coreapi.sendMail({
	// 							"from": config.name_and_email,
	// 							"to": to,
	// 							"bcc" : bcc,
	// 							"subject": subject,
	// 							"body": body,
	// 							"attachments" : attachments
	// 						}).then(function(success) {
	// 							if (success) {
	// 								return resolve("Account created successfully!");
	// 							} else {
	// 								return reject("Failed to send confirmatiom email!");
	// 							}
	// 						}).catch(function(err) {
	// 							console.log("Err1: ", err);
	// 							return reject(err);
	// 						});
	// 					}).catch(function(err) {
	// 						console.log("Err2: ", err);
	// 						return reject(err);
	// 					})
	// 				}).catch(function(err) {
	// 					console.log("Err3: ", err);
	// 					return reject(err);
	// 				});
	// 		    }).catch(function(err) {
	// 					console.log("Err4: ", err);
	// 					return reject(err);
	// 		    });
	// 		} catch (err) {
	// 			console.log("Err5: ", err);
	// 			return reject(err);
	// 		}
	// 	});
	// }


	this.setCaptchaDetails = function(data) {
    return new Promise(function(resolve, reject) {
    	try {
            var Captcha = orm.model("Captcha")
            return Captcha.create(data).then(created => {
            	return resolve("created");
            }).catch(err => {
            	console.log("Err: ", err);
            	return reject(err);
            });
    	} catch(err) {
    		console.log("Err1: ", err);
    		return reject(err);
    	}
    })
  }


	this.createAccount = function(user, req) {
	    console.log(req.body)
	    var coreapi = this;
	    const uuidv1 = require("uuid/v1");
	    return new Promise(function(resolve, reject) {
	        try {
	          Sqreen.signup_track({ email: user.email });
	          var Captcha = orm.model("Captcha");
	            return Captcha.findOne({
	              where : {
	                text : user.text,
	                captchaToken : user.captchaToken
	              }
	            }).then(captchaResult => {
	              if(!captchaResult) {
	                return reject("Invalid Captcha.");
	              }
	              coreapi.checkUserExistance(user.email).then(function(success) {
	                    if (success) {
	                        return reject("User Already exists!!");
	                    }
	                    var Users = orm.model("User");
	                    var UUId = uuidv1();
	                    var options = {};
	                    options["validate"] = true;
	                    user["password"] = coreapi.saltHashPassword(user["password"]);
	                    var emailConfirmationToken = crypto.randomBytes(20).toString('hex');
	                    var today = new Date();
	                    var tomorrow = today.setDate(today.getDate() + 1);
	                    user["emailConfirmationToken"] = emailConfirmationToken;
	                    user["emailConfirmationTokenExpTime"] = tomorrow;
	                    user["uuid"] = UUId;
	                    // if (user.referralCode == '7c5798' || user.referralCode == '12efed') {
	                    // 	user['tokenSalePageFlag'] = 1;
	                    // }
	                    return Users.create(user, options).then(function(user) {
	                        // var from = config.name_and_email;
	                        let to = user.email;
	                        let subject = "Hurify account confirmation!";
	                        var bcc = "ico@hurify.co";
	                        var url = 'https://platform.hurify.co/confirm/' + user.emailConfirmationToken;
												//	var body = "Verification link : " + url;
//													var attachments = '';

													let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">Please click the following link to activate your account.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><a href="' + url + '" style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration: none;border-radius:3px;letter-spacing: 0.3px;">Activate your Account</a></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

	                        var attachments = [{
	                            filename: "HURFIY1.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png",
	                            cid: "image1"
	                        }, {
	                            filename: "facebook.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png",
	                            cid: "image2"
	                        }, {
	                            filename: "github.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/github.png",
	                            cid: "image3"
	                        }, {
	                            filename: "linkdin.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png",
	                            cid: "image4"
	                        }, {
	                            filename: "medium.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/medium.png",
	                            cid: "image5"
	                        }, {
	                            filename: "reddit.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png",
	                            cid: "image6"
	                        }, {
	                            filename: "slack.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/slack.png",
	                            cid: "image7"
	                        }, {
	                            filename: "telegram.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png",
	                            cid: "image8"
	                        }, {
	                            filename: "twitter.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png",
	                            cid: "image9"
	                        }, {
	                            filename: "youtube.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png",
	                            cid: "image10"
	                        }, {
	                            filename: "bitcointalk.png",
	                            path: "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png",
	                            cid: "image11"
	                        }];

	                        return coreapi.sendMail({
	                            "from": config.name_and_email,
	                            "to": to,
	                            "bcc": bcc,
	                            "subject": subject,
	                            "body": body,
	                            "attachments": attachments
	                        }).then(function(success) {
	                            return Captcha.destroy({
	                              where : {
	                                id : captchaResult.id
	                              }
	                            }).then(destroyed => {
	                              return resolve("Account created successfully!");
	                            }).catch(err => {
	                              return reject(err);
	                            });
	                        }).catch(function(err) {
	                            console.log("Err1: ", err);
	                            return reject(err);
	                        });
	                    }).catch(function(err) {
	                        console.log("Err2: ", err);
	                        return reject(err);
	                    })
	                }).catch(function(err) {
	                    console.log("Err3: ", err);
	                    return reject(err);
	                });
	            }).catch(err => {
	              return reject(err);
	            })
	        } catch (err) {
	            console.log("Err5: ", err);
	            return reject(err);
	        }
	    });
	}


	// this.updateUserAndAddProfile = function(req) {
	//  return new Promise(function(resolve, reject) {
	//      try {
	//          var data = req.body;
	//          var files = req.files;
	//          var userData = data.project;
	//          if (typeof userData == "string") {
	//              var userData = JSON.parse(userData);
	//          }
	//          let userId = userData.userId;
	//          let accountType = data.userAccountType;
	//          var Users = orm.model("User");
	//          return Users.findOne({
	//              where: {
	//                  id: userId
	//              }
	//          }).then(function(user) {
	//              if (user) {
	//
	//                  user["userAccountType"] = accountType;
	//                  return user.save().then(function(success) {
	//                      if (accountType == 'client') {
	//                          var Client = orm.model("Client");
	//                          Client.create(userData, {
	//                              validate: true
	//                          }).then(function(user) {
	//                              return resolve("Successfully Added Profile Details!")
	//                          });
	//                      } else if (accountType == 'developer') {
	//                          if (files != null) {
	//                              let file = files.file;
	//                              let filename = crypto.randomBytes(20).toString('hex');
	//                              let extname = path.extname(file.name);
	//                              var absPath = path.join(__dirname, 'uploads/developer_docs/' + filename + extname);
	//                              var serverFilePath = httpMode + req.headers.host + '/developer_docs/' + filename + extname;
	//                              file.mv(absPath, function(err) {
	//                                  if (err) {
	//                                      return reject({
	//                                          "error": err
	//                                      });
	//                                  }
	//                                  var Developer = orm.model("Developer");
	//                                  userData["attachmentPath"] = serverFilePath
	//                                  return Developer.create(userData, {
	//                                      validate: true
	//                                  }).then(function(user) {
	//                                      return resolve("Successfully Added Profile Details!")
	//                                  }).catch(function(err) {
	//                                      return reject(err);
	//                                  });
	//                              });
	//                          } else {
	//                              var Developer = orm.model("Developer");
	//                              Developer.create(userData, {
	//                                  validate: true
	//                              }).then(function(user) {
	//                                  return resolve("Successfully Added Profile Details!")
	//                              }).catch(function(err) {
	//                                  return reject(err);
	//                              });
	//                          }
	//                      }
	//                  }).catch(function(err) {
	//                      return reject(err);
	//                  });
	//              } else
	//                  return reject("User Not Found!");
	//          }).catch(function(err) {
	//              return reject(err);
	//          });
	//      } catch (err) {
	//          return reject(err)
	//      }
	//  })
	// }

	this.getUserProfile = function(userId) {
		return new Promise(function(resolve, reject) {
			console.log(" check1:");
			try {
				var User = orm.model("User");
				return User.findOne({
					where: {
						id: userId
					}
				}).then(function(user) {
					console.log(" check2:");
					var accountType = user.userAccountType;
					if (accountType == 'client') {
						var Client = orm.model("Client");
						return Client.findOne({
							where: {
								userId: userId
							}
						}).then(function(client) {
							console.log(" check3:");
							return resolve({
								user: user,
								profile: client
							})
						});
					} else if (accountType == 'developer') {
						console.log(" check4:");
						var Developer = orm.model("Developer");
						return Developer.findOne({
							where: {
								userId: userId
							},
							include: [orm.model("Feedback")]
						}).then(function(developer) {
							console.log(" check5:");
							return resolve({
								user: user,
								profile: developer
							})
						});
					} else {
						return resolve({
							message: "false"
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
					var bcc = "ico@hurify.co";
					var expDate = today.setDate(today.getDate() + 1)
					let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px 0;font-size: 24px;text-align: center;line-height: 40px;">Thank you for your interest in Hurify.<span style="display: block;">Your six digits forgot password code is:</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><span style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration: none;border-radius: 3px;letter-spacing: 0.3px;">' +forgotPasswordToken+ '</span></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help? <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify </a>Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

					var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

					User.update({
						forgotPasswordToken: forgotPasswordToken,
						forgotPasswordTokenExpTime: expDate
					}, {
						where: {
							email: emailId
						}
					}).then(function() {
						return coreapi.sendMail({
							"from": config.name_and_email_3,
							"to": emailId,
							"bcc" : bcc,
							"subject": 'Forgot Password',
							"body": body,
							"attachments" : attachments
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
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				console.log("check1: ");
				var Users = orm.model("User");
				return Users.findOne({
					where: {
						forgotPasswordToken: data.forgotPasswordToken
					}
				}).then(function(user) {
					console.log("check2: ");
					if (user) {
						console.log("check3: ");
						user['forgotPasswordToken'] = 'expired';
						var password = coreapi.saltHashPassword(data.password);
						user["password"] = password;
						user['active'] = 1;
						return user.save().then(function(success) {
							console.log("check4: ");
							return resolve("Successfully changed password!");
						}).catch(function(err) {
							console.log("Err1: ", err);
							return reject(err);
						});
					} else
						return reject("Invalid token or expired!");
				}).catch(function(err) {
					console.log("Err3: ", err);
					return reject(err);
				});
			} catch (err) {
				console.log("Err3: ", err);
				return reject(err)
			}
		});
	}

	this.editUserProfile = function(req) {
		return new Promise(function(resolve, reject) {
			try {
				let data = req.body;
				if (typeof data.user == 'string') {
					data["user"] = JSON.parse(data.user)
				}
				var files = req.files;
				var userId = data.user.userId;
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
							if (files != null) {

								console.log("Fileee: ", req.files);
								if (((req.files.file.mimetype) != 'application/pdf') && ((req.files.file.mimetype) != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && ((req.files.file.mimetype) != 'application/msword')) {
						      console.log("Rejected by mimetype.");
						      return reject("Invalid file format.")
						    }
						    if ((path.extname(req.files.file.name) != '.pdf') && (path.extname(req.files.file.name) != '.docx') && (path.extname(req.files.file.name) != '.doc')) {
						      console.log("Rejected by file extension.");
						      return reject("Invalid file format.")
						    }

								let file = files.file;
								let filename = crypto.randomBytes(20).toString('hex');
								let extname = path.extname(file.name);
								var absPath = path.join(__dirname, 'public/shared/platform/developer_docs/' + filename + extname);
								var serverFilePath = httpMode + req.headers.host + 'public/shared/platform/developer_docs/' + filename + extname;
								file.mv(absPath, function(err) {
									if (err) {
										return reject({
											"error": err
										});
									}
									developer["attachmentPath"] = serverFilePath
									return developer.save({
										where: {
											userId: userId
										}
									}).then(function(status) {
										return resolve("Profile updated Successfully!")
									}).catch(function(err) {
										return reject(err);
									});
								});
							} else {
								return developer.save({
									where: {
										userId: userId
									}
								}).then(function(status) {
									return resolve("Profile updated Successfully!")
								}).catch(function(err) {
									return reject(err);
								});
							}
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

	this.editProject = function(req) {
		var data = req.body;
		var project = JSON.parse(data.project);
		var projectId = project.projectId;
		var files = req.files;
		return new Promise(function(resolve, reject) {
			try {
				if (files != null) {
					let file = files.file;
					let filename = crypto.randomBytes(20).toString('hex');
					let extname = path.extname(file.name);
					var absPath = path.join(__dirname, '/public/shared/platform/project_files/' + filename + extname);
					var serverFilePath = httpMode + req.headers.host + '/public/shared/platform/project_files/' + filename + extname;
					file.mv(absPath, function(err) {
						if (err) {
							return reject({
								"error": err
							})
						}
						var Project = orm.model("Project");
						project["attachmentPath"] = serverFilePath;
						return Project.update(project, {
							where: {
								id: projectId
							}
						}).then(function(result) {
							return resolve("Project updated Successfully!");
						}).catch(function(err) {
							return reject(err);
						});
					});
				} else {
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
				}
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
				return User.update({
					profilePhotoPath: data.profilePhotoPath
				}, {
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
		var coreapi = this
		return new Promise(function(resolve, reject) {
			try {
				var Users = orm.model("User");
				var now = new Date();
				return Users.findOne({
					where: {
						emailConfirmationToken: emailConfirmationToken,
						emailConfirmationTokenExpTime : { [Op.gt] : now }
					}
				}).then(function(user) {
					if (user) {
						// var referralCode = crypto.randomBytes(3).toString('hex'),
						// 	referralLink = "https://platform.hurify.co/register/" + referralCode;
						//user['referrerCode'] = referralCode;
						user['active'] = 1;
						user['emailConfirmationToken'] = 'expired';
						return user.save().then(function(success) {
							// var to = user.email;
							// var bcc = "ico@hurify.co";
							// var subject = "Referral code";
							// var body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">If someone purchases Token in Tokensale using your referral code, You will recieve 100 STAKES of HUR Tokens as a reward.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><span style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration:none;border-radius:3px;letter-spacing: 0.3px;">' +referralCode+ '</span></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';
              //
							// var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];
							return resolve("Successfully verified user!");
							// return coreapi.sendMail({
							// 	"from": config.name_and_email_3,
							// 	"to": to,
							// 	"bcc": bcc,
							// 	"subject": subject,
							// 	"body": body,
							// 	"attachments" : attachments
							// }).then(function(success) {
							// 	return resolve("Successfully verified user!");
							// }).catch(function(err) {
							// 	console.log("Err: ", err);
							// 	return reject(err);
							// });
						}).catch(function(err) {
							console.log("Err1: ", err);
							return reject(err);
						});
					} else {
						return reject("Invalid token or expired!");
					}
				}).catch(function(err) {
					console.log("Err3: ", err);
					return reject(err);
				});
			} catch (err) {
				console.log("Err4: ", err);
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


	this.applyProject = function(ProjectData) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var AppliedProject = orm.model("AppliedProject");
				var Project = orm.model("Project");
				return AppliedProject.create(ProjectData, {
					validate: true
				}).then(function(result) {
					return Project.findOne({
						where: {
							id: ProjectData.projectId
						},
						include: [orm.model("Client")]
					}).then(function(project) {
						var userId = project.Client.userId;
						let notificationData = {
							to: userId,
							shortDesc: "Application Received",
							description: "The developer applied to project."
						};
						coreapi.addNotification(notificationData).then(function(success) {
							return resolve(result);
						}).catch(function(err) {
							return reject(err);
						})
						return resolve(result);
					}).catch(function(err) {
						return reject(err);
					});

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
					include: [{
						model: orm.model("Project"),
						include: [{
							model: orm.model("ProjectStatus")
						}, {
							model: orm.model("AppliedProject")
						}]
					}]
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
					categories = categories.replace(/,/g, "|")
					queryWhere["category"] = {
						[Op.regexp]: categories
					}
				}
				if (experienceLevel != '') {
					experienceLevel = experienceLevel.replace(/,/g, "|")
					queryWhere["experienceLevel"] = {
						[Op.regexp]: experienceLevel
					}
				}

				return Project.findAll({
					where: queryWhere,
					include: [orm.model("ProjectStatus"), orm.model("AppliedProject")]
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
					include: [{
						model: orm.model("AppliedProject"),
						include: [{
							model: orm.model("Developer")
						}]
					}, orm.model("ProjectStatus"), orm.model("Agreement")]
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

	this.selectDeveloperForEvaluation = function(projectDetails) {
		return new Promise(function(resolve, reject) {
			try {
				var projectId = projectDetails.projectId,
					developerId = projectDetails.developerId;
				var Project = orm.model("Project");
				Project.update({
					developerId: developerId,
					projectStatusId: 3
				}, {
					where: {
						id: projectId
					}
				}).then(function(updated) {
					Project.findOne({
						where: {
							id: projectId,
							developerId: developerId
						}
					}).then(function(result) {
						return resolve(result);
					}).catch(function(err) {
						return reject(err);
					})
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
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

	this.deleteProject = function(projectId) {
		return new Promise(function(resolve, reject) {
			try {
				var Project = orm.model("Project");
				return Project.findOne({
					where: {
						id: projectId
					}
				}).then(function(result) {
					if (result.projectStatusId < 4) {
						return Project.destroy({
							where: {
								id: projectId,
								projectStatusId: {
									[Op.lt]: 4
								}
							}
						}).then(function(success) {
							return resolve("Project deleted successfully.");
						}).catch(function(err) {
							return reject(err);
						});
					} else {
						return reject("Cannot delete Project after the developer is finalized.")
					}
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.sendNegotiationFormToDeveloper = function(projectDetails) {
		return new Promise(function(resolve, reject) {
			try {
				var projectId = projectDetails.projectId;
				var Agreement = orm.model("Agreement");
				var Project = orm.model("Project");
				Project.update({
					approvalFlag: 1
				}, {
					where: {
						id: projectId
					}
				}).then(function(updated) {
					Agreement.create(projectDetails, {
						where: {
							projectId: projectId
						}
					}).then(function(inserted) {
						Project.findOne({
							where: {
								id: projectId
							}
						}).then(function(result) {
							return resolve(result);
						}).catch(function(err) {
							return reject(err)
						});
					}).catch(function(err) {
						return reject(err);
					})
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.developerAcceptsNegotiationForm = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var Agreement = orm.model("Agreement");
				var Project = orm.model("Project");
				return Agreement.update({
					developerHURAddress: data.developerHURAddress
				}, {
					where: {
						projectId: data.projectId
					}
				}).then(function(result) {
					return Project.update({
						projectStatusId: 4
					}, {
						where: {
							id: data.projectId
						}
					}).then(function(result) {
						return Agreement.findOne({
							where: {
								projectId: data.projectId
							}
						}).then(function(result) {
							return resolve(result);
						}).catch(function(err) {
							return reject(err);
						});
					}).catch(function(err) {
						return reject(err);
					})
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.developerRejectsNegotiationForm = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var Project = orm.model("Project");
				var Agreement = orm.model("Agreement");
				return Agreement.destroy({
					where: {
						id: data.agreementId
					}
				}).then(function(result) {
					return Project.update({
						approvalFlag: 0,
						projectStatusId: 2
					}, {
						where: {
							id: data.projectId
						}
					}).then(function() {
						return resolve("You have successfully rejected the negotiation form.");
					}).catch(function(err) {
						return reject(err);
					});
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.discardSelectedDeveloper = function(projectDetails) {
		return new Promise(function(resolve, reject) {
			try {
				var projectId = projectDetails.projectId;
				var Project = orm.model("Project");
				Project.update({
					developerId: null,
					projectStatusId: 2
				}, {
					where: {
						id: projectId
					}
				}).then(function(result) {
					return resolve("Developer successfully discarded.");
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.generateEscrowPDFAgreement = function(req) {
		return new Promise(function(resolve, reject) {
			try {
				var agreementId = req.body.agreementId;
				var Agreement = orm.model("Agreement"),
					Project = orm.model("Project");
				return Agreement.findOne({
					where: {
						id: agreementId
					},
					include: [{
						model: Project,
						include: [{
							model: orm.model("Client")
						}, {
							model: orm.model("Developer")
						}]
					}]
				}).then(function(result) {
					return pdfkit.generatePDF(result).then(function(result) {
						var filePath = httpMode + req.headers.host + '/escrowPDF/' + result.fileName;
						return Agreement.update({
							filePath: filePath
						}, {
							where: {
								id: agreementId
							}
						}).then(function(updated) {
							return Agreement.findOne({
								where: {
									id: agreementId
								},
								include: [{
									model: Project,
									include: [{
										model: orm.model("Client")
									}, {
										model: orm.model("Developer")
									}]
								}]
							}).then(function(result) {
								return resolve(result);
							}).catch(function(err) {
								return reject(err);
							})
						}).catch(function(err) {
							return reject(err);
						});
					}).catch(function(err) {
						return reject(err);
					});
				}).catch(function(err) {
					return reject(err)
				});
			} catch (err) {
				return reject(err)
			}
		});
	}

	this.walletBalance = function(fromAddress) {
		return new Promise(function(resolve, reject) {
			try {
				let web3 = new Web3();
				web3.setProvider(new web3.providers.HttpProvider('http://106.51.44.203:8545'));
				// var hurAddress = req.body.hurAddress; //0x5EC3d2f42252641c79cB709c07537Decb4F55369
				var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hurclan","type":"address"}],"name":"ethtransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';

				var myContract = new web3.eth.Contract(JSON.parse(abi), '0x40e624d93110a8324920f011b80c6db0fab2b85b', {
					//from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706', // default from address
					from: "0xbf3b79a27a91a8dc12d66eb1785c37b73c597706",
					gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
				});

				myContract.methods.balanceOf(fromAddress).call({
					from: fromAddress
					//from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706'
				}).then(function(result) {
					var balanceAmount = result / 1000000000000000000;
					console.log("BalanceAmount", balanceAmount);
					return resolve({success : "true" , balanceAmount : balanceAmount});
				}).catch(function(err) {
					console.log("Err: ", err);
					return reject(err);
				});
			} catch (err) {
				console.log("Err1: ", err);
				return reject(err);
			}
		});
	}

	this.transferAmount = function(walletAddress, bidValue) {
		return new Promise(function(resolve, reject) {
			try {
				let web3 = new Web3();
				var provider = new web3.providers.HttpProvider('http://106.51.44.203:8545');
				const contract = require('truffle-contract');
				const hurify = contract(Hurify);
				console.log("hurify",hurify);
				hurify.setProvider(provider);
				console.log("providers:",web3.version);
				var hurifyInstance = "";
				//hurify.currentProvider.sendAsync=function(){
				//	return hurfiy.currentProvider.send.apply(hurify.currentProvider,arguments);
				//};
				hurify.deployed().then((instance) => {
					hurifyInstance = instance;
					//console.log("deploying",hurifyInstance);
					return hurifyInstance.transfer("0xbf3b79a27a91a8dc12d66eb1785c37b73c597706", bidValue, {
						from: walletAddress
					})
				}).then((result) => {
					if (result.receipt.status == "0x1") {
						return resolve({
							success: true
						});
					} else {
						return reject({
							success: false
						});
					}
				}).catch((err) => {
					console.log("Err1: ", err);
					return reject(err);
				})
			} catch (err) {
				console.log("Err2: ", err);
				return reject(err);
			}
		});
	}
	this.payment = function(walletAddress, bidValue) {
		return new Promise(function(resolve, reject) {
			try {
				//let web3 = new Web3();
				let web3 = new Web3();
				web3.setProvider(new web3.providers.HttpProvider('http://106.51.44.203:8545'));
				var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hurclan","type":"address"}],"name":"ethtransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';;


				const contract = new web3.eth.Contract(JSON.parse(abi), '0x40e624d93110a8324920f011b80c6db0fab2b85b', { from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706', gas: 100000});

				console.log("list :",walletAddress);
				web3.eth.personal.unlockAccount(walletAddress, "mobo1234", 1500);

				contract.methods.balanceOf('0xbf3b79a27a91a8dc12d66eb1785c37b73c597706').call()
				.then(console.log)
				.catch(console.error);
				contract.methods.balanceOf('0x618104bCe7958ed2883006fec6009336dc05Bf0d').call()
				.then(console.log)
				.catch(console.error);
				const totalBidValue = parseFloat(bidValue).toFixed(0) + "000000000000000000"
				contract.methods.transfer(walletAddress, totalBidValue).send()
				.then(result => {
					if(result.status == "0x1"){

						console.log("success payment");
					}
					else{
						console.log("fails");
					}
				})

			} catch (err) {
				console.log("Err2: ", err);
				return reject(err);
			}
		});
	}

	this.deployAgreement = function(data) {
		console.log("check 1:");
		return new Promise(function(resolve, reject) {
			try {
				var coreapi = this;
				var agreementId = data.agreementId;
				var Agreement = orm.model("Agreement");
				var Project = orm.model("Project");
				return Agreement.findOne({
					where: {
						id: agreementId
					},
					include: [{
						model: Project,
						include: [{
							model: orm.model("Client")
						}, {
							model: orm.model("Developer")
						}]
					}]
				}).then(function(result) {
					console.log("check 2:");
					var client = result.clientHURAddress,
						developer = result.developerHURAddress,
						title = result.Project.projectName,
						bidValue = result.bidValue,
						timeframe = result.estimatedDays,
						startDate = result.startDate,
						myDate = new Date(startDate + " 05:30:00 "),
						startTime = myDate.getTime() / 1000.0,
						hurify = '0x40e624d93110a8324920f011b80c6db0fab2b85b',
						EscrowfileName = "Escrow",
						projectId = result.Project.id;

					fs.writeFile('./../App/client/components/DApp/contracts/' + EscrowfileName + '.sol', 'pragma solidity ^0.4.15;\n\ncontract Escrow {\n\t/*\n\tGobal variables are declared here\n\t*/\n\taddress client = ' + client + ';\n\taddress developer = ' + developer + ';\n\tstring public title = \"' + title + '\";\n\tuint public bidValue = ' + bidValue + ';\n\tuint public timeframe = ' + timeframe + ';\n\tuint public starttime = ' + startTime + '; \n\taddress hurify = ' + hurify + ' ;\n\n\tfunction pay() payable public { \n\t\thurify.call(bytes4(sha3("transferFrom(bool)")), client, developer, bidValue); \n\t } \n\n\t function refund() payable public { \n\t\t require( now > starttime + ' + timeframe + ' days); \n\t\thurify.call(bytes4(sha3("transferFrom(bool)")), client, client, bidValue);\n\t}\n\n}', function(err) {
						if (err) {
							return reject(err);
						}
						console.log("check 3:");
						console.log(".sol file created");
						fs.readdir('./../App/client/components/DApp/migrations', function(err, files) {
							if (err) {} else {
								exec('rm -rf ./../App/client/components/DApp/migrations/*.js', function(error, stdout, stderr) {
									if (error) {
										return reject(error);
									}
									console.log("check 4:");
									console.log("deleted all files from migrations directory.");
									let len = files.length + 1;
									fs.writeFile('./../App/client/components/DApp/migrations/' + len + '_' + EscrowfileName + '.js', 'var hurify = artifacts.require(\'' + '.\/' + EscrowfileName + '.sol\');\n\nmodule.exports = function(deployer) {\n\tdeployer.deploy(hurify).then(function(){\n\t\tconsole.log(hurify.address);\n\t\treturn hurify.address;\n\t\t});\n}', function(err) {
										if (err) {
											return reject(err);
										}
										console.log("check 5:");
										console.log(".js file created"); //After this
										let web3 = new Web3();
										web3.setProvider(new web3.providers.HttpProvider('http://34.214.122.212:8545'));
										var fromAddress = "0x1a4f41ae92e652fe9f2a94074d048528e94b1f18";
										console.log("check 6:");
										console.log("from: ", fromAddress);
										var flag = web3.eth.personal.unlockAccount(fromAddress, "karthikn", 1500);

										if (flag) {
											console.log("check 7:");
											// var absPath = path.join(__dirname, './../App/client/components/DApp')
											// exec('cd ' + absPath  + ' && truffle migrate --reset', function(err, stdout, stderr) {
											exec('truffle migrate --network rinkeby --reset', {
												cwd: './../App/client/components/DApp'
											}, function(err, stdout, stderr) {
												if (err) {
													console.log("Err :", err);
													return reject(err);
												}
												console.log("check 8:");
												stringSearcher.find(stdout, 'Escrow: ').then(function(resultArr) {
													console.log("Address: ", resultArr[0].text.trim().split(" ")[1]);
													var contractAddress = resultArr[0].text.trim().split(" ")[1];
													// console.log("contractAddress: ", contractAddress);
													return Project.update({
														contractAddress: contractAddress,
														projectStatusId: 5
													}, {
														where: {
															id: projectId
														}
													}).then(function(updated) {
														console.log("check 9:");
														return resolve("success");
													}).catch(function(err) {
														console.log("Err 1:", err);
														return reject(err);
													});
												}).catch(function(err) {
													console.log("Err 2:", err);
													return reject(err);
												});
											});
										} else {
											console.log("Err 3:", err);
											return reject("Migration failed.");
										}
									});
								});
							}
						})
					});
				}).catch(function(err) {
					console.log("Err 4:", err);
					return reject(err);
				});
			} catch (err) {
				console.log("Err 5:", err);
				return reject(err);
			}
		})
	}

	this.unlock = function() {
		return new Promise(function(resolve, reject) {
			try {
				let web3 = new Web3();
				web3.setProvider(new web3.providers.HttpProvider('http://106.51.44.203:8545'));
				var fromAddress = web3.eth.accounts[1];
				console.log("from: ", fromAddress);
				var flag = web3.personal.unlockAccount(fromAddress, "karthikn", 1500);
				return resolve(flag);
			} catch (err) {
				return reject(err);
			}
		})
	}


	this.developerAcceptsContract = function(projectId) {
		return new Promise(function(resolve, reject) {
			try {
				var Project = orm.model("Project");
				Project.update({
					contractFlag: 1
				}, {
					where: {
						id: projectId
					}
				}).then(function(updated) {
					return resolve("Successfully accepted the contract.");
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.developerClaimsForPayment = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var projectId = data.projectId;
				var Project = orm.model("Project");
				var Agreement = orm.model("Agreement");
				return Project.findOne({
					where: {
						id: projectId
					}
				}).then(function(result) {
					if (!result) {
						return reject("no such project exists");
					}
					if (result.paymentFlag == 1) {
						return reject("Already claimed for payment");
					}
					return Project.update({
						paymentFlag: 1,
						projectStatusId: 6
					}, {
						where: {
							id: projectId
						}
					}).then(function(updated) {
						return resolve("successfully claimed for payment.");
					}).catch(function(err) {
						return reject(err)
					});
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.clientRejectsPayment = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var projectId = data.projectId;
				var Project = orm.model("Project");
				var Agreement = orm.model("Agreement");
				return Project.update({
					paymentFlag: 0,
					projectStatusId: 5
				}, {
					where: {
						id: projectId
					}
				}).then(function(updated) {
					return resolve("Successfully rejected payment")
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}


	this.addFeedback = function(feedback) {
		return new Promise(function(resolve, reject) {
			try {
				var Feedback = orm.model("Feedback");
				var Project = orm.model("Project");
				return Feedback.findOne({
					where: {
						projectId: feedback.projectId,
						clientId: feedback.clientId,
						developerId: feedback.developerId
					}
				}).then(function(result) {
					if (!result) {
						return Feedback.create(feedback, {
							validate: true
						}).then(function(created) {
							return Feedback.findOne({
								where: {
									projectId: feedback.projectId
								}
							}).then(function(result) {
								// return resolve(result);
								if (result.rating < 3) {
									return Project.update({
										projectStatusId: 7
									}, {
										where: {
											id: feedback.projectId
										}
									}).then(function(updated) {
										return Feedback.findOne({
											where: {
												projectId: feedback.projectId
											}
										}).then(function(result) {
											return resolve(result);
										}).catch(function(err) {
											return reject(err);
										});
									}).catch(function(err) {
										return reject(err);
									});
								} else {
									return Project.update({
										projectStatusId: 7
									}, {
										where: {
											id: feedback.projectId
										}
									}).then(function(updated) {
										return Feedback.findOne({
											where: {
												projectId: feedback.projectId
											}
										}).then(function(result) {
											return resolve(result);
										}).catch(function(err) {
											return reject(err);
										});
									}).catch(function(err) {
										return reject(err);
									});
								}
							}).catch(function(err) {
								return reject(err);
							});
						}).catch(function(err) {
							return reject(err);
						});
					} else {
						return reject("You have already given Feedback for this Developer.");
					}
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.getFeedbackDetails = function(developerId) {
		return new Promise(function(resolve, reject) {
			try {
				var Feedback = orm.model("Feedback");
				return Feedback.findAndCountAll({
					where: {
						developerId: developerId
					}
				}).then(function(result) {
					return resolve(result);
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		});
	}


	this.addPaymentAddress = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var projectId = data.projectId;
				var paymentAddress = data.paymentAddress;
				var Project = orm.model("Project");
				return Project.findOne({
					where: {
						id: projectId
					}
				}).then(function(result) {
					if (result) {
						return Project.update({
							paymentAddress: paymentAddress
						}, {
							where: {
								id: projectId
							}
						}).then(function(success) {
							return Project.findOne({
								where: {
									id: projectId
								}
							}).then(function(result) {
								return resolve(result);
							}).catch(function(err) {
								return reject(err);
							});
						}).catch(function(err) {
							return reject(err);
						})
					} else {
						return reject("No such project exists.")
					}
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err)
			}
		});
	}

	// this.addTokenSaleData = function(tokenData) {
	// 	var coreapi = this;
	// 	return new Promise(function(resolve, reject) {
	// 		try {
	// 			var TokenSale = orm.model("TokenSale");
	// 			var Users = orm.model("User");
	// 			var walletAddress = '';
	// 			if (tokenData.currency == 'BTC') {
	// 				walletAddress = "1FL35xbb4uDB9vU2yr6FsJxZeJVf5K9faE";
	// 			} else if (tokenData.currency == 'ETH') {
	// 				walletAddress = "0xa1Cf400C056CF6D58c5efaD53E70919aFb95b466";
	// 			} else if (tokenData.currency == 'LTC') {
	// 				walletAddress = "LL7h7DndiAaXdAHcc2wRbyaFWJpKcMbdht";
	// 			} else if (tokenData.currency == 'DASH') {
	// 				walletAddress = "XmnJmamBBWhBR2E2vD8SPpPxvkwb6pRX3i";
	// 			} else if (tokenData.currency == 'BCH') {
	// 				walletAddress = "1LgqU2PzAsbNZJ9j5zjrxs1Mxd8JcjGRCX";
	// 			} else if (tokenData.currency == 'BTG') {
	// 				walletAddress = "3LCdYFYas3RpTQTiToiQQ8mxheFZ9ttygy";
	// 			}
	// 			var email = tokenData.email;
	// 			var from = config.name_and_email;
	// 			var to = email;
	// 			var subject = "Hurify Token Sale";
	// 			let body = '<div style = "text-align:center;"><a href="https://platform.hurify.co"><img src="cid:image1" style = "display:block;margin-left:auto;margin-right:auto;" width="100px"></a></div><div style="align:middle;padding: 30px 0;font-size: 24px;text-align: center;line-height: 40px;">Hi ' + tokenData.firstName + ' ' + tokenData.lastName + ', Welcome to hurify token pre-sale.<br> You have chosen the option of purchasing tokens with ' + tokenData.currency + ' Please transfer the '+ tokenData.currency +' to our Escrow wallet address.</div><div style="padding: 10px 0 50px 0;text-align: center;"><span style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration: none;border-radius: 3px;letter-spacing: 0.3px;">' +walletAddress+ '</span></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help? <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify </a>Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';
  //
  //
	// 			return TokenSale.findOne({
	// 				where: {
	// 					email: email
	// 				}
	// 			}).then(function(result) {
	// 				if (!result) {
	// 					TokenSale.create(tokenData, {
	// 						validate: true
	// 					}).then(function(success) {
	// 						Users.update({
	// 							tokenSaleStatus: 1
	// 						}, {
	// 							where: {
	// 								email: email
	// 							}
	// 						}).then(function(success) {
	// 							return resolve("Your details has been saved. Also we have sent you details in mail.");
	// 						}).catch(function(err) {
	// 							return reject(err);
	// 						})
	// 					}).catch(function(err) {
	// 						return reject(err);
	// 					})
	// 				} else {
	// 					return reject("You have already registered for the token sale.");
	// 				}
	// 			}).catch(function(err) {
	// 				return reject(err);
	// 			});
	// 		} catch (err) {
	// 			return reject(err);
	// 		}
	// 	});
	// }

	this.addProfile = function(req) {
		return new Promise(function(resolve, reject) {
			try {
				var data = req.body;
				var files = req.files;
				var userData = data.project;
				if (typeof userData == "string") {
					var userData = JSON.parse(userData);
				}
				var userId = userData.userId;
				var walletAddress = userData.walletAddress;
				var purchaseCurrencyAddress = userData.purchaseCurrencyAddress
				var accountType = data.userAccountType;
				var Users = orm.model("User");

				return Users.findOne({
					where: {
						id: userId
					}
				}).then(function(user) {
					if (user) {
						if (user.userAccountType == "client") {
							var Client = orm.model("Client");
							return Client.create(userData, {
								validate: true
							}).then(function(user) {
								return Users.update({
									profileUpdateStatus: 1,
									walletAddress: walletAddress,
									purchaseCurrencyAddress: purchaseCurrencyAddress
								}, {
									where: {
										id: userId
									}
								}).then(function(success) {
									return resolve("Profile details added successfully");
								}).catch(function(err) {
									return reject(err);
								})
							}).catch(function(err) {
								return reject(err);
							})
						} else if (user.userAccountType == "developer") {
							if (files != null) {
								console.log("Fileee: ", req.files);

								if (((req.files.file.mimetype) != 'application/pdf') && ((req.files.file.mimetype) != 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') && ((req.files.file.mimetype) != 'application/msword')) {
						      console.log("Rejected by mimetype.");
						      return reject("Invalid file format.")
						    }
						    if ((path.extname(req.files.file.name) != '.pdf') && (path.extname(req.files.file.name) != '.docx') && (path.extname(req.files.file.name) != '.doc')) {
						      console.log("Rejected by file extension.");
						      return reject("Invalid file format.")
						    }

								let file = files.file;
								let filename = crypto.randomBytes(20).toString('hex');
								let extname = path.extname(file.name);
								var absPath = path.join(__dirname, 'public/shared/platform/developer_docs/' + filename + extname);
								var serverFilePath = httpMode + req.headers.host + 'public/shared/platform/developer_docs/' + filename + extname;
								file.mv(absPath, function(err) {
									if (err) {
										console.log("files Err : ", err);
										return reject({
											"error": err
										});
									}
									var Developer = orm.model("Developer");
									userData["attachmentPath"] = serverFilePath
									return Developer.create(userData, {
										validate: true
									}).then(function(user) {
										return Users.update({
											profileUpdateStatus: 1,
											walletAddress: walletAddress,
											purchaseCurrencyAddress: purchaseCurrencyAddress
										}, {
											where: {
												id: userId
											}
										}).then(function(success) {
											return resolve("Profile details added successfully");
										}).catch(function(err) {
											return reject(err);
										})
									}).catch(function(err) {
										return reject(err);
									});
								});
							} else {
								var Developer = orm.model("Developer");
								Developer.create(userData, {
									validate: true
								}).then(function(user) {
									return Users.update({
										profileUpdateStatus: 1,
										walletAddress: walletAddress,
										purchaseCurrencyAddress: purchaseCurrencyAddress
									}, {
										where: {
											id: userId
										}
									}).then(function(success) {
										return resolve("Profile details added successfully");
									}).catch(function(err) {
										return reject(err);
									});
								}).catch(function(err) {
									return reject(err);
								});
							}
						}
					} else {
						return reject("User not found!");
					}
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		})
	}


	this.getTokenSaleData = function(email) {
		return new Promise(function(resolve, reject) {
			try {
				var TokenSale = orm.model("TokenSale");
				return TokenSale.findOne({
					where: {
						email: email
					}
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


	    this.clientDashboard = function(clientId) {
        return new Promise(function(resolve, reject) {
            try {
                var result = {};
                var Project = orm.model("Project");
                return Project.count({
                    where: {
                        clientId: clientId
                    }
                }).then(function(postedProjects) {
                    result["postedProjects"] = postedProjects;
                    return Project.count({
                        where: {
                            clientId: clientId,
                            projectStatusId: 7
                        }
                    }).then(function(projectsCompleted) {
                        result["projectsCompleted"] = projectsCompleted;
                        return Project.count({
                            where: {
                                clientId: clientId,
                                projectStatusId: {
                                    [Op.gte]: 5,
                                    [Op.lt]: 7
                                }
                            }
                        }).then(function(ongingProject) {
                            result["ongingProject"] = ongingProject;
                            return Project.count({
                                where: {
                                    clientId: clientId,
                                    approvalFlag: 1,
                                    developerId: {
                                        [Op.ne]: 'null'
                                    }
                                }
                            }).then(function(developerSelectedForProjects) {
                                result["developerSelectedForProjects"] = developerSelectedForProjects;
																return Project.count().then(function(totalProjects) {
		                                result["totalProjects"] = totalProjects;
		                                return resolve(result);
		                            }).catch(function(err) {
		                                return reject(err);
		                            });
                            }).catch(function(err) {
                                return reject(err);
                            });
                        }).catch(function(err) {
                            return reject(err);
                        });
                    }).catch(function(err) {
                        return reject(err);
                    });
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err);
            }
        })
    }
		this.getAllProjectsCount = function() {
        return new Promise(function(resolve, reject) {
            try {
                var Project = orm.model("Project");
                return Project.count().then(function(result) {
                    return resolve(result);
                }).catch(function(err) {
                    return reject(err);
                });
            } catch (err) {
                return reject(err)
            }
        });
    }
    this.developerDashboard = function(userId) {
        return new Promise(function(resolve, reject) {
            try {
							console.log("UserId: ", userId);
                var result = {};
								var developerId = "";
                var Project = orm.model("Project");
                var AppliedProject = orm.model("AppliedProject");
								var Developer = orm.model("Developer");
								return Developer.findOne({
									where : {
										userId : userId
									}
								}).then(function(developer) {
									if (result) {
										developerId = developer.id;
										console.log("DevId: ", developerId);
									} else {
										return reject("No user found!");
									}
                	return AppliedProject.count({
                    where: {
                        developerId: developerId
                    }
                	}).then(function(appliedProjects) {
                    result["appliedProjects"] = appliedProjects;
                    return Project.count({
                        where: {
                            developerId: developerId,
                            projectStatusId: 7
                        }
                    }).then(function(projectsCompleted) {
                        result["projectsCompleted"] = projectsCompleted;
                        return Project.count({
                            where: {
                                developerId: developerId,
                                projectStatusId: {
                                    [Op.gte]: 5,
                                    [Op.lt]: 7
                                }
                            }
                        }).then(function(ongingProject) {
                            result["ongingProject"] = ongingProject;
                            return Project.count({
                                where: {
                                    developerId: developerId,
                                    approvalFlag: 1
                                }
                            }).then(function(clientsAcceptedDeveloper) {
                                result["clientsAcceptedDeveloper"] = clientsAcceptedDeveloper;
																return Project.count().then(function(totalProjects) {
		                                result["totalProjects"] = totalProjects;
		                                return resolve(result);
		                            }).catch(function(err) {
		                                return reject(err);
		                            });
                            }).catch(function(err) {
                                return reject(err);
                            });
                        }).catch(function(err) {
                            return reject(err);
                        });
                    }).catch(function(err) {
                        return reject(err);
                    });
                }).catch(function(err) {
                    return reject(err);
                });
							}).catch(function(err) {
								return reject(err);
							});
            } catch (err) {
                return reject(err);
            }
        })
    }

	this.sendUUIdConfirmation = function(emailConfirmationToken) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var User = orm.model("User");
				return User.findOne({
					where: {
						emailConfirmationToken: emailConfirmationToken
					}
				}).then(function(user) {
					if (!user)
						return reject("User not found!");
					var userEmail = user.email;
					var userUUId = user.uuid;
					var bcc = "";
					var body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px 0;font-size: 24px;text-align: left;line-height: 40px;">Hi ' + data.firstName + ' ' + data.lastName + ',<br> Your details has been saved. Thanks for registering for Hurify token sale on Token Lot.;</div><div style="padding: 10px 0 50px 0;text-align: center;"></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help? <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify </a>Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

					//var body = '<body style="background: #ffffff;-webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;"><div style="max-width: 560px;padding: 20px;background: #2C1D4F;border-radius: 5px;margin:40px auto;font-family: Open Sans,Helvetica,Arial;font-size: 15px;color: #666;"><div style="color: #ffffff;font-weight: normal;"><div style="text-align: center;font-weight:600;font-size:26px;padding: 10px 0;border-bottom: solid 3px #eeeeee;">Hurify</div><div style="clear:both"></div></div><div style="padding: 0 30px 30px 30px;border-bottom: 3px solid #eeeeee;"><div style="padding: 30px 0;font-size: 24px;color:#ffffff;text-align: center;line-height: 40px;">Thank you for the account activation.<span style="display: block;">Please find your Hurify Profile ID.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"> <h2 style="color:white; "">${userUUId}</h2></br></br></h3> This profile ID is required during token purchase. </h3></br></div><div style="padding: 15px;background: #eee;border-radius: 3px;text-align: center;">Need help? <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;">contact  us</a> today.</div></div><div style="color: #999;padding: 20px 30px"><div style="">Thank you!</div><div style="">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;">Hurify</a> Team</div></div></div></body>';

									var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];


					return coreapi.sendMail({
						"from": config.name_and_email,
						"to": userEmail,
						"bcc": bcc,
						"subject": 'UUId Confirmation',
						"body": body
					}).then(function(success) {
						if (success) {
							return resolve(true);
						} else {
							return reject("Failed to send mail!");
						}
					}).catch(function(err) {
						return reject(err);
					});
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err)
			}
		});
	}

	this.tokenForm1 = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var email = data.email;
				var TokenSale = orm.model("TokenSale");
				var User = orm.model("User");
				return TokenSale.findOne({
					where: {
						email: email
					}
				}).then(function(tokenResult) {
					if (tokenResult) {
						return reject("You are already registered.")
					} else {
						return TokenSale.create(data, {
							validate: true
						}).then(function(success) {
							return User.update({
								tokenSaleStatus: 1
							}, {
								where: {
									email: email
								},
								validate: true
							}).then(function(success) {
								return resolve("Successfully registered for Token Sale.");
							}).catch(function(err) {
								console.log("err1: ", err);
								return reject(err);
							});
						}).catch(function(err) {
							console.log("err2: ", err)
							return reject(err);
						})
					}
				}).catch(function(err) {
					console.log("err3: ", err)
					return reject(err);
				})
			} catch (err) {
				console.log("err4: ", err)
				return reject(err);
			}
		})
	}

	this.tokenForm2 = function(data) {
		return new Promise(function(resolve, reject) {
			try {
				var email = data.email;
				var User = orm.model("User");
				var TokenSale = orm.model("TokenSale");
				return TokenSale.findOne({
					where: {
						email: email
					}
				}).then(function(tokenResult) {
					if (tokenResult) {
						return TokenSale.update(data, {
							where: {
								email: email
							}
						}).then(function(success) {
							return User.update({
								tokenSaleStatus: data.tokenSaleStatus
							}, {
								where: {
									email: email
								},
								validate: true
							}).then(function(success) {
								return resolve("Successfully registered for Token Sale.");
							}).catch(function(err) {
								return reject(err);
							});
						}).catch(function(err) {
							return reject(err);
						})
					} else {
						return reject("Data for particular user doesn't exists.")
					}
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.tokenForm3 = function(data) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var walletAddress = '';
				if (data.currency == 'BTC') {
					walletAddress = "1QGXtg1k2FZPQdh1ZG79qatCeQ7wRGu5rM";
				} else if (data.currency == 'ETH') {
					walletAddress = "0xa1Cf400C056CF6D58c5efaD53E70919aFb95b466";
				} else if (data.currency == 'LTC') {
					walletAddress = "LM5gW296iwEsU7gx5KQZPjnhwRXVQUDLf4";
				} else if (data.currency == 'DASH') {
					walletAddress = "Xngzo7xuocwrkTT97n5MxfQCet1wX6XBRE";
				} else if (data.currency == 'BCH') {
					walletAddress = "1F2cpaJDgr9xi8ucpoyUME7um132mwdq1b";
				} else if (data.currency == 'BTG') {
					walletAddress = "3LCdYFYas3RpTQTiToiQQ8mxheFZ9ttygy";
				}
				var email = data.email;
				var User = orm.model("User");
				var TokenSale = orm.model("TokenSale");
				return TokenSale.findOne({
					where: {
						email: email
					}
				}).then(function(tokenResult) {
					if (tokenResult) {
						return TokenSale.update(data, {
							where: {
								email: email
							}
						}).then(function(success) {
							var from = config.name_and_email_2;
							var to = email;
							var bcc = "ico@hurify.co";
							var subject = "Hurify Token Sale";
							let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px 0;font-size: 24px;text-align: left;line-height: 40px;">Hi <b>' + data.firstName + ' ' + data.lastName + '</b>,<br> Welcome to hurify token pre-sale.\n You have chosen the option of purchasing tokens with <b>' + data.currency + '</b> Please transfer the <b>'+ data.currency +'</b> to our Escrow wallet address.</div><div style="padding: 10px 0 50px 0;text-align: center;"></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help? <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify </a>Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

									var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

							return coreapi.sendMail({
								"from": from,
								"to": to,
								"bcc" : bcc,
								"subject": subject,
								"body": body,
								"attachments" : attachments
							}).then(function(success) {
								if (success) {
									return User.update({
										tokenSaleStatus: data.tokenSaleStatus
									}, {
										where: {
											email: email
										},
										validate: true
									}).then(function(success) {
										return resolve("Your details has been saved. Also, we have sent you details in mail.");
									}).catch(function(err) {
										return reject(err);
									});
								} else {
									return reject("Failed to send confirmation email.");
								}
							}).catch(function(err) {
								return reject(err);
							});
						}).catch(function(err) {
							return reject(err);
						});
					} else {
						return reject("Data for particular user doesn't exists.")
					}
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}


	this.checkTokenAddressExistence = function(toAddress) {
		return new Promise(function(resolve, reject) {
			try {
				var TokenSale = orm.model("TokenSale");
				return TokenSale.findOne({
					where: {
						walletAddress: toAddress
					}
				}).then(function(result) {
					if (result) {
						return resolve("Success");
					} else {
						return reject("Email and Ethereum Address is not registered on Hurify. Please start your registration at http://hurify.co to continue!");
					}
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}


	this.getReferredUsersCount = function(referralCode) {
		return new Promise(function(resolve, reject) {
			try {
				var User = orm.model("User");
				return User.count({
					where: {
						referralCode: referralCode,
						active: 1
					}
				}).then(function(count) {
					return resolve(count);
				}).catch(function(err) {
					console.log("err1: ", err);
					return reject(err)
				});
			} catch (err) {
				console.log("err2: ", err);
				return reject(err);
			}
		});
	}

	this.getTotalStakesEarnedByUser = function(referralCode) {
					return new Promise( function(resolve, reject) {
						try {
							var User = orm.model("User");
							var TokenSale = orm.model("TokenSale");
							var ProductHunt = orm.model("ProductHunt");
							var TelegramBounty = orm.model("TelegramBounty");
							var counts = {};
							return User.count({
								where : {
									referralCode : referralCode,
									active : 1
								}
							}).then(function(signupCount) {
								counts["signupCount"] = signupCount;

								return TokenSale.count({
									where : {
										referralCode : referralCode,
									}
								}).then(function(TokenSaleCount) {
									counts["TokenSaleCount"] = TokenSaleCount;
									return ProductHunt.count({
										where : {
											referralCode : referralCode,
										}
									}).then(function(ProductHuntCount) {
										counts["ProductHuntCount"] = ProductHuntCount;
										return TelegramBounty.count({
											where : {
												referralCode : referralCode,
											}
										}).then(function(TelegramBountyCount) {
											counts["TelegramBountyCount"] = TelegramBountyCount;
											return resolve(counts)
										}).catch(function(err) {
											return reject(err);
										});
									}).catch(function(err) {
										return reject(err);
									});
								}).catch(function(err) {
									return reject(err);
								});
							}).catch(function(err) {
								return reject(err);
							});
						} catch (err) {
							return reject(err);
						}
					})
				}


	this.checkIfReferralCodeExists = function(userId) {
		return new Promise(function(resolve, reject) {
			try {
				var User = orm.model("User");
				return User.findOne({
					where: {
						id: userId
					}
				}).then(function(userData) {
					if (userData.referrerCode == null) {
						return resolve({
							success: false
						})
					} else {
						return resolve({
							success: true
						})
					}
				}).catch(function(err) {
					return reject(err)
				});
			} catch (err) {
				return reject(err);
			}
		});
	}
	this.addReferralCode = function(userId) {
		return new Promise(function(resolve, reject) {
			try {
				var User = orm.model("User");
				var referrerCode = crypto.randomBytes(3).toString('hex');
				return User.update({
					referrerCode: referrerCode
				}, {
					where: {
						id: userId
					}
				}).then(function(updated) {
					return resolve({
						success: true
					});
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		});
	}

	this.getReferralCode = function(userId) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var User = orm.model("User");
				return User.findOne({
					where: {
						id: userId
					}
				}).then(function(userData) {
					return resolve({
						referrerCode : userData.referrerCode
					});
				}).catch(function(err) {
					return reject(err);
				});

				// return coreapi.checkIfReferralCodeExists(userId).then(function(result) {
				// 	if (result.success == false) {
				// 		return coreapi.addReferralCode(userId).then(function(inserted) {
				// 			if (inserted.success) {
				// 				return User.findOne({
				// 					where: {
				// 						id: userId
				// 					}
				// 				}).then(function(userData) {
				// 					var referralLink = "https://platform.hurify.co/register/" + userData.referrerCode
				// 					var to = userData.email;
				// 					var bcc = "ico@hurify.co";
				// 					var subject = "Referral code";
				// 					var body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for signing up!<span style="display: block;">Please share the following link to refer Hurify Platform to your friends and family.</span></div><div style="padding: 10px 0 50px 0;text-align: center;"><a href="' + url + '" style="background: #2f6668;color: #fff;padding: 12px 30px;text-decoration: none;border-radius:3px;letter-spacing: 0.3px;">' +referralLink+ '</a></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';
        //
				// 					var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];
        //
				// 					return coreapi.sendMail({
				// 						"from": config.name_and_email_3,
				// 						"to": to,
				// 						"bcc": bcc,
				// 						"subject": subject,
				// 						"body": body,
				// 						"attachments" : attachments
				// 					}).then(function(success) {
				// 						return resolve({
				// 							"userData": userData,
				// 							"message": "Successfully generated the referral code."
				// 						});
				// 					}).catch(function(err) {
				// 						console.log("err: ", err);
				// 						return reject(err);
				// 					});
				// 				}).catch(function(err) {
				// 					console.log("err1: ", err);
				// 					return reject(err);
				// 				});
				// 			} else {
				// 				console.log("err2: ", err);
				// 				return reject("Failed to add referral code.")
				// 			}
				// 		}).catch(function(err) {
				// 			console.log("err3: ", err);
				// 			return reject(err);
				// 		})
				// 	} else {
				// 		return User.findOne({
				// 			where: {
				// 				id: userId
				// 			}
				// 		}).then(function(userData) {
				// 			return resolve({
				// 				"userData": userData
				// 			});
				// 		}).catch(function(err) {
				// 			console.log("err4: ", err);
				// 			return reject(err);
				// 		});
				// 	}
				// })
			} catch (err) {
				console.log("err5: ", err);
				return reject(err);
			}
		});
	}

	this.checkIfAirDropDataExists = function(userId) {
		return new Promise(function(resolve, reject) {
			try {
				var Airdrop = orm.model("Airdrop");
				return Airdrop.findOne({
					where: {
						userId: userId
					}
				}).then(function(result) {
					if (result) {
						return resolve({
							success: true
						})
					} else {
						return resolve({
							success: false
						})
					}
				}).catch(function(err) {
					console.log("err4 ", err);
					return reject(err);
				});
			} catch (err) {
				console.log("err5 ", err);
				return reject(err);
			}
		});
	}
	this.addAirDropData = function(data) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var userId = data.userId;
				var Airdrop = orm.model("Airdrop");
				var User = orm.model("User");
				var Profile = "";
				return Airdrop.create(data, {
					validate: true
				}).then(function(created) {
					// return resolve("Data saved successfully.");
					return User.findOne({
						where: {
							id: userId
						}
					}).then(function(result) {
						console.log("Result: ", result);
						if (result.userAccountType == 'client') {
							Profile = orm.model("Client");
						} else if (result.userAccountType == 'developer') {
							Profile = orm.model("Developer");
						}
						return Profile.findOne({
							where: {
								userId: userId
							}
						}).then(function(profile) {
							var name = profile.name;
							var from = config.name_and_email_2;
							var to = result.email;
							var bcc = "ico@hurify.co";
							var subject = "Hurify Airdrop";
							var body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: left;line-height: 40px;">Hi ' + name + ',<br> Your Airdrop wallet address:<br> ' + data.walletAddress + '<br> has been recorded. We shall be deploying 100 stakes as a reward. Thank you for your interest in Hurify Platform.</div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

									var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

							return coreapi.sendMail({
								"from": from,
								"to": to,
								"bcc": bcc,
								"subject": subject,
								"body": body,
								"attachments" : attachments
							}).then(function(success) {
								return resolve("Your details has been saved. Also, we have sent you details in mail.");
							}).catch(function(err) {
								console.log("Err1: ", err);
								return reject(err);
							});
						}).catch(function(err) {
							console.log("Err2: ", err);
							return reject(err);
						});
					}).catch(function(err) {
						console.log("Err3: ", err);
						return reject(err);
					})
				}).catch(function(err) {
					console.log("Err4: ", err);
					return reject(err);
				});
			} catch (err) {
				console.log("Err5: ", err);
				return reject(err);
			}
		});
	}

	this.getAirDropData = function(userId) {
		return new Promise(function(resolve, reject) {
			try {
				var Airdrop = orm.model("Airdrop");
				return Airdrop.findOne({
					where: {
						userId: userId
					}
				}).then(function(result) {
					return resolve(result);
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		});
	}


	this.addUserQuery = function (queryData) {
				  var coreapi = this;
				  return new Promise(function(resolve, reject) {
				    try {
							console.log("check1: ");
				      var UserQuery = orm.model("UserQuery");
							var attachments = "";
				      return UserQuery.findOne({
				        where : {
				          email : queryData.email,
				          subject : queryData.subject,
				          query : queryData.query
				        }
				      }).then(function(result) {
								console.log("check2: ");
				        if (result) {
				          return reject("Query/Issue already submitted");
				        } else {
									console.log("check3: ");
				          return UserQuery.create(queryData).then(function(inserted) {
										console.log("check4: ");
				            var fromAddress = config.name_and_email;
				            var toAddress = "support@hurify.co";
				            var bccAddress = "ico@hurify.co";
				            var sub = queryData.subject;
				            var query = '<body> From: ' + queryData.email+ '<br><br> Query: ' +queryData.query+ '</body>'


				            return coreapi.sendMail({
				              "from" : fromAddress,
				              "to": toAddress,
				              "bcc" : bccAddress,
				              "subject": sub,
				              "body": query,
											"attachments" : attachments
				            }).then(function(success) {
											console.log("check5: ");
				              var from = "support@hurify.co";
				              var to = queryData.email;
											var bcc = "";
				              var subject = "Query/Issue";
											let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Dear User, <br> Thank you for writing to us. We have received your query/issue, and we shall get back to you soon.</div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

											attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];



				              return coreapi.sendMail({
				                "from" : from,
				                "to": to,
				                "bcc" : bccAddress,
				                "subject": subject,
				                "body": body,
												"attachments" : attachments
				              }).then(function(success) {
												console.log("check6: ");
				                return resolve("Successfully submitted Query/Issue");
				              }).catch(function(err) {
				                console.log("Err1: ", err);
				                return reject(err);
				              });
				            }).catch(function(err) {
				              console.log("Err2: ", err);
				              return reject(err);
				            });
				          }).catch(function(err) {
				            console.log("Err3: ", err);
				            return reject(err);
				          })
				        }
				      }).catch(function(err) {
				        console.log("Err4: ", err);
				        return reject(err);
				      })
				    } catch (err) {
				      console.log("Err5: ", err);
				      return reject(err);
				    }
				  })
				}


	this.checkIfTokenSaleWhiteListDataExists = function(email) {
		return new Promise(function(resolve, reject) {
			try {
				var TokenSaleWhiteList = orm.model("TokenSaleWhiteList");
				TokenSaleWhiteList.findOne({
					where: {
						email: email
					}
				}).then(function(result) {
					if (result) {
						return resolve({
							success: true
						});
					} else {
						return resolve({
							success: false
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

	this.addTokenSaleWhiteListData = function(tokenSaleWhiteListData) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var email = tokenSaleWhiteListData.email;
				var TokenSaleWhiteList = orm.model("TokenSaleWhiteList");
				return coreapi.checkIfTokenSaleWhiteListDataExists(email).then(function(checked) {
					console.log("Success: ", checked);
					if (checked.success) {
						return reject("Data with this email already exists.");
					} else {
						console.log("check1: ");
						return TokenSaleWhiteList.create(tokenSaleWhiteListData).then(function(created) {
							var from = config.name_and_email_2;
							var to = email;
							var bcc = "ico@hurify.co";
							var subject = "Token sale white list";
							let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: left;line-height: 40px;">Dear User, <br> Your data has been recorded. <br> We thank you for your interest in the Hurify Platform and TokenSale.<br>You can initiate your purchase once the TokenSale is live, stay tuned for an announcement for the same.</div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

									var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

							console.log("check2: ");
							return coreapi.sendMail({
								"from": from,
								"to": to,
								"bcc": bcc,
								"subject": subject,
								"body": body,
								"attachments" : attachments
							}).then(function(success) {
								console.log("check3: ");
								return resolve("Your details has been saved successfully");
							}).catch(function(err) {
								console.log("Err1: ", err);
								return reject(err);
							});
						}).catch(function(err) {
							console.log("Err2: ", err);
							return reject(err);
						});
					}
				}).catch(function(err) {
					console.log("Err3: ", err);
					return reject(err);
				});
			} catch (err) {
				console.log("Err4: ", err);
				return reject(err);
			}
		});
	}

	this.getTokenSaleWhiteListData = function(tokenSaleWhiteListData) {
		return new Promise(function(resolve, reject) {
			try {
				var email = tokenSaleWhiteListData.email;
				var TokenSaleWhiteList = orm.model("TokenSaleWhiteList");
				TokenSaleWhiteList.findOne({
					where: {
						email: email
					}
				}).then(function(result) {
					return resolve(result);
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		});
	}


	this.getUserDetails = function(userId) {
		return new Promise(function(resolve, reject) {
			try {
				var User = orm.model("User");
				return User.findOne({
					where: {
						id: userId
					}
				}).then(function(result) {
					if (result) {
						return resolve(result);
					} else {
						return reject("User doesn't exists.")
					}
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.checkIfTokenSaleDataExists = function(email) {
		return new Promise(function(resolve, reject) {
			try {
				var TokenSale = orm.model("TokenSale");
				return TokenSale.findAll({
					where: {
						email: email
					}
				}).then(function(allData) {
					if(allData) {
						return TokenSale.findOne({
							where : {
								email : email,
								transactionHash : {
									[Op.eq] : null
								}
							}
						}).then(function(singleData) {
							if (singleData) {
								return resolve({
									success: true,
									"allData" : allData,
									"singleData" : singleData
								});
							} else {
								return resolve({
									success: true,
									"allData" : allData,
									"singleData" : null
								});
							}
						}).catch(function(err) {
							return reject(err);
						});
					} else {
						return resolve({success: false});
					}
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err);
			}
		});
	}

	this.getTokenCurrencyAndWalletAddress = function(email) {
		return new Promise(function(resolve, reject) {
			try {
				var TokenSale = orm.model("TokenSale");
				return TokenSale.findOne({
					where: {
						email: email
					}
				}).then(function(result) {
					var walletAddress = '';
					if (result.currency == 'BTC') {
						walletAddress = "1QGXtg1k2FZPQdh1ZG79qatCeQ7wRGu5rM";
					} else if (result.currency == 'ETH') {
						walletAddress = "0xa1Cf400C056CF6D58c5efaD53E70919aFb95b466";
					} else if (result.currency == 'LTC') {
						walletAddress = "LM5gW296iwEsU7gx5KQZPjnhwRXVQUDLf4";
					} else if (result.currency == 'DASH') {
						walletAddress = "Xngzo7xuocwrkTT97n5MxfQCet1wX6XBRE";
					} else if (result.currency == 'BCH') {
						walletAddress = "1F2cpaJDgr9xi8ucpoyUME7um132mwdq1b";
					} else if (result.currency == 'BTG') {
						walletAddress = "3LCdYFYas3RpTQTiToiQQ8mxheFZ9ttygy";
					}
					return resolve({
						currency: result.currency,
						walletAddress: walletAddress
					});
				}).catch(function(err) {
					return reject(err);
				})
			} catch (err) {
				return reject(err);
			}
		})
	}

	this.getTokensaleUsers = function() {
		return new Promise(function(resolve, reject) {
			try {
				var TokenSale = orm.model("TokenSale");
				var User = orm.model("User");
				return User.findAll({
					where: {
						tokenSaleStatus : 2
					}
				}).then(function(users) {
					var usersObj = {};
					for (var i = 0; i < users.length; i++) {
						let user = users[i];
						usersObj[user.email] = user;
					}
					console.log(usersObj);
					return TokenSale.findAndCountAll({
						where: {
							isMailSent : 0
						}
					}).then(function(result) {
						var finalArray = [];
						var results = result.rows;
						for (var i = 0; i < results.length; i++) {
							let customer = results[i];
							if (customer.email in usersObj) {
								finalArray.push(customer);
							}
						}
						return resolve({count : finalArray.length, rows : finalArray});
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

	this.updateTokenSaleDataWithNoOfTokens = function(data) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				console.log("Data: ", data);
				var customerId = data.customerId;
				var noOfTokens = data.noOfTokens;
				var HURTransactionHash = data.HURTransactionHash;
				var TokenSale = orm.model("TokenSale");
				return TokenSale.findOne({
					where: {
						id : customerId
					}
				}).then(function(customer) {
					if (customer) {
						var to = customer.email;
						var bcc = "ico@hurify.co";
						var subject = "Hurify Tokens Delivered to your ETH Wallet";
						var bcc = "ico@hurify.co";
						var body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div><br><br>Hi ' +customer.firstName+ ',<br><br>Hope you are doing good. Thanks for your Hurify Token purchase.<br><br>' +noOfTokens+ ' HUR Tokens have been sent to your ETH Wallet.<br><br>The confirmation is available on Ethereum Blockchain\'s here:<br>https://ethplorer.io/address/' +customer.walletAddress+ '<br><br>To Add HUR Tokens in your MyEtherWallet: Visit MEW (www.myetherwallet.com) and go to the “View Wallet Info” page:<br> Step:1 Click “Add Custom Token” <br>Step:2 Enter the contract address (0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47) and number of decimals (18) Add the token symbol (HUR)<br> Step:3 Click “Save”.<br><br>To Add HUR Tokens in your In MetaMask:<br> Step:1 Go to you MeteMask wallet and select "Tokens" Tab <br>Step:2 Click "Add Token" <br>Step:3 Enter the contract address (0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47) and number of decimals (18) Add the token symbol (HUR) <br>Step:4 Click “Save”.<br><br>Shoot me a mail back for any questions.<br><br>All the Best!!!<br><br><br><br>Cheers!<br>Tim Galvin,<br>Program Management Officer@Hurify Inc<br><br><div style = "text-align:center;"><span><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div></div>';

									var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

						return coreapi.sendMail({
							"from": config.name_and_email_2,
							"to": to,
							"bcc": bcc,
							"subject": subject,
							"body": body,
							"attachments" : attachments
						}).then(function(success) {
							customer['isMailSent'] = 1;
							customer['noOfTokens'] = noOfTokens;
							customer['HURTransactionHash'] = HURTransactionHash;
							return customer.save().then(function(success) {
								return resolve("Successfully sent mail!!");
							}).catch(function(err) {
								return reject(err);
							});
						}).catch(function(err) {
							console.log("Err: ", err);
							return reject(err);
						});
					} else {
						return reject("Customer Not Found!");
					}
				}).catch(function(err) {
					console.log(err)
					return reject(err);
				});
			} catch (err) {
				console.log(err)
				return reject(err)
			}
		})
	}

	this.getAllUnsolvedUserQueries = function() {
					return new Promise(function(resolve, reject) {
						try {
							var UserQuery = orm.model("UserQuery");
							return UserQuery.findAll({
								where : {
									status : 0
								}
							}).then(function(result) {
								if (result) {
									console.log("Result: ", result);
									return resolve(result);
							  } else {
									return resolve ("No Data");
								}
							}).catch(function(err) {
								return reject(err);
							});
						} catch (err) {
							return reject(err);
						}
					})
				}


				this.getUserQueryById = function(queryId) {
					return new Promise (function (resolve, reject) {
						try {
							var UserQuery = orm.model("UserQuery");
							return UserQuery.findOne({
								where : {
									id : queryId
								}
							}).then(function (result) {
								return resolve (result);
							}).catch(function (err) {
								return reject (err);
							});
						} catch (err) {
							return reject(err);
						}
					})
				}

				this.sendResolutionForUserQuery = function(queryData) {
					var coreapi = this;
					return new Promise( function( resolve , reject) {
						try {
							var UserQuery = orm.model("UserQuery");
							var queryId = queryData.queryId;
							var email = queryData.email;
							return UserQuery.update({resolution : queryData.resolution, status : 1}, {
								where : {
									id : queryId
								}
							}).then(function (updated) {
								var from = "support@hurify.co";
								var to = email;
								var bcc = "ico@hurify.co";
								var subject = "Resolution for - " + queryData.subject;
								let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px 0;font-size: 24px;text-align: center;line-height: 40px;">Dear User, <br> ' +queryData.resolution+ '</div><div style="padding: 10px 0 50px 0;text-align: center;"></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help? <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify </a>Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

									var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

								return coreapi.sendMail({
									"from" : from,
									"to": to,
									"bcc" : bcc,
									"subject": subject,
									"body": body,
									"attachments" : attachments
								}).then(function(success) {
									return resolve ("Resolution successfully sent to user.");
								}).catch(function(err) {
									console.log("Err1: ", err);
									return reject(err);
								});
							}).catch(function(err) {
								console.log("Err2: ", err);
								return reject (err);
							})
						} catch (err) {
							console.log("Err3",err);
							return reject (err);
						}
					})
				}

				this.checkIfReferralCodeIsOfSameUser = function(data) {
									return new Promise(function(resolve, reject) {
										try {
											var User = orm.model("User");
											return User.findOne({
												where: {
													email : data.email
												}
											}).then(function(user) {
												if (user.referrerCode == data.referralCode) {
													return resolve({ success : true });
												} else {
													return resolve({ success : false });
												}
											})
										} catch (err) {
											return reject(err);
										}
									})
								}


				this.checkIfTelegramBountyDataExists = function(email) {
					return new Promise(function(resolve, reject) {
						try {
							var TelegramBounty = orm.model("TelegramBounty");
							return TelegramBounty.findOne({
								where : {
									email : email
								}
							}).then(function(TelegramData) {
								if (TelegramData) {
									return resolve({ success : true });
								} else {
									return resolve({ success : false });
								}
							}).catch(function(err) {
								return reject(err);
							})
						} catch (err) {
							return reject(err);
						}
					})
				}

				/*this.addTelegramBountyData = function(telegramData) {
					var coreapi = this;
					return new Promise(function(resolve, reject) {
						try {
							console.log("TelegramData: ", telegramData);
							var email = telegramData.email;
							var TelegramBounty = orm.model("TelegramBounty");
							return coreapi.checkIfTelegramBountyDataExists(email).then(function(result) {
								if (result.success) {
									return reject("Already submitted the bounty data")
								} else {
									coreapi.checkIfReferralCodeIsOfSameUser(telegramData).then(function(isSame) {
										if (isSame.success) {
											return reject("You can not enter your own referral code.");
										} else {
											return TelegramBounty.create(telegramData).then(function(success) {
											  var to = email;
											  var bcc = "ico@hurify.co";
											  var subject = "Telegram Bounty Program";
											  let body = '<div style = "text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for your interest in Telegram Bounty Program.<br> We shall be deploying 200 stakes to the ERC20 wallet address provided by you.</div><div style="margin:auto;width:30%;padding:15px;background:#eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

											var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

											  return coreapi.sendMail({
											    "from" : config.name_and_email_2,
											    "to": to,
											    "subject": subject,
											    "body": body,
											    "bcc" : bcc,
											    "attachments" : attachments
											  }).then(function(success) {
											    if (success) {
											      return resolve("Thank you. Your data has been submitted successfully");
											    } else {
											      return reject("Failed to send confirmation email!");
											    }
											  }).catch(function(err) {
											    console.log();
											    return reject(err);
											  });
											}).catch(function(err) {
											  console.log("Err1: ", err);
											  return reject(err);
											})
										}
									}).catch(function(err) {
										return reject(err);
									});
								}
							}).catch(function(err) {
								console.log("Err2: ", err);
								return reject(err);
							})
						} catch (err) {
							console.log("Err3: ", err);
							return reject(err);
						}
					})
				}
				*/

				this.getTelegramBountyDataByEmail = function(email) {
					return new Promise(function(resolve, reject) {
						try {
							var TelegramBounty = orm.model("TelegramBounty");
							return TelegramBounty.findOne({
								where : {
									email : email
								}
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

				this.getAllTelegramBountyData = function() {
					return new Promise(function(resolve, reject) {
						try {
							var TelegramBounty = orm.model("TelegramBounty");
							return TelegramBounty.findAll().then(function(result) {
								return resolve(result);
							}).catch(function(err) {
								return reject(err);
							})
						} catch (err) {
							return reject(err);
						}
					})
				}

				this.checkIfProductHuntBountyDataExists = function(email) {
					return new Promise(function(resolve, reject) {
						try {
							var ProductHunt = orm.model("ProductHunt");
							return ProductHunt.findOne({
								where : {
									email : email
								}
							}).then(function(result) {
								if (result) {
									return resolve({ success : true });
								} else {
									return resolve({ success : false });
								}
							}).catch(function(err) {
								return reject(err);
							})
						} catch (err) {
							return reject(err);
						}
					})
				}

				this.addProductHuntBountyData = function(productHuntData) {
					var coreapi = this;
					return new Promise(function(resolve, reject) {
						try {
							console.log("ProductHunt: ", productHuntData);
							var email = productHuntData.email;
							var ProductHunt = orm.model("ProductHunt");
							return coreapi.checkIfProductHuntBountyDataExists(email).then(function(result) {
								if (result.success) {
									return reject("Already submitted the bounty data")
								} else {
									return coreapi.checkIfReferralCodeIsOfSameUser(productHuntData).then(function(isSame) {
										if(isSame.success) {
											return reject("You can not enter your own referral code.");
										} else {
											return ProductHunt.create(productHuntData).then(function(success) {
											  var to = email;
											  var bcc = "ico@hurify.co";
											  var subject = "Product Hunt Bounty Program";
											  let body = '<div style="text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for your interest in Product Hunt Bounty Program.<br> Hurify offers free stakes for the Upvotes on Hurify product in Product Hunt. <br>Each registered user in product hunt who Upvote Hurify product can submit this form with a valid Product Hunt Id and a valid ERC20 wallet address, you will be rewarded 100 stakes of HUR tokens.</div><div style="margin:auto;width:30%;padding:15px;background:#eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

											var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

											  return coreapi.sendMail({
											    "from" : config.name_and_email_2,
											    "to": to,
											    "subject": subject,
											    "body": body,
											    "bcc" : bcc,
											    "attachments" : attachments
											  }).then(function(success) {
											    if (success) {
											      return resolve("Thank you. Your data has been submitted successfully");
											    } else {
											      return reject("Failed to send confirmation email!");
											    }
											  }).catch(function(err) {
											    console.log();
											    return reject(err);
											  });
											}).catch(function(err) {
											  console.log("Err1: ", err);
											  return reject(err);
											})
										}
									}).catch(function(err) {
										return reject(err);
									});
								}
							}).catch(function(err) {
								console.log("Err2: ", err);
								return reject(err);
							})
						} catch (err) {
							console.log("Err3: ", err);
							return reject(err);
						}
					})
				}

				this.getProductHuntBountyDataByEmail = function(email) {
					return new Promise(function(resolve, reject) {
						try {
							var ProductHunt = orm.model("ProductHunt");
							return ProductHunt.findOne({
								where : {
									email : email
								}
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

				this.getAllProductHuntBountyData = function() {
					return new Promise(function(resolve, reject) {
						try {
							var ProductHunt = orm.model("ProductHunt");
							return ProductHunt.findAll().then(function(result) {
								return resolve(result);
							}).catch(function(err) {
								return reject(err);
							})
						} catch (err) {
							return reject(err);
						}
					})
				}

				this.checkIfKYCDataExists = function(email) {
									return new Promise( function ( resolve, reject) {
										try {
											var TokenSale = orm.model("TokenSale");
											return TokenSale.findOne({
												where : {
													email : email
												}
											}).then(function(result) {
												if (!result) {
													return resolve( { success : false } )
												} else {
													return resolve( { success : true, result : result } )
												}
											}).catch(function(err) {
												return reject(err);
											})
										} catch ( err ) {
											return reject (err);
										}
									})
								}



								this.addKYCdata = function(KYCData) {
									var coreapi = this;
									return new Promise(function(resolve, reject) {
										try {

											if (KYCData.country != KYCData.userSelectedCountry) {
												KYCData.riskFlag = 1;
											}

											var email = KYCData.email;
											var from = config.name_and_email_2;
											var to = email;
											var bcc = "ico@hurify.co";
											var subject = "KYC Program";
											let body = '<div style="text-align:center;"><span><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></span></div><div style="align:middle;padding: 30px;font-size: 24px;text-align: center;line-height: 40px;">Thank you for your interest in Hurify.<br> Your KYC data has been recorded.</div><div style="margin:auto;width:30%;padding:15px;background:#eee;border-radius: 3px;text-align:center;">Need help?  <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify</a> Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

										var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];


											var email = KYCData.email;
											var TokenSale = orm.model("TokenSale");
											var User = orm.model("User");
											return User.findOne({
												where : {
													email : email
												}
											}).then(function(result) {
												if (result.tokenSaleStatus == 0) {
													//addKYCdata
													return TokenSale.create(KYCData).then(function(success) {
														return User.update({KYCFlag : 1},{
															where : {
																email : email
															}
														}).then(function(updated) {

															return coreapi.sendMail({
														    "from" : from,
														    "to": to,
														    "subject": subject,
														    "body": body,
														    "bcc" : bcc,
														    "attachments" : attachments
														  }).then(function(success) {
														    if (success) {
														      return resolve("Thank you. Your data has been submitted successfully");
														    } else {
														      return reject("Failed to send confirmation email!");
														    }
														  }).catch(function(err) {
														    console.log();
														    return reject(err);
														  });

															// return resolve("successfully added KYCData.");
														}).catch(function(err) {
															return reject(err);
														});
													}).catch(function(err) {
														return reject(err);
													});
												} else {
													//updateKYCData
													return TokenSale.update(KYCData, {
														where : {
															email : email
														}
													}).then(function(success) {
														return User.update({KYCFlag : 1},{
															where : {
																email : email
															}
														}).then(function(updated) {

															return coreapi.sendMail({
														    "from" : from,
														    "to": to,
														    "subject": subject,
														    "body": body,
														    "bcc" : bcc,
														    "attachments" : attachments
														  }).then(function(success) {
														    if (success) {
														      return resolve("Thank you. Your data has been submitted successfully");
														    } else {
														      return reject("Failed to send confirmation email!");
														    }
														  }).catch(function(err) {
														    console.log();
														    return reject(err);
														  });
														}).catch(function(err) {
															return reject(err);
														});
													}).catch(function(err) {
														return reject(err);
													});
												}
											}).catch(function(err) {
												return reject(err);
											})

										} catch (err) {
											return reject(err);
										}
									})
								}

								this.updateTokenSaleData = function(tokenData) {
										var coreapi = this
										return new Promise(function(resolve, reject) {
											try {
												console.log("check1:");
												var walletAddress = '';
												if (tokenData.currency == 'BTC') {
													walletAddress = "1QGXtg1k2FZPQdh1ZG79qatCeQ7wRGu5rM";
												} else if (tokenData.currency == 'ETH') {
													walletAddress = "0xa1Cf400C056CF6D58c5efaD53E70919aFb95b466";
												} else if (tokenData.currency == 'LTC') {
													walletAddress = "LM5gW296iwEsU7gx5KQZPjnhwRXVQUDLf4";
												} else if (tokenData.currency == 'DASH') {
													walletAddress = "Xngzo7xuocwrkTT97n5MxfQCet1wX6XBRE";
												} else if (tokenData.currency == 'BCH') {
													walletAddress = "1F2cpaJDgr9xi8ucpoyUME7um132mwdq1b";
												} else if (tokenData.currency == 'BTG') {
													walletAddress = "3LCdYFYas3RpTQTiToiQQ8mxheFZ9ttygy";
												}
												if (tokenData.transactionHash == "") {
													tokenData.transactionHash = null;
												}
												var email = tokenData.email;
												var TokenSale = orm.model("TokenSale");
												var User = orm.model("User");
												return User.findOne({
													where : {
														email : email
													}
												}).then(function(result) {
													if(tokenData.referralCode == result.referrerCode) {
														console.log("Invalid referral code.");
														return reject("Invalid referral code.");
													}
													console.log("check2:");
													if (result.KYCFlag == 0) {
														//addTokenSaledata
														return TokenSale.create(tokenData).then(function(success) {
															console.log("check3:");
															return User.update({tokenSaleStatus : 1}, {
																where : {
																	email : email
																}
															}).then(function(updated) {
																console.log("check4:");
																return resolve(success.id)
															}).catch(function(err) {
																console.log("Err: ", err);
																return reject(err);
															});
														}).catch(function(err) {
															console.log("Err1: ", err);
															return reject(err);
														});
													} else {
														//updateTokenSaleData
														console.log("In Else Part.");
														return TokenSale.update(tokenData, {
															where : {
																email : email
															}
														}).then(function(success) {
															console.log("success: ", success );
															var id = success.id;
															return TokenSale.findOne({
																where : {
																	email : email
																}
															}).then(function(result) {
																return User.update({tokenSaleStatus : 1}, {
																	where : {
																		id : result.id
																	}
																}).then(function(updated) {
																	return resolve(result.id);
																}).catch(function(err) {
																	console.log("Err2: ", err);
																	return reject(err);
																});
															}).catch(function(err) {
																return reject(err);
															})
														}).catch(function(err) {
															console.log("Err3: ", err);
															return reject(err);
														});
													}
												}).catch(function(err) {
													console.log("Err4: ", err);
													return reject(err);
												})
											} catch (err) {
												console.log("Err5: ", err);
												return reject(err);
											}
										})
									}


									this.checkIfTransactionHashExistsWithSameEmail  = function(transactionHash, email) {
										return new Promise(function(resolve, reject) {
											try {
												var TokenSale = orm.model("TokenSale");
												return TokenSale.findOne({
													where : {
														transactionHash : transactionHash,
														email: email
													}
												}).then(function(result) {
													if (result) {
														return resolve({success: true, data : result})
													} else {
														return resolve({success: false})
													}
												}).catch(function(err) {
													return reject(err);
												})
											} catch(err) {
												return reject(err);
											}
										})
									}

									this.checkIfTransactionHashExists = function(transactionHash) {
										return new Promise(function(resolve, reject) {
											try {
												var TokenSale = orm.model("TokenSale");
												return TokenSale.findOne({
													where : {
														transactionHash : transactionHash
													}
												}).then(function(result) {
													if (result) {
														return resolve({success: true, data : result})
													} else {
														return resolve({success: false})
													}
												}).catch(function(err) {
													return reject(err);
												})
											} catch(err) {
												return reject(err);
											}
										})
									}


									this.updateTokenSaleWithTransactionHash = function(tokenData) {
									  var coreapi = this;
									  return new Promise(function(resolve, reject) {
									    try {
									      console.log("Initial tokendata:   ",tokenData);
												var email = tokenData.email;
												var blackList = 0;
									      var TokenSale = orm.model("TokenSale");
												var User = orm.model("User");
									      return coreapi.checkIfTransactionHashExistsWithSameEmail(tokenData.transactionHash, tokenData.email).then(function(result) {
									        if (result.success == true) {
									          return reject("Transaction Hash already submitted.");
									        }
									        return coreapi.checkIfTransactionHashExists(tokenData.transactionHash).then(function(result) {
									          if (result.success == true) {
									            tokenData["dispute"] = 1;
									            tokenData["status"] = "Dispute";
									            delete tokenData.email;
															blackList = 1;
									          }
									          console.log("Final tokendata:   ",tokenData);
														console.log("Email: ", email);
									          return TokenSale.findOne({
									            where : {
									              id: tokenData.tokenSaleId
									            }
									          }).then(function(result) {
									          console.log("result: ", result);
									          console.log("toMail: ", result.email);
									          var email = result.email;
									            return TokenSale.update(tokenData, {
									              where : {
									                id : tokenData.tokenSaleId
									              }
									            }).then(function(success) {
									              var from = config.name_and_email_2;
									              var to = email;
									              var bcc = "ico@hurify.co";
									              var subject = "Hurify Token Sale";
									              var body = '<div style = "text-align:center;"><a href="https://platform.hurify.co"><img src="cid:image1" style = "display:block;margin-left:auto;margin-right:auto;" width="100px"></a></div><div style="align:middle;padding: 30px 0;font-size: 24px;text-align: left;line-height: 40px;">Dear User,<br> We thank you for the purchase of HUR tokens.<br> Your choice of currency : ' + result.currency + '<br> Number of ' + result.currency + ' : ' + result.numberOfCryptoCurrency + '<br> Hurify Escrow wallet address : ' +tokenData.escrowWalletAddress+ ' <br> Transaction Hash: ' +tokenData.transactionHash+ '<br> Upon completion of Token Sale(28-02-2018), successful validation of the transaction and KYC/AML, HUR tokens shall be deployed to the Ethereum wallet address provided by you.<br>HUR token details to be added in your ERC20 Ethereum wallet address<br>Token Contract Address: 0xcdb7ecfd3403eef3882c65b761ef9b5054890a47<br>Token Symbol: HUR<br>Decimals: 18<br> For any queries, mail us at <a href ="mailto:support@hurify.co">Support</a></div><div style="margin:auto;width:30%;padding:15px;background: #eee;border-radius: 3px;text-align:center;">Need help? <a href="mailto:contact@hurify.co" style="color: #3ba1da;text-decoration: none;"> contact us </a> today.</div><div style="color: #999;padding: 20px 30px"><div style="text-align:center">Thank you!</div><div style="text-align:center">The <a href="http://platform.hurify.co" style="color: #3ba1da;text-decoration: none;"> Hurify </a>Team</div></div><div style = "text-align:center;"><span style="position:relative"><a href="https://www.facebook.com/hurify"><img src="cid:image2" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://github.com/HurifyPlatform/"><img src="cid:image3" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.linkedin.com/company/11281157/"><img src="cid:image4" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://medium.com/@Hurify"><img src="cid:image5" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://www.reddit.com/user/Hurify/"><img src="cid:image6" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://hurify.slack.com/"><img src="cid:image7" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://t.me/joinchat/Fyj94Q74NiSm26mxBJxLog"><img src="cid:image8" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image9" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://google.com"><img src="cid:image10" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="position:relative"><a href="https://bitcointalk.org/index.php?action=profile;u=1244776"><img src="cid:image11" style ="border-radius:50%;background-color:#9cc1fc;border-color:#9cc1fc" width=50px ></a></span></div>';

									              var attachments = [{ filename : "HURFIY1.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/HURFIY1.png", cid : "image1"}, { filename : "facebook.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/facebook.png", cid : "image2"}, { filename : "github.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/github.png", cid : "image3"}, { filename : "linkdin.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/linkdin.png", cid : "image4"}, { filename : "medium.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/medium.png", cid : "image5"}, { filename : "reddit.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/reddit.png", cid : "image6"}, { filename : "slack.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/slack.png", cid : "image7"}, { filename : "telegram.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/telegram.png", cid : "image8"}, { filename : "twitter.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/twitter.png", cid : "image9"}, { filename : "youtube.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/youtube.png", cid : "image10"},{ filename : "bitcointalk.png", path : "https://platform.hurify.co:1800/public/shared/platform/img/bitcointalk.png", cid : "image11"}];

																return User.update({blackList: blackList}, {
																	where : {
																		email : email
																	}
																}).then(function(success) {
																	return User.findOne({
																		where : {
																			email : email
																		}
																	}).then(function(userData) {
																		return coreapi.sendMail({
																		  "from" : from,
																		  "to": to,
																		  "subject": subject,
																		  "body": body,
																		  "bcc" : bcc,
																		  "attachments" : attachments
																		}).then(function(success) {
																		  if (success) {
																		    return resolve({message : "Thank you. Your data has been submitted successfully", data: userData});
																		  } else {
																		    return reject("Failed to send confirmation email!");
																		  }
																		}).catch(function(err) {
																		  console.log("Err: ", err);
																		  return reject(err);
																		});
																	}).catch(function(err) {
																		return reject(err);
																	});
																}).catch(function(err) {
																	return reject(err);
																});
									            }).catch(function(err) {
									              console.log("Err1: ", err);
									              return reject(err);
									            })
									          }).catch(function(err) {
									            console.log("Err2: ", err);
									            return reject(err);
									          });
									        }).catch(function(err) {
									          console.log("Err2: ", err);
									          return reject(err);
									        });
									      }).catch(function(err) {
									        return reject(err);
									      })
									    } catch (err) {
									      console.log("Err3: ", err);
									      return reject(err);
									    }
									  })
									}

									this.updateTokenSaleWithHURTokens = function(tokenData) {
										return new Promise(function(resolve, reject) {
											try {
												console.log("tokenData: ", tokenData);
												var email = tokenData.email;
												var TokenSale = orm.model("TokenSale");
												return TokenSale.findOne({
													where : {
														email : email
													}
												}).then(function(result) {
													console.log("result: ", result);
													// if (!result.length) {
													// 	return reject("No data found.");
													// }
													return TokenSale.update({HURTokens: tokenData.HURTokens}, {
														where : {
															email : email
														}
													}).then(function(success) {
														return resolve("HURTokens updated successfully.")
													}).catch(function(err) {
														console.log("Err: ", err);
														return reject(err);
													})
												}).catch(function(err) {
													console.log("Err1: ", err);
													return reject(err);
												});
											} catch(err) {
												console.log("Err2: ",err);
												return reject(err);
											}
										})
									}

									this.addAnotherTransactionInTokenSale = function(tokenData) {
														return new Promise(function(resolve, reject) {
															try {
																if(tokenData.transactionHash == ""){
																	tokenData.transactionHash = null;
																}
																var TokenSale = orm.model("TokenSale");
																var User = orm.model("User");
																return User.findOne({
																	where : {
																		email : tokenData.email
																	}
																}).then(function(result) {
																	if(tokenData.referralCode == result.referrerCode) {
																		console.log("Invalid referral code.");
																		return reject("Invalid referral code.");
																	}
																	return TokenSale.create(tokenData).then(function(success) {
																		return User.update({tokenSaleStatus: 1},{
																			where : {
																				email : tokenData.email
																			}
																		}).then(function(updated) {
																			return resolve(success.id);
																		}).catch(function(err) {
																			return reject(err);
																		})
																	}).catch(function(err) {
																		return reject(err);
																	});
																}).catch(function(err) {
																	return reject(err);
																});
															} catch(err) {
																return reject(err);
															}
														})
													}


													this.getAllTokenSaleData = function(email) {
														return new Promise(function(resolve, reject ) {
															try{
																var TokenSale = orm.model("TokenSale");
																return TokenSale.findAll({
																	where : {
																		email : email,
																		transactionHash : {
																			[Op.not] : null
																		 }
																	 }
																}).then(function(result) {
																	return resolve(result);
																}).catch(function(err) {
																	return reject(err);
																})
															} catch(err) {
																return reject(err);
															}
														})
													}
	this.getTransactionByHash = function(dataObj) {
		return new Promise(function(resolve, reject ) {
			try {
				var typeofCurrency = dataObj.type;
				var transactionHash = dataObj.transactionHash;
				if (typeofCurrency == "ETH") {
					https.get('https://etherscan.io/tx/' + transactionHash, (resp) => {
						let data = '';
						resp.on('data', function(chunk) {
							data += chunk;
						});
						var finalObj = {};
						resp.on('end', function() {
							var dataArr = (data.split("\n"));
							stringSearcher.find(data, 'Sorry, we are unable to locate this Transaction Hash').then(function(resultArr) {
								if (resultArr.length > 0) {
									return reject({success : false, message : "Sorry, we are unable to locate this Transaction Hash"})
								} else {
									stringSearcher.find(data, 'Invalid TxHash').then(function(resultArr) {
										if (resultArr.length > 0) {
											return reject({success : false, message : "Invalid TxHash"})
										} else {
											stringSearcher.find(data, 'TxHash:').then(function(resultArr) {
												if (resultArr.length === 1) {
													finalObj['TxHash'] = dataArr[resultArr[0].line].replace(/<(?:.|\n)*?>/gm, '').trim();
												}
												stringSearcher.find(data, 'TxReceipt Status:').then(function(resultArr2) {
													if (resultArr2.length === 1) {
														finalObj['TxReceiptStatus'] = dataArr[resultArr2[0].line - 1].replace(/<[^>]+>/g, '').split(":")[1].trim();
													}
													stringSearcher.find(data, 'From:').then(function(resultArr3) {
														if (resultArr3.length === 1) {
															finalObj['From'] = dataArr[resultArr3[0].line].replace(/<(?:.|\n)*?>/gm, '').trim();
														}
														stringSearcher.find(data, 'To:').then(function(resultArr4) {
															if (resultArr4.length === 1) {
																finalObj['To'] = dataArr[resultArr4[0].line].replace(/<(?:.|\n)*?>/gm, '').trim();
															}
															stringSearcher.find(data, 'Value:').then(function(resultArr5) {
																if (resultArr5.length === 1) {
																	finalObj['Value'] = dataArr[resultArr5[0].line + 2].replace(/<[^>]+>/g, '').split(" ")[0].trim();
																}
																return resolve(JSON.parse(JSON.stringify(finalObj)));
															}).catch(function(err) {
																return reject(err);
															});
														}).catch(function(err) {
															return reject(err);
														});
													}).catch(function(err) {
														return reject(err);
													});
												}).catch(function(err) {
													return reject(err);
												});
											}).catch(function(err) {
												return reject(err);
											});
										}
									}).catch(function(err) {
										return reject(err);
									});
								}
							}).catch(function(err) {
								return reject(err);
							});
						});
					}).on("error", (err) => {
						return reject("Error: " + err.message);
					});
				} else if(typeofCurrency == "BTC") {
					https.get('https://btc-bitcore3.trezor.io/api/tx/' + transactionHash, (resp) => {
						let data = '';
						resp.on('data', function(chunk) {
							data += chunk;
						});
						var finalObj = {};
						resp.on('end', function() {
							if(isObject(data)) {

								data = JSON.parse(data);
								var from = data.vin[0].addr;
								if (data.vout.length == 1) {
									if (data.vout[0].scriptPubKey.addresses[0] == "1QGXtg1k2FZPQdh1ZG79qatCeQ7wRGu5rM") {
										var value = data.vout[0].value;
										var to = data.vout[0].scriptPubKey.addresses[0];
									}
								} else {
									for (var i = 0; i < data.vout.length; i++) {
										if(data.vout[i].scriptPubKey.addresses[0] == "1QGXtg1k2FZPQdh1ZG79qatCeQ7wRGu5rM") {
											var value = data.vout[i].value;
											var to = data.vout[i].scriptPubKey.addresses[0];
										}
									}
								}
								if (typeof to !== "undefined") {
									var txid = data.txid;
									finalObj['TxHash'] = txid;
									finalObj['TxReceiptStatus'] = 'success';
									finalObj['From'] = from;
									finalObj['To'] = to;
									finalObj['Value'] = value;
									return resolve(finalObj)
								} else {
									return reject({success : false, message : "Haven't received crypto!"});
								}
							} else {
								return reject({success : false, message : "Invalid Hash"})
							}
						});
					}).on("error", (err) => {
						return reject("Error: " + err.message);
					});
				} else if(typeofCurrency == "LTC") {
					let transactionUrl = 'https://chain.so/api/v2/tx/'+ typeofCurrency +'/' + transactionHash;
					https.get(transactionUrl, (resp) => {
						let data = '';
						resp.on('data', function(chunk) {
							data += chunk;
						});
						var finalObj = {};
						resp.on('end', function() {
							if(isObject(data)) {

								data = JSON.parse(data);
								var from = data.data.inputs[0].address;
								if (data.data.outputs.length == 1) {
									if (data.data.outputs[0].address == "LM5gW296iwEsU7gx5KQZPjnhwRXVQUDLf4") {
										var value = data.data.outputs[0].value;
										var to = data.data.outputs[0].address;
									}
								} else {
									for (var i = 0; i < data.data.outputs.length; i++) {
										if(data.data.outputs[i].address == "LM5gW296iwEsU7gx5KQZPjnhwRXVQUDLf4") {
											var value = data.data.outputs[i].value;
											var to = data.data.outputs[i].address;
										}
									}
								}
								if (typeof to !== "undefined") {
									var txid = data.data.txid;
									finalObj['TxHash'] = txid;
									finalObj['TxReceiptStatus'] = data.status;
									finalObj['From'] = from;
									finalObj['To'] = to;
									finalObj['Value'] = value;
									return resolve(finalObj)
								} else {
									return reject({success : false, message : "Haven't received crypto!"});
								}
							} else {
								return reject({success : false, message : "Invalid Hash"})
							}
						});
					}).on("error", (err) => {
						return reject("Error: " + err.message);
					});
				}  else if(typeofCurrency == "DASH") {
					let transactionUrl = 'https://chain.so/api/v2/tx/'+ typeofCurrency +'/' + transactionHash;
					https.get(transactionUrl, (resp) => {
						let data = '';
						resp.on('data', function(chunk) {
							data += chunk;
						});
						var finalObj = {};
						resp.on('end', function() {
							// console.log(data);
							if(isObject(data)) {
								console.log("hgvvhvhvhvhvhvcf");
								data = JSON.parse(data);
								var from = data.data.inputs[0].address;
								if (data.data.outputs.length == 1) {
									if (data.data.outputs[0].address == "Xngzo7xuocwrkTT97n5MxfQCet1wX6XBRE") {
										var value = data.data.outputs[0].value;
										var to = data.data.outputs[0].address;
									}
								} else {
									for (var i = 0; i < data.data.outputs.length; i++) {
										if(data.data.outputs[i].address == "Xngzo7xuocwrkTT97n5MxfQCet1wX6XBRE") {
											var value = data.data.outputs[i].value;
											var to = data.data.outputs[i].address;
										}
									}
								}
								if (typeof to !== "undefined") {
									var txid = data.data.txid;
									finalObj['TxHash'] = txid;
									finalObj['TxReceiptStatus'] = data.status;
									finalObj['From'] = from;
									finalObj['To'] = to;
									finalObj['Value'] = value;
									return resolve(finalObj)
								} else {
									return reject({success : false, message : "Haven't received crypto!"});
								}
							} else {
								console.log("hgvvhvhvhvhvhvcf");
								return reject({success : false, message : "Invalid Hash"})
							}
						});
					}).on("error", (err) => {
						return reject("Error: " + err.message);
					});
				} else if(typeofCurrency == "BTG") {
					https.get('https://www.btgblocks.com/api/getrawtransaction?txid='+ transactionHash +'&decrypt=1', (resp) => {
						let data = '';
						resp.on('data', function(chunk) {
							data += chunk;
						});
						var finalObj = {};
						resp.on('end', function() {
							if(isObject(data)) {

								data = JSON.parse(data);
								var from = "None";
								var to, value;
								if (data.vout.length == 1) {
									if (data.vout[0].scriptPubKey.addresses[0] == "3LCdYFYas3RpTQTiToiQQ8mxheFZ9ttygy") {
										var to = data.vout[0].scriptPubKey.addresses[0];
										var value = data.vout[0].value;
									}
								} else {
									for (var i = 0; i < data.vout.length; i++) {
										if(data.vout[i].scriptPubKey.addresses[0] == "3LCdYFYas3RpTQTiToiQQ8mxheFZ9ttygy") {
											var to = data.vout[i].scriptPubKey.addresses[0];
											var value = data.vout[i].value;
										}
									}
								}
								if (typeof to !== "undefined") {
									var txid = data.txid;
									finalObj['TxHash'] = txid;
									finalObj['TxReceiptStatus'] = 'success';
									finalObj['From'] = from;
									finalObj['To'] = to;
									finalObj['Value'] = value;
									return resolve(finalObj)
								} else {
									return reject({success : false, message : "Haven't received crypto!"});
								}
							} else {
								return reject({success : false, message : "Invalid Hash"})
							}
						});
					}).on("error", (err) => {
						return reject("Error: " + err.message);
					});
				} else if(typeofCurrency == "BCH") {
					https.get('https://api.blocktrail.com/v1/btc/transaction/' + transactionHash+'?api_key=ad52312d18789d7126030d00bf3c3ffc3ef8ac62', (resp) => {
						let data = '';
						resp.on('data', function(chunk) {
							data += chunk;
						});
						var finalObj = {};
						resp.on('end', function() {
							if (data.code >= 400 && data.code < 430) {
								return reject({success : false, message : "Invalid Hash"})
							}
							var from = data.inputs[0].address;
							var to, value;
							if (data.outputs.length == 1) {
								if (data.outputs[0].address == "1F2cpaJDgr9xi8ucpoyUME7um132mwdq1b") {
									var to = data.outputs[0].address;
									var value = data.outputs[0].value;
								}
							} else {
								for (var i = 0; i < data.outputs.length; i++) {
									if(data.outputs[i].address == "1F2cpaJDgr9xi8ucpoyUME7um132mwdq1b") {
										var to = data.outputs[i].address;
										var value = data.outputs[i].value;
									}
								}
							}
							if (typeof to !== "undefined") {
								var txid = data.hash;
								finalObj['TxHash'] = txid;
								finalObj['TxReceiptStatus'] = 'success';
								finalObj['From'] = from;
								finalObj['To'] = to;
								finalObj['Value'] = value;
								return resolve(finalObj)
							} else {
								return reject({success : false, message : "Haven't received crypto!"});
							}
						});
					}).on("error", (err) => {
						return reject("Error: " + err.message);
					});
				} else {
					return reject({success : false, message : "Not found type!"})
				}
			} catch(err) {
				return reject(err);
			}
		})
	}


	this.getCurrencyConversionValue = function() {
					return new Promise(function(resolve, reject) {
						try {
							var CurrencyConversion = orm.model("CurrencyConversion");
							var id = "";
							var date = moment().format("YYYY-MM-DD");

							if ((date >= '2018-02-01') && (date <= '2018-02-07')) {
								id = 1;
							} else if ((date >= '2018-02-08') && (date <= '2018-02-14')) {
								id = 2;
							} else if ((date >= '2018-02-15') && (date <= '2018-02-21')) {
								id = 3
							} else {
								id = 4;
							}
							return CurrencyConversion.findOne({
								where : {
									id : id
								}
							}).then(function(result) {
								return resolve(result);
							}).catch(function(err) {
								console.log("err 1 ", err);
								return reject(err);
							})
						} catch(err) {
							console.log("err 2 ", err);
							return reject(err);
						}
					})
				}


				this.bestRatedDevelopersList = function () {
              					return new Promise( function (resolve, reject) {
              						try {
              							sequelize.query("SELECT developers.id AS developerId, developers.name AS name, developers.jobTitle as jobTitle, users.profilePhotoPath as path, COUNT(feedbacks.developerId) as feedbackCount, SUM(feedbacks.rating) AS totalRatings from developers developers LEFT JOIN feedbacks feedbacks ON developers.id = feedbacks.developerId LEFT JOIN users users ON developers.userId = users.id GROUP BY developers.id, developers.name ORDER BY SUM(feedbacks.rating) DESC LIMIT 5;", { type: sequelize.QueryTypes.SELECT}).then(function (result) {
              								console.log("Result", result);
              								return resolve(result);
              							}).catch(function(err) {
              								return reject(err);
              							})
              						} catch(err) {
              							return reject (err);
              						}
              					})
              				}
											this.bestRatedClientsList = function () {
				              					return new Promise( function (resolve, reject) {
				              						try {
				              							sequelize.query("select p.clientId as clientId, count(p.clientId) as total, u.profilePhotoPath as path, c.name as name from projects p left join clients c on c.id = p.clientId left join users u on c.userId = u.id where p.projectStatusId = 7 group by clientId order by count(clientId) desc limit 5;", { type: sequelize.QueryTypes.SELECT}).then(function (result) {
				              								console.log("Result", result);
				              								return resolve(result);
				              							}).catch(function(err) {
				              								return reject(err);
				              							})
				              						} catch(err) {
				              							return reject (err);
				              						}
				              					})
				              				}
															this.topProjectsBasedOnPrice = function () {
																	return new Promise(function (resolve, reject) {
																		try {
																			var Project = orm.model("Project");
																			return Project.findAll({
																				order: [['price','DESC']],
																				limit : 5
																			}).then(function(result) {
																				return resolve(result);
																			}).catch(function(err) {
																				console.log("Err: ", err);
																				return reject(err);
																			});
																		} catch (err) {
																			console.log("Err1: ", err);
																			return reject(err);
																		}
																	})
																}
				this.topProjectsBasedOnBids = function () {
					return new Promise(function (resolve, reject) {
						try {
							sequelize.query("SELECT `AppliedProject`.`projectId` AS `projectId`, COUNT(`AppliedProject`.`projectId`) AS `bids`, `Project`.`technology` AS `technology`, `Project`.`projectName` AS `projectName` FROM `applied_projects` AS `AppliedProject` LEFT OUTER JOIN `projects` AS `Project` ON `AppliedProject`.`projectId` = `Project`.`id` GROUP BY `projectId` ORDER BY bids DESC LIMIT 5;", { type: sequelize.QueryTypes.SELECT}).then(function (result) {
								console.log("Result", result);
								return resolve(result);
							}).catch(function(err) {
								return reject(err);
							})
						} catch (err) {
							console.log("Err1: ",err);
							return reject(err);
						}
					})
				}
				this.clientProfileCompleteness = function(userId) {
														return new Promise(function(resolve, reject) {
															try {
																var Client = orm.model("Client");
																var User = orm.model("User");
																return Client.findOne({
																	where : {
																		userId : userId,
																	},
																	include : [User]
																}).then(function(result) {
																	if (result) {
																		if(result.name != null && result.User.profilePhotoPath != null) {
																			return resolve({profilePercentage : 100 })
																		} else if(result.name != null && result.User.profilePhotoPath == null){
																			return resolve({profilePercentage : 67 })
																		}  else if(result.name == null && result.User.profilePhotoPath != null){
																			return resolve({profilePercentage : 67 })
																		}
																	} else {
																		return resolve({profilePercentage : 33 })
																	}
																}).catch(function(err) {
																	return reject(err);
																})
															} catch(err) {
																return reject(err);
															}
														})
													}
													this.developerProfileCompleteness = function(userId) {
														return new Promise(function(resolve, reject) {
															try {
																var Developer = orm.model("Developer");
																var User = orm.model("User");
																return Developer.findOne({
																	where : {
																		userId : userId,
																	},
																	include : [User]
																}).then(function(result) {
																	if (result) {
																		if(result.name != null && result.attachmentPath != null && result.User.profilePhotoPath != null) {
																			return resolve({profilePercentage : 100 })
																		} else if(result.name != null && result.attachmentPath != null && result.User.profilePhotoPath == null){
																			return resolve({profilePercentage : 75 })
																		} else if(result.name != null && result.attachmentPath == null && result.User.profilePhotoPath != null){
																			return resolve({profilePercentage : 75 })
																		} else if(result.name == null && result.attachmentPath != null && result.User.profilePhotoPath != null){
																			return resolve({profilePercentage : 75 })
																		} else if(result.name == null && result.attachmentPath == null && result.User.profilePhotoPath != null){
																			return resolve({profilePercentage : 50 })
																		} else if(result.name == null && result.attachmentPath != null && result.User.profilePhotoPath == null){
																			return resolve({profilePercentage : 50 })
																		} else if(result.name != null && result.attachmentPath == null && result.User.profilePhotoPath == null){
																			return resolve({profilePercentage : 50 })
																		} else if(result.name == null && result.attachmentPath == null && result.User.profilePhotoPath == null){
																			return resolve({profilePercentage : 25 })
																		}
																	} else {
																		return resolve({profilePercentage : 25 })
																	}
																}).catch(function(err) {
																	return reject(err);
																})
															} catch(err) {
																return reject(err);
															}
														})
													}
													this.profileCompletenessPercentage = function(userId) {
														var coreapi = this;
														return new Promise(function(resolve, reject) {
															try {
																console.log("UserId: ", userId);
																var User = orm.model("User");
																User.findOne({
																	where : {
																		id : userId
																	}
																}).then(function(result) {
																	if (result.userAccountType == 'client') {
																		return coreapi.clientProfileCompleteness(result.id).then(function(profile) {
																			return resolve({profilePercentage : profile.profilePercentage})
																		}).catch(function(err) {
																			return reject(err);
																		});
																	} else if (result.userAccountType == 'developer') {
																		return coreapi.developerProfileCompleteness(result.id).then(function(profile) {
																			return resolve({profilePercentage : profile.profilePercentage})
																		}).catch(function(err) {
																			return reject(err);
																		});
																	} else {
																		return resolve({profilePercentage : 0 })
																	}
																}).catch(function(err) {
																	return reject(err);
																})
															} catch(err) {
																return reject(err);
															}
														})
													}

	this.getAllTypesOfReferralCount = function(emailId) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var User = orm.model("User");
				var TelegramBounty = orm.model("TelegramBounty");
				var ProductHunt = orm.model("ProductHunt");
				var TokenSale = orm.model("TokenSale");
				var Airdrop = orm.model("Airdrop");
				return User.findOne({
					where: {
						email: emailId
					}
				}).then(function(result) {
					let userId = result.id;
					let referrerCode = result.referrerCode;
					var referralCode = result.referralCode;
					coreapi.checkReferrerCodeExistance(referralCode).then(function(statusOne) {
						return User.count({
							where: {
								referralCode: referrerCode
							}
						}).then(function(referredUsersCount) {
							if (referrerCode == null || referrerCode == "") {
								referredUsersCount = 0;
							}
							return TelegramBounty.findOne({
								where: {
									email: emailId
								}
							}).then(function(telBounty) {
								let telStatus = 0;
								if (telBounty && telBounty.status == 1) {
									telStatus = 1;
								}
								return TelegramBounty.findAndCountAll({
									where: {
										referralCode: referrerCode
									}
								}).then(function(telBountyUsed) {
										var telUsedCount = 0;
										if (telStatus == 1) {
											let telRows = telBountyUsed.rows;
											for (var i = 0; i < telRows.length; i++) {
												if(telRows[i].status == 1 && telRows[i].email != emailId) {
													telUsedCount += 1;
												}
											}
										}
										if (referrerCode == null || referrerCode == "") {
											telUsedCount = 0;
										}
										return ProductHunt.findOne({
											where: {
												email: emailId
											}
										}).then(function(prodHuntSubmitStatus) {
											return ProductHunt.findAll({
												where: {
													referralCode: referrerCode
												}
											}).then(function(prodHuntRefRows) {

												let prodHuntRefCount = 0;
												for (var i = 0; i < prodHuntRefRows.length; i++) {
													if (prodHuntRefRows[i].email != emailId) {
														prodHuntRefCount+=1
													}
												}
												if (referrerCode == null || referrerCode == "") {
													prodHuntRefCount = 0;
												}
													return TokenSale.findAll({
														where: {
															email: emailId
														}
													}).then(function(myTokTnxs) {
														let noOfTokSaleTnxs = 0;
														return Promise.map(myTokTnxs, function(tSale) {
															var refCode = tSale.referralCode;
															return coreapi.checkReferrerCodeExistance(refCode).then(function(status) {
																if(tSale.status == "Transaction Verified" && status && refCode != referrerCode) {
																	noOfTokSaleTnxs += 1;
																	return true;
																} else {
																	return false;
																}
															}).catch(function(err) {
																return false;
															});
														}).then(function(noOfTokSaleTnxsArr) {
														return TokenSale.findAll({
															where: {
																referralCode: referrerCode
															}
														}).then(function(myTokRefTnxs) {
															let noOfTokSaleRefTnxs = 0;
															for (var i = 0; i < myTokRefTnxs.length; i++) {
																if(myTokRefTnxs[i].status == "Transaction Verified" && myTokRefTnxs[i].email != emailId) {
																	noOfTokSaleRefTnxs += 1;
																}
															}
															if (referrerCode == null || referrerCode == "") {
																noOfTokSaleRefTnxs = 0;
															}
																return Airdrop.findOne({
																	where : {
																		userId : userId
																	}
																}).then(function(airStatus) {
																	let airdropValid = false;
																	if (airStatus && airStatus.status == "Valid") {
																		airdropValid = true;
																	}
																	return resolve({
																		referredData: {
																			user: referredUsersCount * 50,
																			telBounty: telUsedCount * 50,
																			prodHunt: prodHuntRefCount * 25,
																			tokSale: noOfTokSaleRefTnxs * 100
																		},
																		userAction: {
																			user: (statusOne ? 1 : 0) * 50,
																			telBounty: (telStatus ? 1 : 0) * 200,
																			prodHunt: (prodHuntSubmitStatus ? 1 : 0) * 100,
																			tokSale: noOfTokSaleTnxs * 100,
																			airDrop : (airdropValid ? 1 : 0) * 100
																		}
																	});
																}).catch(err => {
																	return reject(err);
																})
															}).catch(err => {
																return reject(err);
															})
														}).catch(function(err) {
															return reject(err);
														});
													}).catch(function(err) {
														return reject(err);
													});
												}).catch(function(err) {
													return reject(err);
												});
											}).catch(function(err) {
												return reject(err);
											});
										}).catch(function(err) {
											return reject(err);
										});
									}).catch(function(err) {
										return reject(err);
									});
								}).catch(function(err) {
									return reject(err);
								});
							}).catch(function(err) {
								return reject(err);
							});
						})
				.catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err)
			}
		});
	}

	this.updateUserWalletAddress = function(dataObj) {
		return new Promise(function(resolve, reject) {
			try {
				console.log("data obj", dataObj);
				let data = dataObj.data;
				var userId = data.userId;
				var walletAddress = data.walletAddress;
				var Users = orm.model("User");
				var key = "login_" + dataObj.token;
				client.get(key, function(err, response) {
					if (!response) {
						return reject("API session expired, Please login again1!");
					} else {
						if (key in response) {
							let userObj = JSON.parse(response[key]);
							if (userObj.id == userId) {
								return Users.findOne({
									where: {
										id: userId
									}
								}).then(function(user) {
									if (user) {

										user["walletAddress"] = walletAddress;
										console.log(user);
										user.save().then(function(success) {
											return resolve("Successfully updated Wallet Address!!");
										}).catch(function(err) {
											return reject(err);
										})
									} else {
										return reject("User Not Found!");
									}
								}).catch(function(err) {
									return reject(err);
								});
							} else {
								return reject("Invalid Request!");
							}
						} else {
							return reject("API session expired, Please login again2!");
						}
					}
				});
			} catch (err) {
				return reject(err)
			}
		})
	}

	this.getAllUserStakes = function(data) {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				let email = data.email;
				let userId = data.userId;
				var User = orm.model("User");
				var TelegramBounty = orm.model("TelegramBounty");
				var ProductHunt = orm.model("ProductHunt");
				var TokenSale = orm.model("TokenSale");
				var Airdrop = orm.model("Airdrop");
				return User.findOne({
					where: {
						email: email
					}
				}).then(function(userResult) {
					var userReferrals = 0;
					if (userResult) {
						userReferrals = userResult.stakes;
						if (userReferrals == null) {
							userReferrals = 0;
						}
					}
					return TelegramBounty.findOne({
						where: {
							email: email
						}
					}).then(function(telResult) {
						var telegramReferrals = 0;
						if (telResult) {
							telegramReferrals = telResult.stakes;
							if (telegramReferrals == null) {
								telegramReferrals = 0;
							}
						}
						return ProductHunt.findOne({
							where: {
								email: email
							}
						}).then(function(prodResult) {
							var productReferrals = 0;
							if (prodResult) {
								productReferrals = prodResult.stakes;
								if (productReferrals == null) {
									productReferrals = 0;
								}
							}
							return TokenSale.findOne({
								where: {
									email: email
								}
							}).then(function(tokResult) {
								var tokensaleReferrals = 0;
								if (tokResult) {
									tokensaleReferrals = tokResult.stakes
									if (tokensaleReferrals == null) {
										tokensaleReferrals = 0;
									}
								}
								return Airdrop.findOne({
									where: {
										userId: userId
									}
								}).then(function(airResult) {
									var airdropReferrals = 0;
									if (airResult) {
										airdropReferrals = airResult.stakes
										if (airdropReferrals == null) {
											airdropReferrals = 0;
										}
									}
									return resolve({
											user: userReferrals,
											telBounty: telegramReferrals,
											prodHunt: productReferrals,
											tokSale: tokensaleReferrals,
											airdrop: airdropReferrals
									});
								}).catch(function(err) {
									return reject(err);
								});
							}).catch(function(err) {
								return reject(err);
							});
						}).catch(function(err) {
							return reject(err);
						});
					}).catch(function(err) {
						return reject(err);
					});
				}).catch(function(err) {
					return reject(err);
				});
			} catch (err) {
				return reject(err)
			}
		});
	}


	this.getAllProductsList = function() {
			return new Promise(function(resolve, reject) {
				try {
					var Products = orm.model("Product");
					return Products.findAll({
						order: [['id', 'DESC']]
					}).then(result => {
						return resolve(result);
					}).catch(err => {
						return reject(err);
					});
				} catch(err) {
					return reject(err);
				}
			})
		}

		this.checkIfProductExistsInCart = function(data) {
				return new Promise((resolve, reject) => {
					try {
						var Cart = orm.model("Cart");
						return Cart.findOne({
											where : {
												productId : data.productId,
												userId : data.userId
											}
										}).then(data => {
											if (data) {
												return resolve({ success : 1, data : data});
											} else {
												return resolve({ success : 0, data : "No data"});
											}
										}).catch(err => {
											return reject(err);
										})
					} catch(err) {
						return reject(err);
					}
				})
			}


// 				this.addProductsToCart = function(data) {
// 					var coreapi = this;
// 					return new Promise((resolve, reject) => {
// 						try {
// 							console.log(data);
// 							var userId = data.userId;
//               var Cart = orm.model("Cart");
// 							var Product = orm.model("Product");
//               return Cart.create(data).then(created => {
// 								console.log("Check:");
//               	return Cart.findAll({
//               		where : {
//               			userId : userId
//               		},
// 									include : [Product]
//               	}).then(result => {
// 									console.log(result.length);
// 									console.log(JSON.stringify(result));
// 									if (!result) {
// 										return reject("Empty cart.");
// 									}
//               		var obj = {};
// 									var arr = [];
// 									for(var i = 0; i < result.length; i++) {
// 										obj = {
// 											id : result[i].id,
// 											userId : result[i].userId,
// 											productId : result[i].productId,
// 											name : result[i].Product.name,
// 											price : result[i].price,
// 											image : result[i].Product.image,
// 											documentPath : result[i].Product.documentPath,
// 											quantity : result[i].quantity
// 										}
// 										arr.push(obj);
// 									}
// 									console.log(arr);
// 									return resolve(arr);
//               	}).catch(err => {
// 									console.log("Err1: ",err);
//               		return reject(err);
//               	})
//               }).catch(err => {
// 								console.log("Err2: ", err);
//               	return reject(err);
//               })
// 		} catch (err) {
// 			console.log("Err3: ", err);
// 			return reject(err);
// 		}
// 	})
// }

this.addProductsToCart = function(data) {
	var coreapi = this;
	return new Promise((resolve, reject) => {
		try {
							var Cart = orm.model("Cart");
							return coreapi.checkIfProductExistsInCart(data).then(result => {
								if (result.success == 1) {
									var quantity = data.quantity + result.data.quantity;
									//var price = data.price + result.data.price;
									return Cart.update({quantity : quantity},{
										where : {
											id : result.data.id
										}
									}).then(updated => {
										return Cart.findAll({
											where : {
												userId : data.userId
											},
											include : [{model : orm.model("Product")}]
										}).then(result => {
											var obj = {};
							var arr = [];
							for(var i = 0; i < result.length; i++) {
								obj = {
									id : result[i].id,
									userId : result[i].userId,
									productId : result[i].productId,
									name : result[i].Product.name,
									price : result[i].price,
									image : result[i].Product.image,
									documentPath : result[i].Product.documentPath,
									quantity : result[i].quantity
								}
								arr.push(obj);
							}
						return resolve(arr);
										}).catch(err => {
											return reject(err);
										})
									}).catch(err => {
										return reject(err);
									})
								} else {
									return Cart.create(data).then(created => {
										return Cart.findAll({
											where : {
												userId : data.userId
											},
											include : [{model : orm.model("Product")}]
										}).then(result => {
											var obj = {};
							var arr = [];
							for(var i = 0; i < result.length; i++) {
								obj = {
									id : result[i].id,
									userId : result[i].userId,
									productId : result[i].productId,
									name : result[i].Product.name,
									price : result[i].price,
									image : result[i].Product.image,
									documentPath : result[i].Product.documentPath,
									quantity : result[i].quantity
								}
								arr.push(obj);
							}
						return resolve(arr);
										}).catch(err => {
											return reject(err);
										})
									}).catch(err => {
										return reject(err);
									})
								}
							}).catch(err => {
								return reject(err);
							})
		} catch (err) {
			return reject(err);
		}
	})
}

			this.removeProductsFromCart = function(data) {
				var coreapi = this;
				return new Promise((resolve, reject) => {
					try {
						var Cart = orm.model("Cart");
						return Cart.findOne({
							where : {
								id : data.cartId
							}
						}).then(result => {
							if(result) {
								return Cart.destroy({
									where : {
										id : data.cartId
									}
								}).then(deleted => {
									return resolve("Product successfully removed from cart.");
								}).catch(err => {
									return reject(err);
								});
							} else {
								return reject("No Products in Cart.");
							}
						}).catch(err => {
							return reject(err);
						})
					} catch (err) {
						return reject(err);
					}
				})
			}

			this.editProductsInCart = function(data) {
				var coreapi = this;
				return new Promise((resolve, reject) => {
					try {
						console.log("data ", data);
						var Cart = orm.model("Cart");
						return coreapi.checkIfProductExistsInCart(data).then(result => {
							if(result.success == 1) {
								return Cart.update({quantity : data.quantity, price : data.price},{
									where : {
										id : data.id
									}
								}).then(success => {
									return resolve("Success.");
								}).catch(err => {
									console.log("err1 ", err);
									return reject(err);
								});
							} else {
								return reject("No Products in Cart.");
							}
						}).catch(err => {
							console.log("err2 ", err);
							return reject(err);
						})
					} catch(err) {
						console.log("err3 ", err);
						return reject(err);
					}
				})
			}

			this.getCartProducts = function(data) {
return new Promise((resolve, reject) => {
	try {
		var Cart = orm.model("Cart");
		return Cart.findAll({
			where : {
				userId : data.userId
			},
			include : [{model : orm.model("Product")}]
		}).then(result => {
			var obj = {};
			var arr = [];
			for(var i = 0; i < result.length; i++) {
				obj = {
					id : result[i].id,
					userId : result[i].userId,
					productId : result[i].productId,
					name : result[i].Product.name,
					price : result[i].price,
					image : result[i].Product.image,
					documentPath : result[i].Product.documentPath,
					manufacturer : result[i].Product.manufacturer,
					quantity : result[i].quantity
				}
				arr.push(obj);
			}
			return resolve(arr);
		}).catch(err => {
			return reject(err);
		});
	} catch(err) {
		return reject(err);
	}
})
}

this.addShippingDetails = function(data) {
	return new Promise((resolve, reject) => {
		try {
			var Order = orm.model("Order");
			var orderNo = randomatic('0', 14);
			var taxAmount = data.price * 0.11;
			var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			// var status = "Order Placed";
			return Order.create({
				userId : data.userId,
				name : data.name,
				email : data.email,
				mobile : data.mobile,
				address : data.address,
				city : data.city,
				state : data.state,
				country : data.country,
				orderNo : orderNo,
				price : data.price,
				pincode : data.pincode,
				status : data.status,
				taxAmount : taxAmount
			}).then(created => {
				var orderId = created.id;
				return Order.findOne({
						where : {
							id : created.id
						}
					}).then(result => {
						var today = new Date(result.createdAt);
						var rawDeliveryDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6);
						var year = rawDeliveryDate.getFullYear();
						var monthNum = rawDeliveryDate.getMonth();
						var month = months[monthNum];
						var dateNum = rawDeliveryDate.getDate();
						var dayNum = rawDeliveryDate.getDay();
						var day = days[dayNum];
						var deliveryDate = day + ', ' +dateNum+ ' ' +month+ ' ' + year;

						return Order.update({deliveryDate : deliveryDate}, {
							where : {
								id : result.id
							}
						}).then(updated => {
							console.log("OrderId: ", orderId)
							return resolve({ success : 1 , orderNo : orderNo,  orderId : orderId });
						}).catch(err => {
							return reject(err);
						});
					}).catch(err => {
						return reject(err);
					});
			}).catch(err => {
				return reject(err);
			});
		} catch(err) {
			return reject(err);
		}
	})
}


this.addPaymentstatus = function(data) {
	return new Promise((resolve, reject) => {
		try {
			console.log("PaymentData: ", data);
			var Payment = orm.model("Payment");
			var paymentStatus = "Payment Confirmation Pending";
			return Payment.create({orderId : data.orderId, paymentRef : data.transactionHash, paymentStatus : paymentStatus}).then(created => {
				var paymentId = created.id;
				console.log("payment check:");
				return resolve({success : 1, paymentId : paymentId});
			}).catch(err => {
				console.log("Err: ", err);
				return reject(err);
			})
		} catch(err) {
			console.log("Err1: ", err);
			return reject(err);
		}
	})
}


this.addProductDetailsInOrderInfo = function(data) {
	return new Promise((resolve, reject) => {
		try {
			console.log("Check1: ");
			var orderId = data.orderId;
			var deliveryStatus = "Order Placed.";
			var OrderInfo = orm.model("OrderInfo");
			var Cart = orm.model("Cart");
			return Cart.findAll({
				where : {
					userId : data.userId
				}
			}).then(result => {
				console.log("Check2: ");
				console.log("Result: ", result);
				return result.map(i => {
					console.log("I", i);
					return OrderInfo.create({
						orderId : data.orderId,
						productId : i.productId,
						quantity : i.quantity,
						price : i.price,
						deliveryStatus : deliveryStatus
					}).then(created => {
						console.log("Check3: ");
						return resolve({success : 1, message : "Data saved."});
					}).catch(err => {
						console.log("Err: ", err);
						return reject(err);
					})
				})
			}).catch(err => {
				console.log("Err1: ", err);
				return reject(err);
			});
		} catch(err) {
			console.log("Err2: ", err);
			return reject(err);
		}
	})
}

this.deleteCartForSuccessfulOrders = function(data) {
	return new Promise((resolve, reject) => {
		try {
			var Cart = orm.model("Cart");
			return Cart.destroy({
				where : {
					userId : data.userId
				}
			}).then(deleted => {
				return resolve("Order Placed successfully.");
			}).catch(err => {
				return reject(err);
			})
		} catch(err) {
			return reject(err);
		}
	})
}


this.sendMailForSuccessfulOrders = function(data) {
		var coreapi = this;
		return new Promise((resolve, reject) => {
			try {
				console.log("Data: ", data);
				var Order = orm.model("Order");
				var OrderInfo = orm.model("OrderInfo");
				var Product = orm.model("Product");
				var Payment = orm.model("Payment");
				var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


				return Order.findAll({
					where : {
						orderNo : data.orderNo
					},
					include : [ {
					model : OrderInfo,
					include : [ Product ]
					}, {model : Payment} ]

				}).then(result => {
					if(!result) {
						return reject("Something went wrong.");
					}
					console.log("Result: ", JSON.stringify(result));
					var i = 0;
					var today = new Date(result[0].createdAt);
					var rawDeliveryDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6);
					var year = rawDeliveryDate.getFullYear();
					var monthNum = rawDeliveryDate.getMonth();
					var month = months[monthNum];
					var dateNum = rawDeliveryDate.getDate();
					var dayNum = rawDeliveryDate.getDay();
					var day = days[dayNum];
					var deliveryDate = day + ', ' +dateNum+ ' ' +month+ ' ' + year;
					var from = config.name_and_email;
					var to = result[0].email;
					var totalAmount = result[0].price;// + result[0].taxAmount;
					var subject = "Hurify Order No: " + data.orderNo;
					var body = '<div style="width:700px; margin:0px auto;"><h2 style="margin:5px 0px">Hurify Marketplace</h2><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"><hr/><div><h4>Thank you for your Order</h4><p style="text-align:justify">Please note that your order is currently pending while inventory availability and applicable export compliance is being confirmed. You will receive an email when all necessary checks have been performed and your order begins processing. The lead time of the items on your order will commence from that time. Usually this period is extremely short (almost always less than a day), but it can take a few days if you\'ve elected to pay via wire transfer or if your order is delayed due to export compliance verification. Please see below for other important details, including shipping information.</p><h3 style="margin:5px 0px">Your Order Number</h3><h1 style="margin:5px 0px; color:#707070">'+result[0].orderNo+'</h1><br></div><div><h2 style="margin:5px 0px">Shipping Details</h2><hr/><div><table style="width:80%; text-align:left;"><tr><th style="width:40%;"><h4 style="margin:5px 0px">Billing Address<hr style="width:90%; margin-left:0px"/></h4></th><th style="width:40%;"><h4 style="margin:5px 0px">Shipping Address<hr style="width:90%; margin-left:0px"/></h4></th></tr><tr><td><p style="padding:5px">'+result[0].name+',<br/>'+result[0].address+',<br/>'+result[0].city+',<br/>'+result[0].state+',<br/>'+result[0].country+',<br/>'+result[0].pincode+'<br/></p></td><td><p style="padding:5px">'+result[0].name+',<br/>'+result[0].mobile+',<br/>'+result[0].address+',<br/>'+result[0].city+',<br/>'+result[0].state+',<br/>'+result[0].country+',<br>'+result[0].pincode+'</p></td></tr></table></div><div><h2 style="margin:5px 0px">Order Details</h2><hr/><div><h5 style="margin:2px 0px">Shipping Charge: 0.00</h5><hr/></div><div style="width:700px; display:inline-block;">';


					for (var i = 0; i < result[0].OrderInfos.length; i++) {
						body = body + '<div style="width:350px; outline-style: double; float:left;"><h3 style="margin:2px 0px">'+result[0].OrderInfos[i].Product.name+'</h3><div style="text-align:right"><p style="margin:2px 2px">Quantity:'+result[0].OrderInfos[i].quantity+'</p><p style="margin:2px 2px">Line Total: '+result[0].OrderInfos[i].price+'</p></div></div><div style="width:300px; float:left;"><p style="padding:5px 10px;">Estimated Delivery Date<br/>'+result[0].deliveryDate+'</p></div></div>'
					}

					body = body + '<div style="text-align:right;"><p>Subtotal:    '+result[0].price+'<p/><hr style="width:150px; margin-right:0px;"/><h3>Total:  '+totalAmount+'</h3><hr/></div></div></div></div><div><p>* Disclaimer: International shipments might be subject to custom duty.</p><br/><br/><p>Thank you,</p><p>The Hurify Team</p><p>For any queries: <a href="mailto:support@hurify.co" style="color: #3ba1da;text-decoration: none;">support@hurify.co</a></p><p>Visit us at: <a href="https://platform.hurify.co">platform.hurify.co</a></p></div>';
					var bcc = "arrow_orders@hurify.co";
	        var attachments = [{ filename : "Hur_logo.png", path : "https://platform.hurify.co:1800/public/shared/shop/Hur_logo.png", cid : "image1"}];

	                return coreapi.sendMail({
						"from" : from,
						"to": to,
						"subject": subject,
						"body": body,
						"bcc" : bcc,
						"attachments" : attachments
					}).then(function(success) {
						if (success) {
							return resolve("Mail sent successfully!");
						} else {
							return reject("Failed to send confirmation email!");
						}
					}).catch(function(err) {
						console.log("Err: ", err);
						return reject(err);
					});
				}).catch(err => {
					console.log("Err1: ", err);
					return reject(err);
				});
			} catch(err) {
				console.log("Err2: ", err);
				return reject(err);
			}
		})
	}


	this.sendMailForPendingOrders = function(data) {
		var coreapi = this
		return new Promise((resolve, reject) => {
			try {
				console.log("Data: ", data);
				var Order = orm.model("Order");
				var OrderInfo = orm.model("OrderInfo");
				var Product = orm.model("Product");
				var Payment = orm.model("Payment");
				var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				return Order.findAll({
					where : {
						orderNo : data.orderNo
					},
					include : [ {
					model : OrderInfo,
					include : [ Product ]
					}, {model : Payment} ]

				}).then(result => {
					console.log("rESULT: ",  JSON.stringify(result));
					if(!result) {
						return reject("Something went wrong.");
					}
					var i = 0;
					var today = new Date(result[0].createdAt);
					var rawDeliveryDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6);
					var year = rawDeliveryDate.getFullYear();
					var monthNum = rawDeliveryDate.getMonth();
					var month = months[monthNum];
					var dateNum = rawDeliveryDate.getDate();
					var dayNum = rawDeliveryDate.getDay();
					var day = days[dayNum];
					var deliveryDate = day + ', ' +dateNum+ ' ' +month+ ' ' + year;
					var from = config.name_and_email;
					var to = data.email;
					var subject = "Hurify Payment Pending for Order No: " + data.orderNo;
					var body = '<html><body><div style = "text-align:left;position: absolute;margin: 0px auto;top: 20%;left: 40%;right:20%"><div style="color: #062985; position: relative;text-align:left;"><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></div><div><br><p style ="position: relative;" >Dear ' +result[0].name+ ' ,<br><br>You payment for this order is pending.<br><br>Below is your order information.<br><br></p></div><div style="position: relative"><table><tr style = "text-align: left"><th style = "color: #707070;">Order Number:</th><td>' +result[0].orderNo+ '</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Name:</th><td>' +result[0].name+ '</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Order Date:</th><td>' +result[0].createdAt+ '</td></tr></table></div><div style="position: relative"><br><h2>Payment Information</h2><table><tr style = "text-align: left"><th style = "color: #707070;">Tx Hash</th><td>' +result[0].Payment.paymentRef+ '</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Amount:</th><td>' +result[0].price+ ' HUR</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Status:</th><td style = "color :red"><b>Payment Confirmation Pending.</b></td></tr></table></div><div><br><h2>Order Item(s)</h2><table>'


					for (var i = 0; i < result[0].OrderInfos.length; i++) {
						console.log("Result[0]: ",result[0]);
						body = body + '<tr style = "text-align: left"><td style = "color: #707070;"><img src="' +result[0].OrderInfos[i].Product.image+ '" style = "margin-left:auto;margin-right:auto;vertical-align:middle;width:30%;display:inline-block;"></td><td>' +result[0].OrderInfos[i].Product.name+ '</td></tr>'
					}

					body = body + '</table></div><div><br><h2>Order Summary</h2><table><tr style = "text-align: left"><th style = "color: #707070;">Sub Total:</th><td>' +result[0].price+ ' HUR</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Discount:</th><td>0 HUR</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Total:</th><td>' +result[0].price+ ' HUR</td></tr></table></div><div><p>Thank you,</p><p>The Hurify Team</p><p>For any queries: <a href="mailto:support@hurify.co" style="color: #3ba1da;text-decoration: none;">support@hurify.co</a></p><p>Visit us at: <a href="https://platform.hurify.co">platform.hurify.co</a></p></div></div></body></html>'
					var bcc = "Arrow_orders@hurify.co";
	                var attachments = [{ filename : "Hur_logo.png", path : "https://platform.hurify.co:1800/public/shared/shop/Hur_logo.png", cid : "image1"}];

	                return coreapi.sendMail({
						"from" : from,
						"to": to,
						"subject": subject,
						"body": body,
						"bcc" : bcc,
						"attachments" : attachments
					}).then(function(success) {
						if (success) {
							return resolve("Mail sent successfully!");
						} else {
							return reject("Failed to send confirmation email!");
						}
					}).catch(function(err) {
						console.log("Err: ", err);
						return reject(err);
					});
				}).catch(err => {
					console.log("Err1: ", err);
					return reject(err);
				});
			} catch(err) {
				console.log("Err2:", err);
				return reject(err);
			}
		})
	}


	this.sendMailBasedOnOrderStatus = function(data) {
		var coreapi = this
		return new Promise((resolve, reject) => {
			try {
				console.log("Data: ", data);
				console.log("check1:");
				var Order = orm.model("Order");
				return Order.findOne({
					where : {
						id : data.orderId
					}
				}).then(result => {
					if (result.status == 'Order Placed') {
						return coreapi.sendMailForSuccessfulOrders(data).then(mailSent => {
							console.log("jhdv");
							return resolve(mailSent);
						}).catch(err => {
							console.log("Err: ", err);
							return reject(err);
						});
					} else if(result.status == 'Payment Confirmation Pending') {
						return coreapi.sendMailForPendingOrders(data).then(result => {
							console.log("khdsk");
							return resolve(result);
						}).catch(err => {
							console.log("Err1: ", err);
							return reject(err);
						});
					}
				}).catch(err => {
					console.log("Err2: ", err);
					return reject(err);
				})
			} catch(err) {
				console.log("Err3: ", err);
				return reject(err);
			}
		})
	}


this.getProductDescription = function(data) {
		return new Promise((resolve, reject) => {
			try {
				var Product = orm.model("Product");
				return Product.findOne({
					where : {
						id : data.productId
					}
				}).then(result => {
					return resolve(result);
				}).catch(err => {
					return reject(err);
				})
			} catch(err) {

			}
		})
	}


	this.getSuccessfulOrderInfo = function(data) {
			return new Promise((resolve, reject) => {
				try {
					var Order = orm.model("Order");
					var OrderInfo = orm.model("OrderInfo");
					var Product = orm.model("Product");
					return Order.findAll({
						where : {
							id : data.orderId
						},
						include : [{model : OrderInfo,
							include : [{
								model : Product
							}]
						}]
					}).then(result => {
						return resolve(result);
					}).catch(err => {
						return reject(err);
					});
				} catch(err) {
					return reject(err);
				}
			})
		}

		this.getAllOrdersForUser = function(data) {
				var coreapi = this;
				return new Promise((resolve, reject) => {
					try {
						var Order = orm.model("Order");
						var OrderInfo = orm.model("OrderInfo");
						var Product = orm.model("Product");
						return Order.findAll({
							where : {
								userId : data.userId
							},
							include : [ {
								model : OrderInfo,
								include : [ Product ]
							} ],
							order: [['id', 'DESC']]
						}).then(result => {
							return resolve(result);
						}).catch(err => {
							return reject(err);
						});
					} catch(err) {
						return reject(err);
					}
				})
			}



this.cancelPlacedOrder = function(data) {
var coreapi = this;
return new Promise((resolve, reject) => {
	try {
		var Order = orm.model("Order");
		var Refund = orm.model("Refund");
		let web3 = new Web3();
			web3.setProvider(new web3.providers.HttpProvider('http://54.187.126.243:8545'));
			return Order.findOne({
			where : {
				id : data.orderId
			}
		}).then(result => {
			if(!result) {
				return reject("No such orders exists");
			} if ((web3.utils.isAddress(data.walletAddress)) != true) {
				return reject("Invalid wallet address.");
			} if(result.status != "Order Placed") {
				return reject("Your Order is already " +result.status+ ". Cannot cancel order at this point.");
			}
			var HURAmountWithDeductions = result.price - 2;
			var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hurclan","type":"address"}],"name":"ethtransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';
			const contract = new web3.eth.Contract(JSON.parse(abi), '0x40e624d93110a8324920f011b80c6db0fab2b85b', { from: '0x02D462c774Ab46434920586A396958056Ab193dc', gas: 100000});
			web3.eth.personal.unlockAccount("0x02D462c774Ab46434920586A396958056Ab193dc", "Hope2pass", 1500).then(unlock =>{


				var strNoOfHUR = HURAmountWithDeductions.toString().split(".");
				var finalValue = "";
				if (strNoOfHUR.length == 2) {
					var beforeDot = strNoOfHUR[0];
					var afterDot = strNoOfHUR[1];
					var afterDotLength = strNoOfHUR[1].length;
					for(var i=0; i<(18-afterDotLength); i++) {
						afterDot += "0"
					}
					finalValue = beforeDot + afterDot;
				} else {
					finalValue = strNoOfHUR[0] + "000000000000000000"
				}
				contract.methods.transfer(data.walletAddress, finalValue).send().then(transferResult => {
						if(transferResult.status == "0x1"){
							return Refund.create({orderId : data.orderId, amount : HURAmountWithDeductions, transactionHash : transferResult.transactionHash, reason : data.reason, refundStatus : "Successful"}).then(created => {
								return Order.update({status : "Cancelled"}, {
									where : {
										id : data.orderId
									}
								}).then(updated => {
									var from = config.name_and_email_2;
								var to = result.email;
								var subject = "Order Cancellation";
								var body = 'Dear ' +result.name+ ',<br><br>Your order has been Cancelled successfully. ' +HURAmountWithDeductions+ ' HUR tokens has been transferred to your wallet address ' +data.walletAddress+ '.'
								var bcc = "";
												var attachments = "";

												return coreapi.sendMail({
												"from" : from,
									"to": to,
									"subject": subject,
									"body": body,
									"bcc" : bcc,
									"attachments" : attachments
								}).then(function(success) {
									if (success) {
										return resolve("Order cancelled successfully.");
									} else {
										return reject("Failed to send confirmation email!");
									}
								}).catch(function(err) {
									console.log("Err: ", err);
									return reject(err);
								});
								}).catch(err => {
									conlose.log("Err1: ", err);
									return reject(err);
								})
							}).catch(err => {
								console.log("Err2: ", err);
								return reject(err);
							});
						} else  {
							return reject("Something went wrong, Please try again later.");
						}
				}).catch(err => {
						return reject("Err3: ",err);
				});
			})
		}).catch(err => {
			console.log("Err4: ", err);
			return reject(err);
		})
	} catch(err) {
		console.log("Err5: ", err);
		return reject(err);
	}
})
}


			this.getAllCancelledOrdersForUser = function(data) {
					var coreapi = this;
					return new Promise((resolve, reject) => {
						try {
							var Order = orm.model("Order");
							var OrderInfo = orm.model("OrderInfo");
							var Product = orm.model("Product");

							return Order.findAll({
								where : {
									userId : data.userId,
									status : 'cancelled'
								},
								include : [{model : OrderInfo,
									include : [Product]
								}],
								order: [['id', 'DESC']]
							}).then(result => {
								return resolve(result);
							}).catch(err => {
								console.log("Err: ", err);
								return reject(err);
							});
						} catch(err) {
							return reject(err);
						}
					})
				}

				this.getProductCategoriesAndCount = function() {
						return new Promise((resolve, reject) => {
							try {
								var Product = orm.model("Product");
								return Product.findAll({
									attributes : [
										'categories',
										'categoryImageURL',
										[sequelize.fn('COUNT', sequelize.col('categories')), 'counts']
									],
									group: ['categories', 'categoryImageURL']
								}).then(result => {
									return resolve(result);
								}).catch(err => {
									console.log("Err",err);
									return reject(err);
								})
							} catch(err) {
								console.log("Err1: ", err);
								return reject(err);
							}
						})
					}


	this.getProductsForEachCategories = function() {
		return new Promise((resolve, reject) => {
			try {
				var categories = ['development boards', 'gateways', 'sensors', 'Microcontrollers and Processors', 'RF and Microwave', 'Diodes, Transistors and Thyristors', 'Kits and Tools', 'Memory Components', 'Computer Products', 'LEDs and LED Lighting', 'LED Displays', 'Others', 'Oscilloscopes, Generators and Analyzers', 'Diodes, Transistors', 'RF ICs', 'RF Modules', 'Circuit Protection'];
				var Product = orm.model("Product");
				var products = [];
				var obj = {};
				var categoryName = '';
				var data = [];

				categories.map(i => {
					return Product.findAll({
						where : {
							categories : i,
							isHidden : 0
						},
						limit : 3
			    }).then(result => {
						obj = {
							"categoryName" : i,
							"products" : result
						};
						data.push(obj);
						return resolve(data);
					}).catch(err => {
						console.log("Err: ", err)
						return reject(err);
					})
				});
			} catch(err) {
				console.log("Err1: ", err)
				return reject(err);
			}
		})
	}


	this.filterProductsBasedOnCategory = function(data) {
		return new Promise((resolve, reject) => {
			try {
				var Product = orm.model("Product");
				var offset = data.offset;
				if(offset == 0) {
					offset = 0;
				} else {
					offset = offset * 100;
				}
				return Product.findAll({
					where : {
						categories : data.category,
						isHidden : 0
					},
					offset : offset,
					limit : 100
				}).then(result => {
					return resolve(result);
				}).catch(err => {
					return reject(err);
				});
			} catch(err) {
				return reject(err);
			}
		})
	}


	this.getProductSubCategoriesAndCount = function(data) {
	  return new Promise((resolve, reject) => {
	    try {
	      var Product = orm.model("Product");
	      return Product.findAll({
	        attributes : [
	          'subCategories',
	          [sequelize.fn('COUNT', sequelize.col('subCategories')), 'counts']
	        ],
	        group: ['subCategories'],
	        where : {
	          categories : data.category
	        }
	      }).then(result => {
	        console.log(JSON.stringify(result));
	        return resolve(result);
	      }).catch(err => {
	        console.log("Err",err);
	        return reject(err);
	      })
	    } catch(err) {
	      console.log("Err1: ", err);
	      return reject(err);
	    }
	  })
	}



	// this.getProductsForEachSubCategoriesBasedOnCategories = function(data) {
	//   return new Promise((resolve, reject) => {
	//     try {
	//       var Product = orm.model("Product");
	//       var array = [];
	//       var obj = {};
	//       var finalData = [];
	//       return Product.findAll({
	//         attributes: [
	//               [Sequelize.fn('DISTINCT', Sequelize.col('subCategories')) ,'subCategories'],
	//           ],
	//         where : {
	//           categories : data.subCategory /*this is category, but keyword is given as category*/
	//         }
	//       }).then(result => {
	//         result.map(i => {
	//           array.push(i.subCategories);
	//         });
  //
	//         array.map(i => {
	//           return Product.findAll({
	//             where : {
	//               subCategories : i
	//             }
	//           }).then(result => {
	//             obj = {
	//               "subCategoryName" : i,
	//               "products" : result
	//             };
	//             finalData.push(obj);
	//             console.log(JSON.stringify(finalData));
	//             return resolve(JSON.stringify(finalData));
	//           }).catch(err => {
	//             console.log("Err: ", err)
	//             return reject(err);
	//           })
	//         });
	//       }).catch(err => {
	//         console.log("Err1: ", err)
	//         return reject(err);
	//       });
	//     } catch(err) {
	//       console.log("Err2: ", err)
	//       return reject(err);
	//     }
	//   })
	// }


	this.getProductBasedOnSubCategories = function(data) {
		return new Promise((resolve, reject) => {
			try {
				console.log("data: ", data);
				var Product = orm.model("Product");
				var offset = data.offset;
				if(offset == 0) {
					offset = 0;
				} else {
					offset = offset * 100;
				}
				return Product.findAll({
					where : {
						subCategories : data.subCategoryName,
						isHidden : 0
					},
					offset : offset,
					limit : 100
				}).then(result => {
					console.log("Result: ", result);
					return resolve(result);
				}).catch(err => {
					return reject(err);
				})
			} catch(err) {
				console.log("Err1: ", err);
				return reject(err);
			}
		})
	}


	this.sendMailForFailedPayments = function(data) {
		var coreapi = this;
		return new Promise((resolve, reject) => {
			try {
				console.log("Data: ", data);
				var Order = orm.model("Order");
				var OrderInfo = orm.model("OrderInfo");
				var Product = orm.model("Product");
				var Payment = orm.model("Payment");
				var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


				return Order.findAll({
					where : {
						orderNo : data.orderNo
					},
					include : [ {
					model : OrderInfo,
					include : [ Product ]
					}, {model : Payment} ]

				}).then(result => {
					console.log("rESULT: ",  result);
					if(!result) {
						return reject("Something went wrong.");
					}
					var i = 0;
					var today = new Date(result[0].createdAt);
					var rawDeliveryDate = new Date(today.getFullYear(), today.getMonth(), today.getDate()+6);
					var year = rawDeliveryDate.getFullYear();
					var monthNum = rawDeliveryDate.getMonth();
					var month = months[monthNum];
					var dateNum = rawDeliveryDate.getDate();
					var dayNum = rawDeliveryDate.getDay();
					var day = days[dayNum];
					var deliveryDate = day + ', ' +dateNum+ ' ' +month+ ' ' + year;
					var from = config.name_and_email;
					var to = data.email;
					var subject = "Hurify Payment Failed for Order No: " + data.orderNo;
					var body = '<html><body><div style = "text-align:left;position: absolute;margin: 0px auto;top: 20%;left: 40%;right:20%"><div style="color: #062985; position: relative;text-align:left;"><a href="https://platform.hurify.co"><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"></a></div><div><br><p style ="position: relative;" >Dear ' +result[0].name+ ' ,<br><br>You payment for this order has been failed.<br><br>Below is your order information.<br><br></p></div><div style="position: relative"><table><tr style = "text-align: left"><th style = "color: #707070;">Order Number:</th><td>' +result[0].orderNo+ '</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Name:</th><td>' +result[0].name+ '</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Order Date:</th><td>' +result[0].createdAt+ '</td></tr></table></div><div style="position: relative"><br><h2>Payment Information</h2><table><tr style = "text-align: left"><th style = "color: #707070;">Tx Hash</th><td>' +result[0].Payment.paymentRef+ '</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Amount:</th><td>' +result[0].price+ ' HUR</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Status:</th><td style = "color :red"><b>Failed</b></td></tr></table></div><div><br><h2>Order Item(s)</h2><table>'


					for (var i = 0; i < result[0].OrderInfos.length; i++) {
						body = body + '<tr style = "text-align: left"><td style = "color: #707070;"><img src="' +result[0].OrderInfos[i].Product.image+ '" style = "margin-left:auto;margin-right:auto;vertical-align:middle;width:30%;display:inline-block;"></td><td>' +result[0].OrderInfos[i].Product.name+ '</td></tr>'
					}

					body = body + '</table></div><div><br><h2>Order Summary</h2><table><tr style = "text-align: left"><th style = "color: #707070;">Sub Total:</th><td>' +result[0].price+ ' HUR</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Discount:</th><td>0 HUR</td></tr><tr style = "text-align: left"><th style = "color: #707070;">Total:</th><td>' +result[0].price+ ' HUR</td></tr></table></div><div><p>Thank you,</p><p>The Hurify Team</p><p>For any queries: <a href="mailto:support@hurify.co" style="color: #3ba1da;text-decoration: none;">support@hurify.co</a></p><p>Visit us at: <a href="https://platform.hurify.co">platform.hurify.co</a></p></div></div></body></html>'
					var bcc = "Arrow_orders@hurify.co";
	                var attachments = [{ filename : "Hur_logo.png", path : "https://platform.hurify.co:1800/public/shared/shop/Hur_logo.png", cid : "image1"}];

	                return coreapi.sendMail({
						"from" : from,
						"to": to,
						"subject": subject,
						"body": body,
						"bcc" : bcc,
						"attachments" : attachments
					}).then(function(success) {
						if (success) {
							return resolve("Mail sent successfully!");
						} else {
							return reject("Failed to send confirmation email!");
						}
					}).catch(function(err) {
						console.log("Err: ", err);
						return reject(err);
					});
				}).catch(err => {
					console.log("Err1: ", err);
					return reject(err);
				});
			} catch(err) {
				console.log("Err2: ", err);
				return reject(err);
			}
		})
	}



	this.checkPaymentStatus = function() {
		var coreapi = this;
		return new Promise(function(resolve, reject) {
			try {
				var today = new Date();
				console.log("inside checkPaymentStatus at " + today);
				var web3 = new Web3();
				web3.setProvider(new web3.providers.HttpProvider('http://106.51.44.203:8545'));
				var Order = orm.model("Order");
				var OrderInfo = orm.model("OrderInfo");
				var Product = orm.model("Product");
				var Payment = orm.model("Payment");
				var apiKey = 'VHBYN19UMAJFH3TK9X8PS942B1ZKDVXU4Q';
				var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
				var status = 'Payment Confirmation Pending';
				return Order.findAll({
					where : {
						status : status
					},
					include : [Payment]
				}).then(result => {
					if(!result) {
						console.log("No more rows to update");
					}

					return result.map(i => {
						console.log("Hash: ", i);
						request('https://api.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=' +i.Payment.paymentRef+ '&apikey=' + apiKey, (err, response, body) => {
							if(err) {
								console.log('error:', err);
							}
							console.log(JSON.stringify(body));
						  	body = JSON.parse(body);
						  	if (body.result.status === 1 || body.result.status === '1') {
								return Order.update({status : 'Order Placed'}, {
									where : {
										id : i.id
									}
								}).then(updated => {
									console.log("In Success Order");
									return coreapi.sendMailForSuccessfulOrders(i).then(mailResult => {
										return coreapi.sendOrderMailToArrow(i).then(arrowMail => {
											return resolve(mailResult);
										}).catch(err => {
											return reject(err);
										});
									}).catch(err => {
										return reject(err);
									});
								}).catch(err => {
									return reject(err);
								});
							} else if(body.result.status == 0 || body.result.status == 0) {
								if (i.flagMail < 96) {
									var flagMail = i.flagMail + 1;
									return Order.update({flagMail: flagMail},{
										where : {
											id : i.id
										}
									}).then(updated => {
										return resolve("updated flagMail.");
									}).catch(err => {
										console.log("Err: ", err);
										return reject(err);
									});
								} else {
									return Order.update({status : 'Payment Failed'}, {
										where : {
											id : i.id
										}
									}).then(updated => {
										console.log("In Failed Order");
										return coreapi.sendMailForFailedPayments(i).then(mailResult => {
											console.log("Order Failed");
											return resolve(mailResult);
										}).catch(err => {
											return reject(err);
										});
									}).catch(err => {
										return reject(err);
									});
								}
							} else {
								console.log("Invalid transaction Hash.");
							}
						});
					});
				}).catch(err => {
					return reject(err);
				});
			} catch(err) {
				return reject(err);
			}
		})
	}

	this.getAllOrdersListForAdmin = function() {
			return new Promise((resolve, reject) => {
				try {
					var Order = orm.model("Order");
					var OrderInfo = orm.model("OrderInfo");
					var Product = orm.model("Product");
					return Order.findAll({
						include : [ {
							model : OrderInfo,
							include : [ Product ]
						} ],
						order: [['id', 'DESC']]
					}).then(result => {
						console.log(result);
						return resolve(result);
					}).catch(err => {
						console.log("Err: ", err);
						return reject(err);
					});
				} catch(err) {
					console.log("Err: ", err);
					return reject(err);
				}
			})
		}



			this.getOrdersListBasedOnStatusForAdmin = function(data) {
			return new Promise((resolve, reject) => {
				try {
					var Order = orm.model("Order");
					var OrderInfo = orm.model("OrderInfo");
					var Product = orm.model("Product");

					return Order.findAll({
						where : {
							status : data.status
						},
						include : [{model : OrderInfo,
							include : [{
								model : Product
							}]
						}],
						order: [['id', 'DESC']]
					}).then(result => {
						console.log(result);
						return resolve(result);
					}).catch(err => {
						console.log("Err: ", err);
						return reject(err);
					});
				} catch(err) {
					console.log("Err: ", err);
					return reject(err);
				}
			})
		}


		this.updateOrderStatusAndTrackingDetailsByAdmin = function(data) {
			var coreapi = this;
			return new Promise((resolve, reject) => {
				try {
					var Order = orm.model("Order");
					var obj = {};
					if(data.status == 'Order Placed' || data.status == 'Order placed') {
						obj = {
							status : data.status,
							trackingURL : data.trackingURL
						}
					} else {
						obj = {
							status : data.status
						}
					}
					return Order.findOne({
						where : {
							id : data.id
						}
					}).then(result => {
						if(!result) {
							return reject("No such order exists!");
						}
						return Order.update(obj,{
							where : {
								id : data.id
							}
						}).then(updated => {
							if (data.status == 'Order Placed' || data.status == 'Order placed') {
								return coreapi.sendMailForSuccessfulOrders(data).then(sent => {
									return resolve("Updated Successfully");
								}).catch(err => {
									console.log("err: ",err);
									return reject(err);
								})
							} else if(data.status == 'Delivered' || data.status == 'delivered') {
								return coreapi.sendMailForDeliveredOrders(data).then(sent => {
									return resolve("Updated Successfully");
								}).catch(err => {
									console.log("err1: ",err);
									return reject(err);
								})
							}
						}).catch(err => {
							console.log("err2: ",err);
							return reject(err);
						})
					}).catch(err => {
						console.log("Err3: ", err);
						return reject(err);
					})
				} catch (err) {
					console.log("Err4: ", err);
					return reject(err);
				}
			})
		}


		this.sendMailForDeliveredOrders = function(data) {
		var coreapi = this;
		return new Promise((resolve, reject) => {
			try {
				console.log("Data: ", data);
				var Order = orm.model("Order");
				return Order.findOne({
					where : {
						id : data.id
					}
				}).then(result => {
					console.log(JSON.stringify(result));
					var to = result.email;
					var body = '<div>Hi ' +result.name+ ',<br/><br/>Your package with Order number ' +result.orderNo+ ' has been delivered.</div>';

					var subject = 'Delivered- Hurify Order No. ' + result.orderNo;
					var bcc = 'arrow_orders@hurify.co';
					var attachments = '';

					return coreapi.sendMail({
						"from" : config.name_and_email,
						"to": to,
						"subject": subject,
						"body": body,
						"bcc" : bcc,
						"attachments" : attachments
					}).then(function(success) {
						if (success) {
							return resolve("Mail sent successfully!");
						} else {
							return reject("Failed to send confirmation email!");
						}
					}).catch(function(err) {
						console.log("Err: ", err);
						return reject(err);
					});
				}).catch(err => {
					console.log("Err1: ", err);
					return reject(err);
				})
			} catch(err) {
				console.log("Err2: ", err);
				return reject(err);
			}
		})
	}


	this.sendMailForShippedOrders = function(data) {
		var coreapi = this;
		return new Promise((resolve, reject) => {
			try {
				var Order = orm.model("Order");
				return Order.findOne({
					where : {
						id : data.orderId
					}
				}).then(result => {
					var to = result.email;
					var body = '<div style = "margin-left:20%;margin-right: 20%"><div style ="position:relative;"><p>Dear, ' +result.name+ '<br/><br/></p><p>A shipment has been made against your Arrow.com order number ' +result.orderNo+ '<br/><br/></p><p>TrackingURL: ' +result.trackingURL+ '<br/><br/></p><p>This is shipment #1.Your order result.orderNo has now been fully shipped.</p><p>NOTE: If you paid via credit card, you will receive a separate charge per invoice as reflected in each of your invoices. These charges will add up to your order\'s original grand total.</p><p></p><div><p>Thank you,</p><p>The Hurify Team</p><p>For any queries: <a href="mailto:support@hurify.co" style="color: #3ba1da;text-decoration: none;">support@hurify.co</a></p><p>Visit us at: <a href="https://platform.hurify.co">platform.hurify.co</a></p></div></div></div>';

					var subject = 'Shipped- Hurify Order No. ' + result.orderNo;
					var bcc = 'arrow_orders@hurify.co';
					var attachments = '';

					return coreapi.sendMail({
						from : config.name_and_email,
						"to": to,
						"subject": subject,
						"body": body,
						"bcc" : bcc,
						"attachments" : attachments
					}).then(function(success) {
						if (success) {
							return resolve("Mail sent successfully!");
						} else {
							return reject("Failed to send confirmation email!");
						}
					}).catch(function(err) {
						console.log();
						return reject(err);
					});
				}).catch(err => {
					return reject(err);
				})
			} catch(err) {
				return reject(err);
			}
		})
	}


		// this.updateOrderStatusAndTrackingDetailsByAdmin = function(data) {
		// 	return new Promise((resolve, reject) => {
		// 		try {
		// 			var Order = orm.model("Order");
		// 			return Order.findOne({
		// 				where : {
		// 					id : data.id
		// 				}
		// 			}).then(result => {
		// 				if(!result) {
		// 					return reject("No such order exists!");
		// 				}
		// 				return Order.update({status : data.status, trackingURL : data.trackingURL},{
		// 					where : {
		// 						id : data.id
		// 					}
		// 				}).then(updated => {
		// 					return resolve("Order status updated successfully.");
		// 				}).catch(err => {
		// 					return reject(err);
		// 				})
		// 			}).catch(err => {
		// 				return reject(err);
		// 			})
		// 		} catch (err) {
		// 			return reject(err);
		// 		}
		// 	})
		// }


		// this.addTrackingDetailsToOrders = function(data) {
		// 	return new Promise((resolve, reject) => {
		// 		try {
		// 			var Order = orm.model("Order");
		// 			return Order.findOne({
		// 				where : {
		// 					id : data.id
		// 				}
		// 			}).then(result => {
		// 				if(!result) {
		// 					return reject("No such order exists.");
		// 				}
		// 				return Order.update({trackingURL : data.trackingURL},{
		// 					where : {
		// 						id : data.id
		// 					}
		// 				}).then(updated => {
		// 					return resolve("Order status updated successfully.");
		// 				}).catch(err => {
		// 					return reject(err);
		// 				})
		// 			}).catch(err => {
		// 				return reject(err);
		// 			});
		// 		} catch(err) {
		// 			return reject(err);
		// 		}
		// 	})
		// }


		this.getProductsBasedOnOrderId = function(data) {
				return new Promise((resolve, reject) => {
					try {
						var Order = orm.model("Order"),
							OrderInfo = orm.model("OrderInfo"),
							Product = orm.model("Product");

						return Order.findAll({
							where : {
								id : data.orderId
							},
							include : [{model : OrderInfo,
								include : [Product]
							}]
						}).then(result => {
							return resolve(result);
						}).catch(err => {
							return reject(err);
						})
					} catch(err) {
						return reject(err);
					}
				})
			}

			this.updateCookiePolicyFlag = function(data) {
					return new Promise((resolve, reject) => {
						try {
							var User = orm.model("User");
							var currentTime = new Date();
							return User.update({cookiePolicyFlag : 1, gdprApprovalFlag : 1, gdprApprovalTime : currentTime}, {
								where : {
									id : data.userId
								}
							}).then(updated => {
								return resolve("Success");
							}).catch(err => {
								console.log(err);
								return reject(err);
							});
						} catch(err) {
							console.log(err);
							return reject(err);
						}
					})
				}


				this.sendOrderMailToArrow = function(data) {
			    var coreapi = this;
			    return new Promise((resolve, reject) => {
			        try {
			            var Order = orm.model("Order");
			            var OrderInfo = orm.model("OrderInfo");
			            var Product = orm.model("Product");

			            return Order.findAll({
			                where: {
			                    orderNo: data.orderNo
			                },
			                include: [{
			                    model: OrderInfo,
			                    include: [Product]
			                }]
			            }).then(result => {
			                var to = "arrow_orders@hurify.co";
			                var subject = 'PO for Order No. ' + result[0].orderNo;
			                var body = '<div style="width:700px; margin:0px auto;"><h2 style="margin:5px 0px">Hurify Marketplace</h2><img src="cid:image1" style = "margin-left:auto;margin-right:auto;" width="10%"><hr/><div><h2 style="margin:5px 0px">Shipping Details</h2><hr/><div><table style="width:80%; text-align:left;"><tr><th style="width:40%;"><h4 style="margin:5px 0px">Billing Address<hr style="width:90%; margin-left:0px"/></h4></th><th style="width:40%;"><h4 style="margin:5px 0px">Shipping Address<hr style="width:90%; margin-left:0px"/></h4></th></tr><tr><td><p style="padding:5px">Account: 2356134<br/>Hurify Inc.,<br/>10400 NE 4th Ste 500<br/>Bellevue<br/>WA<br/>98004</p></td><td><p style="padding:5px">' +result[0].email+ '<br/>' + result[0].name + ',<br/> ' + result[0].mobile + ',<br/>' + result[0].address + ',<br/>' + result[0].city + ',<br/>' + result[0].state + ',<br/>' + result[0].country + ',<br>' + result[0].pincode + '</p></td></tr></table></div><div><h2 style="margin:5px 0px">Order Details</h2><hr/><div><h5 style="margin:2px 0px"></h5><hr/></div><div style="width:700px; display:inline-block;">';


											for (var i = 0; i < result[0].OrderInfos.length; i++) {
												body = body + '<div style="width:350px;"><h3 style="margin:2px 0px">'+result[0].OrderInfos[i].Product.name+'</h3><div style="text-align:right"><p style="margin:2px 2px">Quantity:'+result[0].OrderInfos[i].quantity+'</p><p style="margin:2px 2px">product Id: '+result[0].OrderInfos[i].Product.arrowProductId+'</p><hr/></div></div></div>'
											}

			                body = body + '<br/><div style="text-align:right; "></div></div></div></div><div style="text-align:left"><br/><br/><p>Thank you,</p><p>The Hurify Team</p><p>For any queries: <a href="mailto:support@hurify.co" style="color: #3ba1da;text-decoration: none;">support@hurify.co</a></p><p>Visit us at: <a href="https://platform.hurify.co">platform.hurify.co</a></p></div>';

			                var bcc = '';
			                var attachments = [{
			                    filename: "Hur_logo.png",
			                    path: "https://platform.hurify.co:1800/public/shared/shop/Hur_logo.png",
			                    cid: "image1"
			                }];

			                return coreapi.sendMail({
			                    "from": config.name_and_email,
			                    "to": to,
			                    "subject": subject,
			                    "body": body,
			                    "bcc": bcc,
			                    "attachments": attachments
			                }).then(function(success) {
			                    if (success) {
			                        console.log(JSON.stringify(result));
			                        return resolve("Mail sent successfully!");
			                    } else {
			                        return reject("Failed to send confirmation email!");
			                    }
			                }).catch(function(err) {
			                    console.log("Err: ", err);
			                    return reject(err);
			                });
			            }).catch(err => {
			                console.log("Err1: ", err);
			                return reject(err);
			            });
			        } catch (err) {
			            console.log("Err2: ", err);
			            return reject(err);
			        }
			    })
			}


}


function isObject(data) {
    try {
        var data = JSON.parse(data);
        return true;
    } catch (err) {
        return false;
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
