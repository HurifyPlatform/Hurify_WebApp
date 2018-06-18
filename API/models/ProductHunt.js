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
        productHuntId : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        walletAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        referralCode : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        HURTokens : {
            type     : Sequelize.DOUBLE,
            allowNull: true
        },
        HURTransactionHash : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        stakes : {
            type     : Sequelize.DOUBLE,
            allowNull: true
        }
    },
    options : {
        timestamps: true,
        tableName : "product_hunt",
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
