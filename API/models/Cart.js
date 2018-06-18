var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        userId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        productId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        quantity : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        price : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        }
    },
    options : {
        timestamps: true,
        tableName : "cart",
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
