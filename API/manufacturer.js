var Promise = require("bluebird");
const Sequelize = require('sequelize');
var request = require('request');
const sequelize = new Sequelize('hurify_production', 'root', 'HurPaasPro', {
  host: 'dexterdb.cetqrhjlkynl.us-west-2.rds.amazonaws.com',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 100000
  },

  operatorsAliases: false
});

const Product = sequelize.define('product', {
	id: {
    	type : Sequelize.INTEGER,
    	allowNull: false,
    	autoIncrement: true,
    	primaryKey: true
 	},
	name : {
	    type     : Sequelize.STRING,
	    allowNull: false
	},
	description : {
	    type     : Sequelize.TEXT,
	    allowNull: true
	},
	price : {
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
	    type     : Sequelize.TEXT,
	    allowNull: true
	},
	priceInHUR : {
	    type     : Sequelize.DOUBLE,
	    allowNull: true
	},
	categories : {
	    type     : Sequelize.STRING,
	    allowNull: true
	},
	subCategories : {
	    type     : Sequelize.STRING,
	    allowNull: true
	},
	arrowProductId : {
	    type     : Sequelize.INTEGER,
	    allowNull: false
	},
	smallImage : {
	    type     : Sequelize.STRING,
	    allowNull: true
	},
	productLink : {
	    type     : Sequelize.STRING,
	    allowNull: true
	},
	manufacturer : {
	    type     : Sequelize.STRING,
	    allowNull: true
	},
	arrowPartNum : {
	    type     : Sequelize.STRING,
	    allowNull: true
	},
	categoryImageURL : {
	    type     : Sequelize.STRING,
	    allowNull: true
	},
	createdAt: Sequelize.DATE,
	updatedAt: Sequelize.DATE
});

sequelize.sync();

var Op = Sequelize.Op;

var secretKey = 'dcc80e4264c750f800a175194135435505b14994b25acd0f9194d29f9727d1f5';
var user = 'hurify';
var counter = 0;

var getAllProductsName = function() {
	return new Promise((resolve, reject) => {
		try {
			return Product.findAll({
				attributes : ['id','name'],
				where : {
					manufacturer : null
				},
				limit : 50
				//order: [['id','DESC']]
			}).then(result => {
				console.log(result);
				return result.map(i => {
					request('http://api.arrow.com/itemservice/v3/en/search/token?login='+user+'&apikey='+secretKey+'&search_token='+i.name, (err, response, body) => {
						if (err) {
							console.log(err);
						}
						var array = JSON.parse(body);
						 console.log(body);
						if (array.itemserviceresult.data[0] == null) {
							return ('No Data.');
						} else {
							return Product.update({manufacturer : array.itemserviceresult.data[0].PartList[0].manufacturer.mfrName},{
							 	where : {
							 		id : i.id
							 	}
							}).then(updated => {
								console.log(i.id + ' no. updated.');
							}).catch(err => {
								console.log(i.id + ' no. failed.');
							});
						}
					});
				});
			}).catch(err => {
				console.log(err);
			});
		} catch (err) {
			console.log(err)
		}
	})
}


getAllProductsName();
