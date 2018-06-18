import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './ApplyPopup.css'
import PropTypes from 'prop-types'
import Dropdown from 'react-dropdown'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import UserStore from './../../stores/UserStore'
import { RingLoader } from 'react-spinners';
import validator from 'validator';
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


const experience = [
  'Beginner', 'Intermediate', 'Expert'
]

const defaultOption = experience[0]
const cookies = new Cookies();
@observer
class ApplyPopup extends React.Component{
	constructor(props){
		super(props)
		this.state = {
      		user: {
            token: '',
            project: {
                  projectId: '',
                  developerId: '',
                   bidValue: '',
                   projectExpLevel: 'Beginner'
            },
            web3: null
      		},
          loading: false,
    			indicatorDisplay: 'none'
	}
		this.applyClick = this.applyClick.bind(this);
		this.changeUser = this.changeUser.bind(this);
		this.hide = this.hide.bind(this);
		this.changeExperience = this.changeExperience.bind(this);
    this.tokenBalance = this.tokenBalance.bind(this);
    this.tokenTransfer = this.tokenTransfer.bind(this);
	}
	hide(e) {
	e.preventDefault()
	ModalStore.setDisplayed('apply', false)
	}
  componentWillMount() {
    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })
    })
    .catch(() => {
      console.log('Error finding web3.')
      alert("Please install Meta mask to proceed further")
    })
  }
  tokenBalance(e) {
    if ((this.state.user.project.bidValue == '') || (this.state.user.project.bidValue == null)) {
      alert("Please enter Bid Value for Project")
    }
    else if(!(validator.isInt(this.state.user.project.bidValue))) {
        alert("Please enter bid value in Integers")
    }
    else {
      this.setState({
      loading: true,
      indicatorDisplay: 'block'
     })
     e.preventDefault();
		var self = this;
		    const contract = require('truffle-contract')
		    const hurify = contract(Hurify)
        // console.log(this.state.web3);
				if ((this.state.web3 == "undefined") || (this.state.web3 == null)) {
          alert("Please install Meta mask to proceed furthur")
          self.setState({
          loading: false,
          indicatorDisplay: 'none'
         })
        }
        else {
          this.state.web3.version.getNetwork((err, netId) => {
            if (netId != 1) {
              alert("Please choose Main Etherium Network.")
              self.setState({
              loading: false,
              indicatorDisplay: 'none'
             })
              window.stop();
            }
            else {
              hurify.setProvider(this.state.web3.currentProvider)
             var hurifyInstance;
             this.state.web3.eth.getAccounts((error, accounts) => {
                console.log("accounts of 0"+accounts[0]);
               if ((accounts[0] == "undefined") || (accounts[0] == null)) {
                 alert("Please unlock Metamask, and create Metamask account to proceed further")
                 self.setState({
                 loading: false,
                 indicatorDisplay: 'none'
                })
                }
               else {


                  var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"tokensup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"},{"name":"_type","type":"uint256"}],"name":"hurifymint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"}],"name":"hurmint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hurclan","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';

                 var myContract = new web3.eth.Contract(JSON.parse(abi), '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47', {
                   //from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706', // default from address
                   from: accounts[0],
                   gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
                 });

                 myContract.methods.balanceOf(accounts[0]).call({
                   from: accounts[0]
                   //from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706'
                 }).then(function(result) {
                   var balanceAmount = result / 1000000000000000000;
                   console.log("BalanceAmount", balanceAmount);
                    if (balanceAmount >= 1) {
                       // cookies.set('balance', crypt.encrypt(balance.div(1e18)), { path: '/' });
                       self.tokenTransfer();
                     }
                     else {
                       self.setState({
                       loading: false,
                       indicatorDisplay: 'none'
                      })
                       alert("You have insufficient balance. Your balance is " + balanceAmount)
                     }
                   //return resolve({success : "true" , balanceAmount : balanceAmount});
                 }).catch(function(err) {
                   console.log("Err: ", err);
                   self.setState({
                   loading: false,
                   indicatorDisplay: 'none'
                  })
                     alert("Please create an account in Metamask to proceed further")

                 });
             }
             })
            }
          })
        }
			}
  }

		tokenTransfer() {
			var self = this;

	    const contract = require('truffle-contract')
	  	const hurify = contract(Hurify)
	    hurify.setProvider(this.state.web3.currentProvider)
	    var hurifyInstance
	    this.state.web3.eth.getAccounts((error, accounts) => {


        var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"tokensup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"},{"name":"_type","type":"uint256"}],"name":"hurifymint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"}],"name":"hurmint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hurclan","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';


				const contract = new web3.eth.Contract(JSON.parse(abi), '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47', { from: accounts[0], gas: 100000});

				contract.methods.transfer("0x99F47Ccb940a2E6096F0fFaaaE5f5D4A5e581235", 1000000000000000000).send()
				.then(result => {
					if(result.status == "0x1"){

						console.log("success payment");
              self.applyClick();
					}
					else{
						console.log("fails");
            self.setState({
            loading: false,
            indicatorDisplay: 'none'
           })
						alert("failed to transfer but your project was saved in Posted projects")
					}
          return result
				})
	    })

	  }
  // Function to check the balance of Token
//   tokenBalance(event) {
//   if ((this.state.user.project.bidValue == '') || (this.state.user.project.bidValue == null)) {
//     alert("Please enter Bid Value for Project")
//   }
//   else if(!(validator.isInt(this.state.user.project.bidValue))) {
//       alert("Please enter bid value in Integers")
//   }
//   else {
//     this.setState({
//     loading: true,
//     indicatorDisplay: 'block'
//    })
//    event.preventDefault();
//     var self = this;
//         const contract = require('truffle-contract')
//         const hurify = contract(Hurify)
//         if ((this.state.web3 == "undefined") || (this.state.web3 == null)) {
//           alert("Please install meta mask to proceed further")
//           // self.LoginClick();
//           self.setState({
//           loading: false,
//           indicatorDisplay: 'none'
//          })
//         }
//         else {
//         hurify.setProvider(this.state.web3.currentProvider)
//         var hurifyInstance;
//         this.state.web3.eth.getAccounts((error, accounts) => {
//           if ((accounts[0] == "undefined") || (accounts[0] == null)) {
//             alert("Please unlock Metamask, and create Metamask account to proceed further")
//             self.setState({
//             loading: false,
//             indicatorDisplay: 'none'
//            })
//           }
//           else {
//           hurify.deployed().then(function(instance) {
//             hurifyInstance = instance;
//             return hurifyInstance.balanceOf(accounts[0], {from: accounts[0]})
//           }).then(function(balance) {
//             if (balance.div(1e18) >= 1) {
//               // UserStore.setBalance(balance.div(1e18))
//               // localStorage.setItem('balance', balance.div(1e18))
//               self.tokenTransfer(balance.div(1e18));
//             }
//             else {
//               self.setState({
//               loading: false,
//               indicatorDisplay: 'none'
//              })
//               alert("You have unsufficient balance, Please get some HUR. Your balance is " + balance.div(1e18))
//             }
//           }).catch(err => {
//             self.setState({
//             loading: false,
//             indicatorDisplay: 'none'
//            })
//             alert("Please create an account in Metamask to proceed further")
//           })
//         }
//         })
//       }
//   }
// }
//   // Function to Transfer token to HUR address while submitting projects.
//     tokenTransfer(balance1) {
//       var self = this;
//       const contract = require('truffle-contract')
//       const hurify = contract(Hurify)
//       hurify.setProvider(this.state.web3.currentProvider)
//       var hurifyInstance
//       this.state.web3.eth.getAccounts((error, accounts) => {
//         hurify.deployed().then((instance) => {
//           hurifyInstance = instance
//           return hurifyInstance.transfer("0xbF3b79a27a91a8DC12D66Eb1785C37B73c597706", 1000000000000000000, {from: accounts[0]})
//         }).then((result) => {
//
//           self.setState({
//           loading: false,
//           indicatorDisplay: 'none'
//          })
//           if (result.receipt.status == "0x1"){
//             // self.balanceAfterTransfer();
//             self.applyClick();
//           }
//           else {
//             alert("failed to Apply, Because your HUR balance is low")
//           }
//           return result
//         })
//       })
//     }
  // balanceAfterTransfer() {
  //
  //   var self = this;
  //       const contract = require('truffle-contract')
  //       const hurify = contract(Hurify)
  //       hurify.setProvider(this.state.web3.currentProvider)
  //       var hurifyInstance;
  //       this.state.web3.eth.getAccounts((error, accounts) => {
  //         hurify.deployed().then(function(instance) {
  //           hurifyInstance = instance;
  //           return hurifyInstance.balanceOf(accounts[0], {from: accounts[0]})
  //         }).then(function(balance) {
  //           cookies.set('balance', crypt.encrypt(balance.div(1e18)), { path: '/' });
  //
  //           self.applyClick();
  //         })
  //       })
  // }
	applyClick(event)
	{
      ModalStore.setDisplayed('apply', false)
    const user = this.state.user
    user['token'] = crypt.decrypt(cookies.get('token'))
    this.setState({user})
    const user1 = this.state.user.project
    user1['projectId'] = crypt.decrypt(cookies.get('project_id'))
    user1['developerId'] = crypt.decrypt(cookies.get('devid'))
    this.setState({user1})
    AuthLayer.ApplyProject(this.state.user)
    .then(response => {
    	//alert(JSON.stringify(response.data))
    		if (response.data.success){


           window.location = "/dashboard/success"
    			// this.context.router.push('/dashboard/success')
    		} else {
    			  ModalStore.setDisplayed('apply', true)
          alert("Failed to Apply for Project")
    			}
    })
	  	}
	changeUser(event) {
			const user1 = this.state.user.project
			user1['bidValue'] = event.target.value
			this.setState({user1})
		}
changeExperience(event) {
					const user1 = this.state.user.project
					user1["projectExpLevel"] = event.target.value
					this.setState({user1})
  	}
	render(){
		return(
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['apply'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.applyClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>Apply</h2>
							<input className={resendStyles.inputField} type="number" placeholder="Bid value for project (HUR)" name="bidValue" onChange={this.changeUser} required/>
              <select className={resendStyles.dropdown} id="sel1" name="experience" onChange={this.changeExperience} required>
                <option value="Beginner" selected>Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>

							<a className={resendStyles.btn} href="#successPop" onClick = {this.tokenBalance} >Apply</a>
				 </div>

			</form>
      <div className={resendStyles.indicator} style={{display:this.state.indicatorDisplay}}>
        <div className={resendStyles.RingLoader}>
          <div style={{marginLeft: '140px'}}>
          <RingLoader
            color={'#3c8dbc'}
            loading={this.state.loading}

          />
          </div>
          <p style={{color:'#fff', marginLeft:'0px', marginTop:'30px',fontSize: '20px'}}>Please wait for few seconds</p>
        </div>
    </div>
			</div>

		);

	}

}

ApplyPopup.contextTypes = {

    router: PropTypes.object.isRequired

}
export default ApplyPopup;
