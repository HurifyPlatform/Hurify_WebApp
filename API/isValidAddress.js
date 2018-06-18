var Promise = require("bluebird");
const Sequelize = require('sequelize');
const Web3 = require('web3');
const sequelize = new Sequelize('hurify_production', 'root', 'MoboproDB2018', {
  host: 'dexterdb.cetqrhjlkynl.us-west-2.rds.amazonaws.com',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators
  operatorsAliases: false
});

const Airdrop = sequelize.define('air_drop', {
  id: {
    type : Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true
  },
  userId : {
      type     : Sequelize.INTEGER,
      allowNull: true
  },
  walletAddress : {
      type     : Sequelize.STRING,
      allowNull: true
  },
  status : {
      type     : Sequelize.STRING,
      allowNull: true,
  }
},{
  freezeTableName: true,
  timestamps : true
});

sequelize.sync(); //uncomment this line to create the table if it doesn't exists.

var count = 0;

var isValid = function() {
  return new Promise((resolve, reject) => {
    try {
      let web3 = new Web3();
      web3.setProvider(new web3.providers.HttpProvider('http://34.214.122.212:8545'));
        return Airdrop.findAll({}).then(data => {
          return data.map(i => {
            if((web3.utils.isAddress(i.walletAddress)) == true) {
              return Airdrop.update({status : "Valid"}, {
                where : {
                  id : i.id
                }
              }).then(updated => {
                count++;
                console.log("Sr. " +count+ ". Valid wallet Address.");
              }).catch(err => {
                console.log(err);
              });
            } else {
              return Airdrop.update({status : "Invalid"},{
                where : {
                  id : i.id
                }
              }).then(update => {
                count++
                console.log("Sr. " +count+ ". invalid wallet address.");
              }).catch(err => {
                console.log(err);
              });
            }
          });
          console.log(array);
        }).catch(err => {
          console.log(err);
        });
    } catch(err) {
      return reject(err);
    }
  });
}

isValid();
