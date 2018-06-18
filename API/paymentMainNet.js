const Web3 = require('web3');
var Promise = require("bluebird");

var payment = function() {
 return new Promise(function(resolve, reject) {
    try {
                let web3 = new Web3();
                web3.setProvider(new web3.providers.HttpProvider('http://34.214.122.212:8545'));

		var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"tokensup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"},{"name":"_type","type":"uint256"}],"name":"hurifymint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"}],"name":"hurmint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hurclan","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';

                 const contract = new web3.eth.Contract(JSON.parse(abi), '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47', { from: '0x1A4f41ae92E652Fe9F2a94074d048528E94B1F18', gas: 30000});

                web3.eth.personal.unlockAccount("0x1A4f41ae92E652Fe9F2a94074d048528E94B1F18", "roots", 1500).then(result =>{
                        console.log("unlock",result);
                                if((web3.utils.isAddress("0x7846a17ef686BeB44A617cAa3DdB223995133895")) == true) {
                                        contract.methods.transfer("0x7846a17ef686BeB44A617cAa3DdB223995133895", 10 * 1000000000000000000).send()
                                        .then(result => {
                                                console.log("Result: ",result);
                                                if(result.status == "0x1"){
                                                        console.log("success payment");
                                                } else  {
                                                        console.log("fails");
                                                        return reject("Error.");
                                                }
                                        }).catch(err => {
                                          console.log("Err1: ", err);
                                        });
                                } else {
                                        console.log("WalletAddress is incorrect:");
                                        return reject(err);
                                }
                });
        } catch (err) {
          console.log("Err2: ", err);
          return reject(err);
        }
    });
}

payment();
