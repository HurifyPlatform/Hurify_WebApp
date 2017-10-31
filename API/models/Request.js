var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        requestId:  {
            type     : Sequelize.STRING,
            allowNull: false,
            unique   : true
        },
        requestBy : {
            type     : Sequelize.STRING,
            allowNull: false,
        },
        requestToken : {
            type     : Sequelize.STRING,
            allowNull: false,
        },
        requestData : {
            type     : Sequelize.TEXT,
            allowNull: true,
        },
        requestUrl : {
            type : Sequelize.STRING,
            allowNull : false,
        },
        userId : {
            type     : Sequelize.BIGINT, 
            allowNull: false,
        },
        status : {
            type     : Sequelize.STRING,
            allowNull: true,
        },
        errorMsg : {
            type : Sequelize.TEXT,
            allowNull : true
        }
    },
    options : {
        timestamps: true,
        tableName : "requests",
        hooks : {
            beforeValidate : function(request) {
            	var user = namespace.get("user");
            	if(user) {
            		request["userId"] = user.id;
            		request["requestBy"] = user.email;
            	}
            	else {
            		if(request.requestUrl == '/login/authenticate') {
	            		var requestData = JSON.parse(request.requestData);
                        if ("email" in requestData) {
                            request["userId"] = 0;
                            request["requestBy"] = requestData.email;   
                        } else {
                            request["userId"] = 0;
                            request["requestBy"] = 'unknownEmail';
                        }
	            	} else {
		            	request["userId"] = 0;
		            	request["requestBy"] = 'unknownEmail';
		            }
		        }
            },
            beforeCreate : function(result) {
            },
            beforeUpdate : function(result) {
            },
            beforeFindAll : function(result) {
            },
            beforeFind : function(result) {
            }
        }
    }
}