var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        name : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        userId : {
            type     : Sequelize.INTEGER,
            allowNull: false,
        },
        salaryPerHour : {
            type     : Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        userDesc : {
            type     : Sequelize.TEXT,
            allowNull: false
        },
        categories : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        languages : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        jobTitle : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        skills : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        country : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        profileUpdateStatus : {
            type     : Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        }
    },
    options : {
        timestamps: true,
        tableName : "developers",
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