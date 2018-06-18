import React from 'react'
import styles from './PostedProjectsDesc.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import moment from 'moment'
import DatePicker from 'react-bootstrap-date-picker'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import { RingLoader } from 'react-spinners';
import ReactStars from 'react-stars'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


var message = "";
const cookies = new Cookies();
class PostedProjectsDesc extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			params: {
				token: '',
				projectId: '',
				developerId: '',
				agreementId: '',
				user: {
					id: '',
					projectName: '',
					technology: '',
					category: '',
					price: '',
					experienceLevel: '',
					estimatedDays: '',
					projectAbstract: '',
					projectDesc: '',
					createdAt: '',
					AppliedProjects:[],
					ProjectStatus: '',
					approvalFlag: '',
					attachmentPath: '',
					selectedDeveloper: '',
					contractAddress: '',
					paymentAddress: '',
					unselectedDevelopers: []
				},
				Agreement: {
					agreementId:'',
					projectId: '',
					startDate: '',
					bidValue: '',
					estimatedDays: '',
					escrowaggrementURL:''
				},
				feedback: {
					projectId:'',
					developerId: '',
					clientId: '',
					rating: ''
				},
				startDate: new Date().toISOString(),
				clientHURAddress: '',
				developerHURAddress: '',
				bidValue: '',
				estimatedDays: '',
				attachmentDisplay: '',
				display: 'none',
				staticNegociationDisplay: 'none',
				waitingDisplay: 'none',
				generateDisplay: 'none',
				applicationsDisplay: 'none',
				escrowDisplay: 'none',
				diployContractDisplay: 'none',
				verifyDisplay: 'none',
				paymentDisplay:'none',
				projectEditDisplay: 'block',
				feedbackDisplay: 'none',
				verifypaymentDisplay: 'none',
				web3: null
			},
			loading: false,
			indicatorDisplay: 'none'

		}
		this.profileClick = this.profileClick.bind(this);
		this.editClick = this.editClick.bind(this);
		this.deleteProject = this.deleteProject.bind(this);
		this.acceptForNegociation = this.acceptForNegociation.bind(this);
		this.negociationChange = this.negociationChange.bind(this);
		this.NegociationAccept = this.NegociationAccept.bind(this);
		this.RejectSelectedDeveloper = this.RejectSelectedDeveloper.bind(this);
		this.pageDetails = this.pageDetails.bind(this);
		this.tokenBalance = this.tokenBalance.bind(this);
		this.GenerateContract = this.GenerateContract.bind(this);
		this.DeployContract = this.DeployContract.bind(this);
		this.walletBalance = this.walletBalance.bind(this);
		this.RejectPayment = this.RejectPayment.bind(this);
		this.AcceptPayment = this.AcceptPayment.bind(this);
		this.feedbackRating = this.feedbackRating.bind(this);
		this.payment = this.payment.bind(this);
		this.UnlockAccount = this.UnlockAccount.bind(this);
	}
	chckHander(value,formattedValue){
		const user = this.state.params
		user['startDate'] = value
		this.setState({user})
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
		this.pageDetails();

		}

		tokenBalance(event) {
	    var self = this;
	        const contract = require('truffle-contract')
	        const hurify = contract(Hurify)
	        hurify.setProvider(this.state.web3.currentProvider)
	        var hurifyInstance;
	        this.state.web3.eth.getAccounts((error, accounts) => {
						if ((accounts[0] == "undefined") || (accounts[0] == null)) {
							alert("Please unlock Metamask")

						}
						else {
						const nego = self.state.params
						nego['clientHURAddress'] = accounts[0]
						self.setState({nego})

						hurify.deployed().then(function(instance) {
			        hurifyInstance = instance;
			        return hurifyInstance.balanceOf(accounts[0], {from: accounts[0]})
			      }).then(function(balance) {
							cookies.set('balance', crypt.encrypt(balance.div(1e18)), { path: '/' });
						})
					}
	        })
	  }

		pageDetails(){
			this.state.params.display = 'none'
			this.state.params.staticNegociationDisplay = 'none'
			this.state.params.escrowDisplay = 'none'
			const user = this.state.params
			user['projectId'] = crypt.decrypt(cookies.get('project_id'))
			user['token'] = crypt.decrypt(cookies.get('token'))
					AuthLayer.PostedProjectDesc(this.state.params)
					.then(response => {
							if (response.data.success){
								console.log(response.data);
								const user = this.state.params.user
								user['projectName'] = response.data.data.projectName
								user['technology'] = response.data.data.technology
								user['category'] = response.data.data.category
								user['price'] = response.data.data.price
								user['experienceLevel'] = response.data.data.experienceLevel
								user['estimatedDays'] = response.data.data.estimatedDays
								user['projectAbstract'] = response.data.data.projectAbstract
								user['projectDesc'] = response.data.data.projectDesc
								user['createdAt'] = response.data.data.createdAt
								user['approvalFlag'] = response.data.data.approvalFlag
								user['AppliedProjects'] = response.data.data.AppliedProjects
								user['ProjectStatus'] = response.data.data.ProjectStatus
								user['attachmentPath'] = response.data.data.attachmentPath
								user['contractFlag'] = response.data.data.contractFlag
								user['contractAddress'] = "https://rinkeby.etherscan.io/address/" + response.data.data.contractAddress
								user['paymentAddress'] = "https://rinkeby.etherscan.io/tx/" + response.data.data.paymentAddress
								user["unselectedDevelopers"] = [];
								for (var i = 0; i < response.data.data.AppliedProjects.length; i++) {
    							if (response.data.data.developerId == response.data.data.AppliedProjects[i].developerId) {
										user["selectedDeveloper"] = response.data.data.AppliedProjects[i];
									}
									else {
										user["unselectedDevelopers"].push(response.data.data.AppliedProjects[i])
									}
								}
								if ((response.data.data.attachmentPath == "") || (response.data.data.attachmentPath == null)) {
									this.state.params.attachmentDisplay = 'none'
								}
								if (response.data.data.AppliedProjects.length > 0){
									this.state.params.applicationsDisplay = "block"
								}

								this.setState({user})
								const nego = this.state.params
								nego['projectId'] = response.data.data.id
								nego['bidValue'] = response.data.data.price
								nego['estimatedDays'] = response.data.data.estimatedDays
								this.setState({nego})
								this.tokenBalance();
								this.state.params.agreementId = response.data.data.Agreement.id
								this.setState({user})
								const Agreement = this.state.params.Agreement
								Agreement['projectId'] = response.data.data.Agreement.projectId
								Agreement['bidValue'] = response.data.data.Agreement.bidValue
								Agreement['estimatedDays'] = response.data.data.Agreement.estimatedDays
								Agreement['startDate'] = response.data.data.Agreement.startDate
								Agreement['escrowaggrementURL'] = response.data.data.Agreement.filePath
								this.setState({Agreement})

								const feedback = this.state.params.feedback
								feedback["developerId"] = response.data.data.developerId
								feedback["clientId"] = response.data.data.clientId
								this.setState({feedback})
								this.state.params.developerHURAddress = response.data.data.Agreement.developerHURAddress
							} else {
								//alert(JSON.stringify(response.data))
								}
					})
		}
		profileClick(event) {
			cookies.set('devid', crypt.encrypt(event), { path: '/' });
			this.context.router.push('/dashboard/applieddeveloperprofile')
		}
editClick() {
	this.context.router.push('/dashboard/editproject')
}
deleteProject() {
	const user = this.state.params
	user['projectId'] = crypt.decrypt(cookies.get('project_id'))
	user['token'] = crypt.decrypt(cookies.get('token'))
	this.setState({user})
			AuthLayer.DeleteProject(this.state.params)
			.then(response => {
					if (response.data.success){
						alert("Project deleted succeccfully")
						this.context.router.push('/dashboard/postedprojects')

					} else {
						//alert(JSON.stringify(response.data))
						alert("Faild to delete Project, Please Try Again")
						}
			})
}

acceptForNegociation(developerid) {
	const user = this.state.params
	user['developerId'] = developerid
	this.setState({user})
	AuthLayer.AcceptForNegociation(this.state.params)
	.then(response => {
			if (response.data.success){
				alert("Accepted developer for negotiation ")
				this.pageDetails();
			} else {
				alert("Negotiation Acception Failed, Please Try Again.")
				}
	})
}

NegociationAccept() {
	AuthLayer.NegociationAccept(this.state.params)
	.then(response => {
			if (response.data.success){
				alert("Accepted Terms and conditions. Wait until developer accepts Terms and conditions")
				this.state.params.staticNegociationDisplay  = "block"
				this.state.params.display = 'none'
			} else {
				alert("Failed to Update Terms and conditions, Please Try Again")
				}
	})
}

negociationChange(event) {
	const field = event.target.name
	const user = this.state.params
	user[field] = event.target.value
	this.setState({user})
}

RejectSelectedDeveloper() {
	AuthLayer.rejectSelectedDeveloper(this.state.params)
	.then(response => {
			if (response.data.success){
				alert("Developer Rejected Successfully")
				this.pageDetails();
			} else {
				alert("Developer Rejection Failed, Please Try Again")
				}
	})
}

GenerateContract(){
	AuthLayer.GenerateEscRowAgreementdoc(this.state.params)
	.then(response => {
			if (response.data.success){
				this.pageDetails();
				alert("Escrow was Generated Successfully")
			} else {
				alert("Escrow Generation Failed")
				}
	})
}

tokenBalance(e) {
	this.setState({
	 loading: true,
	 indicatorDisplay: 'block'
	})
	message = "Transferring " + this.state.params.Agreement.bidValue + " HUR to Hurify Escrow contract account and contract is deploying, Please wait for 4 minute"
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
								 console.log("balance is"+result);

								 const bidBalance = self.state.params.Agreement.bidValue
								 var strNoOfHUR = bidBalance.price.toString().split(".");
								 var finalValue = "";
								 if (strNoOfHUR.length == 2) {
								 	var beforeDot = strNoOfHUR[0];
								 	var afterDot = strNoOfHUR[1];
								 	var afterDotLength = strNoOfHUR[1].length;
								 	for(var i=0; i<(18-afterDotLength); i++) {
								 		afterDot += "0"
								 	}
								 	finalValue = beforeDot + afterDot;
								 } else {
								 	finalValue = strNoOfHUR[0] + "000000000000000000"
								 }
								 console.log("finalValue ",finalValue);



								 // const totalBidValue = parseFloat(bidBalance).toFixed(0) + "000000000000000000"
								 // var flag = (totalBidValue <= result.div(1e18))
								 if (finalValue <= result) {
									 self.tokenTransfer(finalValue);
								 }
									 else {
										 self.setState({
										 loading: false,
										 indicatorDisplay: 'none'
										})
										 alert("You have insufficient balance. Your balance is " + result)
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

	tokenTransfer(balance1) {
		var self = this;

		const contract = require('truffle-contract')
		const hurify = contract(Hurify)
		hurify.setProvider(this.state.web3.currentProvider)
		var hurifyInstance
		this.state.web3.eth.getAccounts((error, accounts) => {


			var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"tokensup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"},{"name":"_type","type":"uint256"}],"name":"hurifymint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"}],"name":"hurmint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hurclan","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';


			const contract = new web3.eth.Contract(JSON.parse(abi), '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47', { from: accounts[0], gas: 100000});

			contract.methods.transfer("0x99F47Ccb940a2E6096F0fFaaaE5f5D4A5e581235", balance1).send()
			.then(result => {
				if(result.status == "0x1"){

					console.log("success payment");
						self.DeployContract();
				}
				else{
					self.setState({
 				 loading: false,
 				 indicatorDisplay: 'none'
 				 })
 				 alert("failed to transfer try again")
				}
				return result
			})
		})

	}
// walletBalance() {
// 	this.setState({
// 	 loading: true,
// 	 indicatorDisplay: 'block'
// 	})
// 	message = "Transferring " + this.state.params.Agreement.bidValue + " HUR to Hurify Escrow contract account and contract is deploying, Please wait for 4 minute"
// 	 var self = this;
// 			 const contract = require('truffle-contract')
// 			 const hurify = contract(Hurify)
// 			 console.log("hurify:",hurify);
// 			 if ((this.state.web3 == "undefined") || (this.state.web3 == null)) {
// 				 self.setState({
// 				 loading: false,
// 				 indicatorDisplay: 'none'
// 				})
// 				 alert("Please install Meta mask to proceed furthur")
// 			 }
// 			 else {
// 			 hurify.setProvider(this.state.web3.currentProvider)
// 			 var hurifyInstance;
// 			 this.state.web3.eth.getAccounts((error, accounts) => {
// 				 if ((accounts[0] == "undefined") || (accounts[0] == null)) {
// 					 alert("Please unlock Metamask, and create Metamask account to proceed further")
// 					 self.setState({
// 					 loading: false,
// 					 indicatorDisplay: 'none'
// 					})
// 				 }
// 				 else {
// 				 hurify.deployed().then(function(instance) {
// 					 hurifyInstance = instance;
// 					 return hurifyInstance.balanceOf(accounts[0], {from: accounts[0]})
// 				 }).then(function(balance) {
// 					 console.log("balance is"+balance);
// 					 const bidBalance = self.state.params.Agreement.bidValue
// 					 const totalBidValue = parseFloat(bidBalance).toFixed(0) + "000000000000000000"
// 					 var flag = (totalBidValue <= balance.div(1e18))
// 					 if (totalBidValue <= balance.div(1e18)) {
// 						 self.tokenTransfer(totalBidValue);
// 					 }
// 					 else {
// 						 self.setState({
// 						 loading: false,
// 						 indicatorDisplay: 'none'
// 						 })
// 						 alert("You have insufficient balance, Please get some HUR. Your balance is " + balance.div(1e18))
// 					 }
// 				 }).catch(err => {
// 					 self.setState({
// 					 loading: false,
// 					 indicatorDisplay: 'none'
// 					})
// 					 alert("Please create an account in Metamask to proceed further")
// 				 })
// 			 }
// 			 })
// 		 }
//  }
//  tokenTransfer(balance1) {
// 	 var self = this;
// 	 const contract = require('truffle-contract')
// 	 const hurify = contract(Hurify)
// 	 hurify.setProvider(this.state.web3.currentProvider)
// 	 var hurifyInstance
// 	 this.state.web3.eth.getAccounts((error, accounts) => {
// 		 hurify.deployed().then((instance) => {
// 			 hurifyInstance = instance
//
// 			 console.log(accounts[0]);
// 			 return hurifyInstance.transfer("0xbF3b79a27a91a8DC12D66Eb1785C37B73c597706", balance1, {from: accounts[0]})
// 		 }).then((result) => {
//
// 			 if (result.receipt.status == "0x1"){
//
// 				 self.DeployContract();
// 			 }
// 			 else {
// 				 self.setState({
// 				 loading: false,
// 				 indicatorDisplay: 'none'
// 				 })
// 				 alert("failed to transfer try again")
// 			 }
// 			 return result
// 		 })
// 	 })
//  }

payment(){

	var Web3 = require('web3');
	var web3 = new Web3(new Web3.providers.HttpProvider("http://106.51.44.203:8545"));
	var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"price","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_hurclan","type":"address"}],"name":"ethtransfer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';;


	const contract = new web3.eth.Contract(JSON.parse(abi), '0x40e624d93110a8324920f011b80c6db0fab2b85b', { from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706', gas: 100000});




	contract.methods.balanceOf('0xbf3b79a27a91a8dc12d66eb1785c37b73c597706').call()
	.then(console.log)
	.catch(console.error);
	contract.methods.balanceOf('0x618104bCe7958ed2883006fec6009336dc05Bf0d').call()
	.then(console.log)
	.catch(console.error);
	const totalBidValue = parseFloat(this.state.params.Agreement.bidValue).toFixed(0) + "000000000000000000"
	contract.methods.transfer(this.state.params.developerHURAddress, totalBidValue).send()
	.then(result => {
		if(result.status == "0x1"){

			AuthLayer.updatePaymentAddress(this.state.params)
			.then(response => {
					if (response.data.success){
						this.setState({
						loading: false,
						indicatorDisplay: 'none'
					 })
					 this.state.params.paymentDisplay = 'none'
					 this.pageDetails();
					 // this.context.router.push('/dashboard/postedprojectsdesc')
					} else {
						console.log("Address not updated");
						}
			})
		}
		else{
			console.log("fails");
		}
	})

}


DeployContract() {
	AuthLayer.DeployContract(this.state.params)
	.then(response => {
			if (response.data.success){
				this.setState({
		 	  loading: false,
		 		indicatorDisplay: 'none'
		 	 })
				alert("Contract Deployed Succesfully.")
				this.state.params.diployContractDisplay = 'none'
				this.pageDetails();
			}
			else {
				this.setState({
		 	  loading: false,
		 		indicatorDisplay: 'none'
		 	 })
				alert("Failed to Deploy Contract, Please Try Again.")
				}

	})
}

RejectPayment() {
	AuthLayer.ClientRejectsPayment(this.state.params)
	.then(response => {
			if (response.data.success){
				alert("Rejected payment for developer")
				this.state.params.paymentDisplay = 'none'
				 this.pageDetails();
			} else {
				alert("Rejection failed")
				}
	})
}

AcceptPayment() {
	 const user = this.state.params
	 user["feedbackDisplay"] = 'block'
	 this.setState({user})
}
feedbackRating(value) {
	this.setState({
	loading: true,
	indicatorDisplay: 'block'
 })
 message = "Please wait for few seconds"
	const user = this.state.params.feedback
			user["projectId"] = this.state.params.projectId,
			user["rating"] = value
	 this.setState({user})
	AuthLayer.FeedbackForDeveloper(this.state.params)
	.then(response => {
			if (response.data.success){
				this.state.params.feedbackDisplay = 'none'
				this.state.params.paymentDisplay = 'none'
				this.UnlockAccount();
			} else {
				alert("failed")
				}
	})
}

UnlockAccount(){
	AuthLayer.Unlock(this.state.params)
	.then(response => {
			if (response.data.success){
				this.payment();
			} else {
				alert("failed")
				}
	})
}
	render(){

			const List = this.state.params.user.AppliedProjects
			var todaysDate = moment(new Date());
			var applicationsList = '';
			const inactiveApplications = this.state.params.user.unselectedDevelopers.map((i) =>
				<tr className="active">
					<td>{i.Developer.name}</td>
					<td>{i.bidValue}</td>
					<td>{i.projectExpLevel}</td>
					<td>{todaysDate.diff(moment(i.createdAt), 'days')} days ago</td>
					<td>Developer Evaluation</td>
				</tr>
			);

			if (this.state.params.user.ProjectStatus.id == 3) {
				if (this.state.params.user.approvalFlag == true) {
					this.state.params.display = "none"
					this.state.params.staticNegociationDisplay = "block"
					this.state.params.waitingDisplay = "block"
					this.state.params.generateDisplay = 'none'
				}
				else {
					this.state.params.display = "block"
					this.state.params.staticNegociationDisplay = "none"

				}

				applicationsList = (
					<tbody>
						<tr>
							<td><a href="#" onClick={() => this.profileClick(this.state.params.user.selectedDeveloper.Developer.userId)}>{this.state.params.user.selectedDeveloper.Developer.name}</a></td>
							<td>{this.state.params.user.selectedDeveloper.bidValue}</td>
							<td>{this.state.params.user.selectedDeveloper.projectExpLevel}</td>
							<td>{todaysDate.diff(moment(this.state.params.user.selectedDeveloper.createdAt), 'days')} days ago</td>
							<td><a href="#"> Accepted</a></td>
						</tr>
						{inactiveApplications}
					</tbody>
				);

			}
			else if (this.state.params.user.ProjectStatus.id == 2) {
				this.state.params.display = "none"
				applicationsList = List.map((i) =>
					<tbody>
						<tr>
							<td><a href="#" onClick={() => this.profileClick(i.Developer.userId)}>{i.Developer.name}</a></td>
							<td>{i.bidValue}</td>
							<td>{i.projectExpLevel}</td>
							<td>{todaysDate.diff(moment(i.createdAt), 'days')} days ago</td>
							<td><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff'}} onClick={() => this.acceptForNegociation(i.Developer.id)}><span className="glyphicon glyphicon-ok"></span> Accept</button></td>
						</tr>
					</tbody>
				);

			}
		else if (this.state.params.user.ProjectStatus.id == 4) {
				this.state.params.staticNegociationDisplay = "block"
				this.state.params.waitingDisplay = "none"
				this.state.params.generateDisplay = 'block'
				this.state.params.escrowDisplay  = "none"
				this.state.params.projectEditDisplay = "none"
				if (this.state.params.Agreement.escrowaggrementURL != null) {
					this.state.params.escrowDisplay  = "block"
					this.state.params.generateDisplay = 'none'
				}
				if (this.state.params.user.contractFlag == true) {
					this.state.params.diployContractDisplay = 'block'
				}
				applicationsList = (
					<tbody>
						<tr>
							<td><a href="#" onClick={() => this.profileClick(this.state.params.user.selectedDeveloper.Developer.userId)}>{this.state.params.user.selectedDeveloper.Developer.name}</a></td>
							<td>{this.state.params.user.selectedDeveloper.bidValue}</td>
							<td>{this.state.params.user.selectedDeveloper.projectExpLevel}</td>
							<td>{todaysDate.diff(moment(this.state.params.user.selectedDeveloper.createdAt), 'days')} days ago</td>
							<td><a href="#"> Selected</a></td>
						</tr>
					</tbody>
				);
		}
		else if (this.state.params.user.ProjectStatus.id == 5) {
				this.state.params.staticNegociationDisplay = "block"
				this.state.params.waitingDisplay = "none"
					this.state.params.escrowDisplay  = "block"
					this.state.params.generateDisplay = 'none'
					this.state.params.diployContractDisplay = 'none'
					this.state.params.verifyDisplay = 'block'
					this.state.params.projectEditDisplay = "none"
				applicationsList = (
					<tbody>
						<tr>
							<td><a href="#" onClick={() => this.profileClick(this.state.params.user.selectedDeveloper.Developer.userId)}>{this.state.params.user.selectedDeveloper.Developer.name}</a></td>
							<td>{this.state.params.user.selectedDeveloper.bidValue}</td>
							<td>{this.state.params.user.selectedDeveloper.projectExpLevel}</td>
							<td>{todaysDate.diff(moment(this.state.params.user.selectedDeveloper.createdAt), 'days')} days ago</td>
							<td><a href="#"> Selected</a></td>
						</tr>
					</tbody>
				);
		}
		// else if (this.state.params.user.ProjectStatus.id == 6) {
		// 		this.state.params.staticNegociationDisplay = "block"
		// 		this.state.params.waitingDisplay = "none"
		// 			this.state.params.escrowDisplay  = "block"
		// 			this.state.params.generateDisplay = 'none'
		// 			this.state.params.diployContractDisplay = 'none'
		// 			this.state.params.verifyDisplay = 'block'
		// 			this.state.params.paymentDisplay = 'block'
		// 			this.state.params.projectEditDisplay = "none"
		// 		applicationsList = (
		// 			<tbody>
		// 				<tr>
		// 					<td><a href="#" onClick={() => this.profileClick(this.state.params.user.selectedDeveloper.Developer.userId)}>{this.state.params.user.selectedDeveloper.Developer.name}</a></td>
		// 					<td>{this.state.params.user.selectedDeveloper.bidValue}</td>
		// 					<td>{this.state.params.user.selectedDeveloper.projectExpLevel}</td>
		// 					<td>{todaysDate.diff(moment(this.state.params.user.selectedDeveloper.createdAt), 'days')} days ago</td>
		// 					<td><a href="#"> Selected</a></td>
		// 				</tr>
		// 			</tbody>
		// 		);
		// }
		// else if (this.state.params.user.ProjectStatus.id == 7) {
		// 		this.state.params.staticNegociationDisplay = "block"
		// 		this.state.params.waitingDisplay = "none"
		// 			this.state.params.escrowDisplay  = "block"
		// 			this.state.params.generateDisplay = 'none'
		// 			this.state.params.diployContractDisplay = 'none'
		// 			this.state.params.verifyDisplay = 'block'
		// 			this.state.params.paymentDisplay = 'none'
		// 			this.state.params.projectEditDisplay = "none"
		// 			this.state.params.verifypaymentDisplay = "block"
		// 		applicationsList = (
		// 			<tbody>
		// 				<tr>
		// 					<td className={styles.td}><a href="#" onClick={() => this.profileClick(this.state.params.user.selectedDeveloper.Developer.userId)}>{this.state.params.user.selectedDeveloper.Developer.name}</a></td>
		// 					<td className={styles.td}>{this.state.params.user.selectedDeveloper.bidValue}</td>
		// 					<td className={styles.td}>{this.state.params.user.selectedDeveloper.projectExpLevel}</td>
		// 					<td className={styles.td}>{todaysDate.diff(moment(this.state.params.user.selectedDeveloper.createdAt), 'days')} days ago</td>
		// 					<td className={styles.td}><a href="#"> Selected</a></td>
		// 				</tr>
		// 			</tbody>
		// 		);
		// }

		return(
				<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
					<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
						<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Project Status</label>
					</div>
									<div className={styles.well} style={{margin:'50px 50px 150px 80px'}}>
										<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
											<h4>{this.state.params.user.projectName}</h4>

											<div className="row" style={{padding:'10px 15px'}}>
												<div className="col-md-3 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-6 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Created Date:</span></div>
														<div className="col-md-6 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{todaysDate.diff(moment(this.state.params.user.createdAt), 'days')} Days Ago</span></div>
													</div>
												</div>
												<div className="col-md-3">
													<div className="row">
														<div className="col-md-5 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Experience:</span></div>
														<div className="col-md-7 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.user.experienceLevel}</span></div>
													</div>
												</div>
												<div className="col-md-3">
													<div className="row">
														<div className="col-md-4 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Est.Time:</span></div>
														<div className="col-md-8 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.user.estimatedDays} days</span></div>
													</div>
												</div>
												<div className="col-md-3">
													<div className="row">
														<div className="col-md-3 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Cost:</span></div>
														<div className="col-md-9 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.user.price} HUR</span></div>
													</div>
												</div>
											</div>

											<div className="row" style={{padding:'10px 15px'}}>
												<div className="col-md-12 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-12 col-sm-12 col-xs-12 text-left" style={{paddingLeft:'20px'}}><span className={styles.labeldesc}>{this.state.params.user.projectDesc}</span></div>
													</div>
												</div>
											</div>
											<div className="row" style={{padding:'10px 15px'}}>
												<div className="col-md-6 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-3 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Categories:</span></div>
														<div className="col-md-9 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.user.category}</span></div>
													</div>
												</div>
												<div className="col-md-3 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-5 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Technology:</span></div>
														<div className="col-md-7 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.user.technology}</span></div>
													</div>
												</div>
												<div className="col-md-3 col-sm-12 col-xs-12" style={{display:this.state.params.attachmentDisplay}}>
													<div className="row">
														<div className="col-md-5 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Attachments:</span></div>
														<div className="col-md-7 col-sm-6 col-xs-6 text-left"><a className={styles.labelvalue} href={this.state.params.user.attachmentPath} download>Link</a></div>
													</div>
												</div>
											</div>
											<div className="row" style={{padding:'10px 15px'}} style={{display:this.state.params.projectEditDisplay}}>
												<div className="col-md-12 text-right">
													<button type="button" className="btn btn-primary btn-sm" style={{color:'#14317f',backgroundColor: '#ffffff',marginRight:'10px',lineHeight:'10px'}} onClick={this.editClick}><span className="glyphicon glyphicon-pencil"></span> </button>
													<button type="button" className="btn btn-primary btn-sm" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}} onClick={this.deleteProject}><span className="glyphicon glyphicon-trash"></span> </button>
												</div>
											</div>
											<div className="row" style={{padding:'10px 20px', display:this.state.params.applicationsDisplay}}>
												<div className="table-responsive">
												  <table className="table">
														<thead><tr><th className={styles.th}>Name</th><th className={styles.th}>Bid value</th><th className={styles.th}>Experience</th><th className={styles.th}>Applied</th><th className={styles.th}>Status</th></tr></thead>

												      {applicationsList}

												  </table>
												  </div>
											</div>
										</div>
									</div>
				<form onSubmit={this.NegociationAccept}>
					<div className={styles.well} style={{display:this.state.params.display}}>
						<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
							<h4 style={{textAlign:'center'}}>Terms and Conditions Form</h4>
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label for="project_ID" className={styles.fieldname}>Project ID</label>
										<input type="text" className="form-control" name="projectId" value={this.state.params.projectId} readOnly />
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label for="Project_name" className={styles.fieldname}>Project Name</label>
										<input type="text" className="form-control" name="Project_name" value={this.state.params.user.projectName} readOnly />
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label for="waller_address" className={styles.fieldname}>Wallet Address</label>
										<input type="text" className="form-control" name="walletAddress" value={this.state.params.clientHURAddress} readOnly />
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label for="Calender_days" className={styles.fieldname}>No.of Calender days</label>
										<input type="text" className="form-control" name="estimatedDays" value={this.state.params.estimatedDays} onChange={this.negociationChange} required />
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-6">
									<div className="form-group">
										<label for="project_cost" className={styles.fieldname}>Total Project Cost in HUR</label>
										<input type="text" className="form-control" name="bidValue" value={this.state.params.bidValue} onChange={this.negociationChange} required />
									</div>
								</div>
								<div className="col-md-6">
									<div className="form-group">
										<label for="start_Date" className={styles.fieldname}>Start Date</label>
										<DatePicker id="example-datepicker" value={this.state.params.startDate} onChange={this.chckHander.bind(this)} minDate={new Date()} showClearButton={false}/>
									</div>
								</div>
							</div>

							<div className="row" style={{padding:'15px 15px'}}>
								<div className="text-right">
									<input type="Submit" className="btn btn-primary btn-xs" style={{color:'#0c1d4c',backgroundColor: '#ffffff'}} value="Accept"></input>
									<button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px'}} onClick={this.RejectSelectedDeveloper}><span className="glyphicon glyphicon glyphicon-remove"></span> Reject</button>
								</div>
							</div>

						</div>
					</div>
				</form>

				<div className={styles.well} style={{display:this.state.params.staticNegociationDisplay}}>
					<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
						<h4 style={{textAlign:'center'}}>Terms and Conditions Form</h4>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="project_ID" className={styles.fieldname}>Project ID</label>
									<input type="text" className="form-control" name="projectId" value={this.state.params.Agreement.projectId} readOnly />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="Project_name" className={styles.fieldname}>Project Name</label>
									<input type="text" className="form-control" name="Project_name" value={this.state.params.user.projectName} readOnly />
								</div>
							</div>
						</div>

						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="start_Date" className={styles.fieldname}>Start Date</label>
									<input type="text" className="form-control" name="startDate" value={this.state.params.Agreement.startDate} readOnly />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="Calender_days" className={styles.fieldname}>No.of Calender days</label>
									<input type="text" className="form-control" name="estimatedDays" value={this.state.params.Agreement.estimatedDays} readOnly />
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="project_cost" className={styles.fieldname}>Total Project Cost in HUR</label>
									<input type="text" className="form-control" name="bidValue" value={this.state.params.Agreement.bidValue} readOnly />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="waller_address" className={styles.fieldname}>Wallet Address</label>
									<input type="text" className="form-control" name="walletAddress" value={this.state.params.clientHURAddress} readOnly />
								</div>
							</div>
						</div>

						<div className="row" style={{padding:'15px 15px'}}>
							<div className="text-right">
								<button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px 0px 0px', display:this.state.params.waitingDisplay}}> Waiting for Developer Approval</button>
								<button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px', display:this.state.params.generateDisplay}} onClick={this.GenerateContract}> Generate Contract</button>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.well} style={{display:this.state.params.escrowDisplay}}>
						<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
							<div className="col-md-12">
								<h4 style={{textAlign:'center'}}>ESCROW AGREEMENT</h4>
							</div>



							<div className="row" style={{height:'250px',padding:'10px 15px'}}>
								<iframe src={this.state.params.Agreement.escrowaggrementURL} style={{width:'100%', height:'500px', border:'2px solid #000', borderRadius:'5px'}} frameBorder="0"></iframe>

								<div className="row" style={{margin:'10px',padding:'10px 15px 15px 20px'}}>
									<div className="col-md-12 text-right">
										<button type="button" className="btn btn-primary btn-md" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px', display:'none'}} onClick={this.walletBalance}><span className="fa fa-credit-card"></span>  Deploy Contract</button>
										<p className={styles.verify}style={{display:this.state.params.verifyDisplay }}>Verify your contract in <a href={this.state.params.user.contractAddress} target="_blank">Etherscan.</a></p>
									</div>
								</div>
							</div>
						</div>
						<div>
				    </div>
					</div>

					<div className={styles.well} style={{display:this.state.params.paymentDisplay}}>
						<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
						<div className="col-md-12">
							<h4 style={{textAlign:'center'}}>PAYMENT</h4>
						</div>
						<div className="col-md-12" style={{marginTop:'10px'}}>
							<p className={styles.verify}>Please verify the work submitted and initiate the payment for the invoice</p>
						</div>
						<div className="text-center">
							<button type="button" className="btn btn-primary btn-md" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px',marginTop:'10px',marginBottom:'15px'}} onClick={this.AcceptPayment}><span className="glyphicon glyphicon glyphicon-ok"></span> Accept</button>
							<button type="button" className="btn btn-primary btn-md" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px',marginTop:'10px',marginBottom:'15px'}} onClick={this.RejectPayment }><span className="glyphicon glyphicon glyphicon-remove"></span> Reject</button>
						</div>

						</div>
					</div>

					<div className={styles.well} style={{display:this.state.params.verifypaymentDisplay}}>
						<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
						<div className="col-md-12">
							<p className={styles.verify}style={{display:this.state.params.verifyDisplay }}>Verify your payment in <a href={this.state.params.user.paymentAddress} target="_blank">Etherscan.</a></p>
						</div>
						</div>
					</div>

					<div className="row" style={{display:this.state.params.feedbackDisplay}} className={styles.feedback}>

					<div className={styles.feedbackContent}>
					<h3 style={{marginTop:'0px'}}>Feedback</h3>
					<div className="col-md-12" style={{width:'100%',marginLeft:'40px',marginBottom:'10px'}}>
									<ReactStars
										count={5}
										onChange={this.feedbackRating}
										size={24}
										color2={'#3c8dbc'} />
									</div>
						</div>
					</div>

					<div className={styles.indicator} style={{display:this.state.indicatorDisplay}}>
						<div className={styles.RingLoader}>
							<RingLoader
								color={'#3c8dbc'}
								loading={this.state.loading}

							/>
							<p style={{color:'#fff', marginLeft:'-70%', marginTop:'30px',fontSize: '20px', textAlign: 'center',marginBottom: '20px'}}>{message}</p>
						</div>
					</div>


			</div>
			)
	}
}
PostedProjectsDesc.contextTypes = {
    router: PropTypes.object.isRequired
}
export default PostedProjectsDesc
