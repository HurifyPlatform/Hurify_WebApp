var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        firstName : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        lastName : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        email : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        country : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        currency : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        walletAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
       transactionHash : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       numberOfCryptoCurrency : {
           type     : Sequelize.DOUBLE,
           allowNull: true
       },
       purchaseCurrencyAddress : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       requestIP : {
	        type     : Sequelize.STRING,
	        allowNull: true
	     },
       referralCode : {
	        type     : Sequelize.STRING,
	        allowNull: true
	     },
       noOfTokens : {
          type     : Sequelize.DOUBLE,
          allowNull: true
       },
       isMailSent : {
          type     : Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue : 0
       },
       HURTransactionHash : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       address1 : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       address2 : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       zipCode : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       state : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       userSelectedCountry : {
           type     : Sequelize.STRING,
           allowNull: true
       },
       riskFlag : {
          type     : Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue : 0
       },
       HURTokens : {
          type     : Sequelize.DOUBLE,
          allowNull: true
       },
       dispute : {
          type     : Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue : 0
       },
       status : {
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
        tableName : "token_sale",
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
