var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        from : {
            type     : Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0
        },
        to : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        description : {
        	type     : Sequelize.STRING,
            allowNull: false
        },
        shortDesc : {
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
