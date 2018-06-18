var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        email : {
            type     : Sequelize.STRING,
            allowNull: false,
            unique   : true
        },
        password : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        active : {
            type     : Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        emailConfirmationToken : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        emailConfirmationTokenExpTime : {
            type     : Sequelize.DATE,
            allowNull: true
        },
        forgotPasswordToken : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        forgotPasswordTokenExpTime : {
            type     : Sequelize.DATE,
            allowNull: true
        },
        userAccountType : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        profilePhotoPath : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        tokenSaleStatus : {
            type     : Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        profileUpdateStatus : {
            type     : Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        uuid : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        walletAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        purchaseCurrencyAddress : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        referralCode : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        referrerCode : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        tokenSaleWhiteListPageFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       tokenSalePageFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       tokenSaleWhiteListFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       telegramBountyFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       productHuntFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       KYCFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       blackList : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
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
       },
       isAdmin : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       cookiePolicyFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       gdprApprovalFlag : {
           type     : Sequelize.BOOLEAN,
           allowNull: true
       },
       is_deleted : {
           type     : Sequelize.BOOLEAN,
           allowNull: false,
           defaultValue: 0
       },
       gdprApprovalTime : {
           type     : Sequelize.DATE,
           allowNull: true
       }
    },
    options : {
        timestamps: true,
        tableName : "users",
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
