var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        text : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        captchaToken : {
            type     : Sequelize.STRING,
            allowNull: false
        }
    },
    options : {
        timestamps: true,
        tableName : "captchas",
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
