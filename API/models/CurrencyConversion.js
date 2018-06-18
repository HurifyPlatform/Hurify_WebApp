var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        btc : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        eth : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        ltc : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        dash : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        bch : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        btg : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        hur : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        btcAddress : {
          type     : Sequelize.STRING,
          allowNull: true
        },
        ethAddress : {
          type     : Sequelize.STRING,
          allowNull: true
        },
        ltcAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        dashAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        bchAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        btgAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        }
    },
    options : {
        timestamps: true,
        tableName : "currency_conversion",
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
