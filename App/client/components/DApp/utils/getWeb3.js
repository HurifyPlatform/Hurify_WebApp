import Web3 from 'web3'

let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function() {
    var results
    var web3 = window.web3


    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      window.web3 = new Web3(web3.currentProvider)
      if (web3.currentProvider.isMetaMask === true) {
        if (typeof web3.eth.defaultAccount === 'undefined') {
          // console.log(web3.eth.accounts);
            // alert("Please unlock your Metamask and Refresh the page")
            // document.body.innerHTML = '<body><h1>Oops! Your browser does not support Ethereum Ðapps.</h1></body>';
        }
        else {
          // alert("")
          // console.log("success");
          // console.log(web3.eth.defaultAccount);
          // startApp();
        }
    }

      results = {
        web3: web3
      }

      console.log('Injected web3 detected.');
      resolve(results)
    } else {
      // Fallback to localhost if no web3 injection.
      // var provider = new Web3.providers.HttpProvider('http://localhost:8545')

      // web3 = new Web3(provider)

      // results = {
      //   web3: web3
      // }

      // console.log('No web3 instance injected, using Local web3.');
      // alert('Please install MetaMask to proceed further')
      resolve(results)
    }
  })
})

export default getWeb3
