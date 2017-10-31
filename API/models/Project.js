var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        projectName : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        technology : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        category : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        price : {
            type     : Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        experienceLevel : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        estimatedDays : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        projectAbstract : {
            type     : Sequelize.STRING(120),
            allowNull: false
        },
        clientId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        projectDesc : {
            type     : Sequelize.TEXT,
            allowNull: false
        },
        projectStatusId : {
            type     : Sequelize.INTEGER,
            allowNull: false,
        },
        approvalFlag : {
            type     : Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: 0
        },
        attachmentPath : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        developerId : {
            type     : Sequelize.INTEGER,
            allowNull: true
        }
    },
    options : {
        timestamps: true,
        tableName : "projects",
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