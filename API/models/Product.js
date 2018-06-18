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
        description : {
            type     : Sequelize.TEXT,
            allowNull: true
        },
        priceInDollars : {
            type     : Sequelize.DOUBLE,
            allowNull: false
        },
        totalUnits : {
            type     : Sequelize.DOUBLE,
            allowNull: true
        },
        image : {
            type     : Sequelize.STRING,
            allowNull: true
        },
        documentPath : {
            type     : Sequelize.STRING,
            allowNull: true
        },
      	specifications : {
      	    type       : Sequelize.TEXT,
      	    allowNull  : true
      	},
      	price     : {
      	    type       : Sequelize.DOUBLE,
      	    allowNull  : true
      	},
      	productLink    : {
      	    type       : Sequelize.STRING,
      	    allowNull  : true
      	},
      	categories    : {
      	    type       : Sequelize.STRING,
      	    allowNull  : true
      	},
      	subCategories    : {
      	    type       : Sequelize.STRING,
      	    allowNull  : true
      	},
      	arrowProductId    : {
      	    type       : Sequelize.INTEGER,
      	    allowNull  : true
      	},
      	categoryImageURL    : {
      	    type       : Sequelize.STRING,
      	    allowNull  : true
      	},
      	fulfilledBy    : {
      	    type       : Sequelize.STRING,
      	    allowNull  : true
      	},
      	manufacturer    : {
      	    type       : Sequelize.STRING,
      	    allowNull  : true
      	},
      	arrowPartNum    : {
      	    type       : Sequelize.STRING,
      	    allowNull  : true
      	}
    },
    options : {
        timestamps: true,
        tableName : "products",
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
