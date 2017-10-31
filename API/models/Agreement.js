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
        clientHURAddress : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        developerHURAddress : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        bidValue : {
            type     : Sequelize.DECIMAL(10,2),
            allowNull : false
        },
        estimatedDays : {
            type     : Sequelize.INTEGER,
            allowNull: false
        }
    },
    options : {
        timestamps: true,
        tableName : "agreements",
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