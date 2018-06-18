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
        country : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        state : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        currency : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        numberOfCryptoCurrency : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        }
    },
    options : {
        timestamps: true,
        tableName : "tokenSale_whiteList",
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
