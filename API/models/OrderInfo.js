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
        productId : {
            type     : Sequelize.INTEGER,
            allowNull: true
        },
        quantity : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        price : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        deliveryStatus : {
            type     : Sequelize.STRING,
            allowNull: true
        }
    },
    options : {
        timestamps: true,
        tableName : "order_info",
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
