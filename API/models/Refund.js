var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        orderId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        amount : {
            type     : Sequelize.DOUBLE,
            allowNull: true
        },
        transactionHash : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        reason : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        refundStatus : {
            type     : Sequelize.STRING,
            allowNull: true
        }
    },
    options : {
        timestamps: true,
        tableName : "refunds",
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
