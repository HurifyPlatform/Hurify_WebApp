var hurify = artifacts.require('./Escrow.sol');

module.exports = function(deployer) {
	deployer.deploy(hurify).then(function(){
		console.log(hurify.address);
		return hurify.address;
		});
}