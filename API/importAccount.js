const Web3 = require('web3');

let web3 = new Web3();
var provider= new web3.providers.HttpProvider('http://34.214.122.212:8545');
console.log(provider);
web3.setProvider(provider)
web3.eth.getAccounts(function(err,accounts){
        console.log("Accounts:",accounts);
        var i= accounts.indexOf("0x1064a27d24A4166716fA8169192F0AFf71DDadAA");
        if(i == -1){
                web3.eth.personal.importRawKey("a663f45bc44aeae935ee3f00cc20b9862909b52858413715831a50b816e55377","Pl,_8907").then(function(res){
                console.log("import:",res);
                }).catch((err) => {
                  console.log("Err: ", err);
                        return reject(err);
                });
        }else {
          console.log("Exists.");
        }
 }).then(result => {
   console.log(result);
 }).catch(err => {
   console.log(err);
 })
