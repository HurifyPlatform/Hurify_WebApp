var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        email : {
            type     : Sequelize.STRING,
            allowNull: false,
            unique   : true
        },
        password : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        active : {
            type     : Sequelize.BOOLEAN, 
            allowNull: false,
            defaultValue: 0
        },
        emailConfirmationToken : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        emailConfirmationTokenExpTime : {
            type     : Sequelize.DATE,
            allowNull: false
        },
        forgotPasswordToken : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        forgotPasswordTokenExpTime : {
            type     : Sequelize.DATE,
            allowNull: true
        },
        userAccountType : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        profilePhotoPath : {
            type     : Sequelize.STRING,
            allowNull: true
        }
    },
    options : {
        timestamps: true,
        tableName : "users",
        hooks : {
            beforeBulkCreate : function(result) {
            },
            beforeBulkUpdate : function(result) {
            },
            beforeValidate : function(result) {
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