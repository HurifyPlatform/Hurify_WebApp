var namespace = require("../namespace");
var orm = require("../orm")
var Sequelize = orm.Seq();
var sequelize = require("sequelize");

module.exports = {
    model : {
        projectId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        developerId : {
            type     : Sequelize.INTEGER,
            allowNull: false
        },
        bidValue : {
        	type     : Sequelize.DECIMAL(10,2),
            allowNull: false
        },
        projectExpLevel : {
            type     : Sequelize.STRING,
            allowNull: false
        },
        approvalStatus : {
            type     : Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue : 0
        }
    },
    options : {
        timestamps: true,
        tableName : "applied_projects",
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
