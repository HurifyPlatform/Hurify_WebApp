var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        projectId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        clientId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        developerId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        rating : {
            type     : Sequelize.INTEGER,
            allowNull: false
        }
    },
    options : {
        timestamps: true,
        tableName : "feedbacks",
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
