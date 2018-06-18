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
        name : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        email : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        mobile : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        address : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        city : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        state : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        country : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        orderNo : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        price : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        status : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        pincode : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        taxAmount : {
            type     : Sequelize.DOUBLE,
            allowNull: true
        },
        deliveryDate : {
            type     : Sequelize.STRING,
            allowNull: true
        },
	flagMail : {
	    type : Sequelize.INTEGER,
	    allowNull: false,
	    defaultValue: 0
	}
    },
    options : {
        timestamps: true,
        tableName : "orders",
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
