var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        name : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        userId : {
            type     : Sequelize.INTEGER,
            allowNull: false,
        },
        userDesc : {
            type     : Sequelize.TEXT,
            allowNull: false
        },
        languages : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        country : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        profileUpdateStatus : {
            type     : Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    },
    options : {
        timestamps: true,
        tableName : "clients",
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