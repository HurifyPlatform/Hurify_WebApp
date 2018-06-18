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
        paymentRef : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        paymentStatus : {
            type     : Sequelize.STRING,
            allowNull: false
        }
    },
    options : {
        timestamps: true,
        tableName : "payments",
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
