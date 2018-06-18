import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
import Hurify from '../build/contracts/Hurify.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      storageValue: 0,
      web3: null,
      user: {
        inputValue: ''
      }
    }
    this.instantiateContract = this.instantiateContract.bind(this);
    this.valueChange = this.valueChange.bind(this);
    this.initiateTransfer = this.initiateTransfer.bind(this);
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
      // console.log("web3 is" + results.web3);
      // Instantiate contract once web3 provided.
    //  this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }
  initiateTransfer() {
    // console.log("web3 is" + this.state.web3);
    const contract = require('truffle-contract')
  //  const simpleStorage = contract(SimpleStorageContract)
  const hurify = contract(Hurify)
    hurify.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance
    var hurifyInstance
    // Get accounts.
    // console.log("test");
    this.state.web3.eth.getAccounts((error, accounts) => {
      // console.log(accounts[0]);
       if (accounts[0] != 0x0) {
         hurify.deployed().then((instance) => {
           hurifyInstance = instance

           // Stores a given value, 5 by default.
           // console.log(accounts);
           return hurifyInstance.transfer("", "50", {from: accounts[0]})
         }).then((result) => {
           console.log(result);
           // Get the value from the contract to prove it worked.
           return result
         }).then((result) => {
           // Update state with the result.
           return this.setState({ storageValue: result })
         })
       }
else {
  alert("Please unlock Metamask")
}
    })
  }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
  //  const simpleStorage = contract(SimpleStorageContract)
  const hurify = contract(Hurify)
    hurify.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    //var simpleStorageInstance
    var hurifyInstance
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      hurify.deployed().then((instance) => {
        hurifyInstance = instance

        // Stores a given value, 5 by default.
        console.log(accounts);
        return hurifyInstance.balanceOf("0x0E06C67395D1B90d99ff2c218031278e78A24d84", {from: accounts[0]})
      }).then((result) => {
        console.log(result.c[0]);
        // Get the value from the contract to prove it worked.
        return result
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result })
      })
    })
  }
valueChange(event) {
  console.log(event.target.value);
  const user = this.state.user
  user["inputValue"] = event.target.value
  this.setState({user})
}
  render() {
    return (
      <div className="App">
          <input type="text" className="form-control" name="projectAbstract" onChange={this.valueChange} required />
          <button onClick={this.initiateTransfer}>Transfer</button>
          <button onClick={this.instantiateContract}>balance</button>
      </div>
    );
  }
}

export default App
