var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        from : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        to : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        description : {
        	type     : Sequelize.STRING,
            allowNull: false
        },
        shotDesc : {
            type     : Sequelize.STRING,
            allowNull: false
        }
    },
    options : {
        timestamps: true,
        tableName : "notifications",
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
