var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        email : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        subject : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        query : {
            type     : Sequelize.TEXT,
            allowNull: false
        },
        walletAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        resolution : {
            type     : Sequelize.TEXT,
            allowNull: true
        },
        status : {
            type     : Sequelize.BOOLEAN,
            allowNull: true
        }
    },
    options : {
        timestamps: true,
        tableName : "user_queries",
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
