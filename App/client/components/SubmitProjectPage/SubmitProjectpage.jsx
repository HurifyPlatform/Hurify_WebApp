import React from 'react'
import styles from './SubmitProjectpage.css'
import AuthLayer from './../../network/AuthLayer'
import ModalStore from './../../stores/ModalStore'
import HURPopup from './../HURcheck/HURPopup'
import HURAmount from './../HURamount/HURAmount'
import axios from 'axios'
import UserStore from './../../stores/UserStore'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import PropTypes from 'prop-types'
import { RingLoader } from 'react-spinners';
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')

var catArr = [];
var catStr = "";
var txHash = '';
$(document).ready(function() {
	$('input[type="checkbox"]').click(function() {
		if($(this).is(":checked")) {
			catArr.push($(this).attr("value"))
			catStr = catArr.join(",")
		}
		else if($(this).is(":not(:checked)")) {
			var i = catArr.indexOf($(this).attr("value"));
			catArr.splice(i, 1);
			catStr = catArr.join(",")
		}
	});
});

const cookies = new Cookies();
class SubmitProjectpage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token: '',
				file: null,
				userId:'',
				project: {
					clientId: '',
					projectName: null,
					technology: '',
					category: null,
					price: null,
					experienceLevel: 'Beginner',
					estimatedDays: null,
					projectAbstract: '',
					projectDesc: '',
					projectStatusId: ''
				},
				web3: null
			},
			loading: false,
			indicatorDisplay: 'none',
			confirmDisplay:'none'
		}
		this.submitProject = this.submitProject.bind(this);
		this.changeUser = this.changeUser.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.tokenBalance = this.tokenBalance.bind(this);
    this.handleFileChange = this.handleFileChange.bind(this);
    this.tokenTransfer = this.tokenTransfer.bind(this);
		this.confirmClick = this.confirmClick.bind(this);
		this.cancelClick = this.cancelClick.bind(this);
		this.submitClick = this.submitClick.bind(this);
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
		const user = this.state.params
		user['userId'] = crypt.decrypt(cookies.get('UserID'))
		user['token'] = crypt.decrypt(cookies.get('token'))
		this.setState({user})
		AuthLayer.getProfileDetails(this.state.params)
				.then(response => {
					// console.log(JSON.stringify(response.data.data.user.referrerCode))
						if (response.data.success) {
							cookies.set('name', crypt.encrypt(response.data.data.profile.name), { path: '/' });
							cookies.set('client_id', crypt.encrypt(response.data.data.profile.id), { path: '/' });

						} else {
								if (response.data.error == "API session expired, Please login again!") {
									this.context.router.push('/logout');
								}
							}
				})
	}
	tokenBalance() {
		this.setState({
 	  loading: true,
 		indicatorDisplay: 'block'
 	 })
		var self = this;
				const contract = require('truffle-contract')
				const hurify = contract(Hurify)
				// console.log(this.state.web3);
				if ((this.state.web3 == "undefined") || (this.state.web3 == null)) {
					self.setState({
						loading: false,
						indicatorDisplay: 'none'
				 })
          alert("Please install Meta mask to proceed furthur")
				}
				else {
					this.state.web3.version.getNetwork((err, netId) => {
						if (netId == 1) {
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

								 web3.eth.getBalance(accounts[0]).then(function(result) {
									 console.log("eth balance isssss: ", result/1000000000000000000);
									 if (result/1000000000000000000 < 0.00005) {
										 self.setState({
										 loading: false,
										 indicatorDisplay: 'none'
										 })
										 alert("You have insufficient ETH balance. Your balance is " + result/1000000000000000000)
									 }
									 else {
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
					})

			}
	}

		tokenTransfer() {
			if ((this.state.params.project.category == "") || (this.state.params.project.category == null)) {
				this.setState({
		 	  loading: false,
		 		indicatorDisplay: 'none'
		 	 })
				 alert("Please select atleast one category!");
			}
			else {
			var self = this;

			const contract = require('truffle-contract')
			const hurify = contract(Hurify)
			hurify.setProvider(this.state.web3.currentProvider)
			var hurifyInstance
			this.state.web3.eth.getAccounts((error, accounts) => {


				var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"tokensup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"},{"name":"_type","type":"uint256"}],"name":"hurifymint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"}],"name":"hurmint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hurclan","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';


				const contract = new web3.eth.Contract(JSON.parse(abi), '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47', { from: accounts[0], gas: 100000});

				contract.methods.transfer("0x99F47Ccb940a2E6096F0fFaaaE5f5D4A5e581235", 1000000000000000000).send()
				.on('transactionHash', function(hash){
            console.log('transactionHash',hash);
            txHash = hash
          })
          .on('receipt', function(receipt){
            console.log('receipt',receipt);
            console.log(receipt.status);
            if (receipt.status == "0x1") {
							console.log("success payment");
							const user = self.state.params.project
							user["projectStatusId"] = 2
							self.setState({user})
							self.submitProject();
            }
            else {
							alert("failed to transfer but your project was saved in Posted projects")
							const user = self.state.params.project
							user["projectStatusId"] = 1
							self.setState({user})
							self.submitProject(e);
            }
          })
          .on('confirmation', function(confirmationNumber, receipt){
            console.log('confirmatiom',confirmationNumber);
          })
          .on('error', function(err){
            console.log('errors',err);
						console.log("error message issss ", err.message);
						if (err.message.includes("User denied transaction signature")) {
							console.log("includes");
							alert("Please proceed with your payment again")
						}
						else {
							console.log("not included");
							alert("failed to transfer but your project was saved in Posted projects")
							const user = self.state.params.project
							user["projectStatusId"] = 1
							self.setState({user})
							self.submitProject();
						}

          });

				// .then(result => {
				// 	this.setState({
				// 	 loading: false,
				// 	 indicatorDisplay:'none'
				// 	})
				// 	if(result.status == "0x1"){
        //
				// 		console.log("success payment");
				// 		const user = self.state.params.project
				// 		user["projectStatusId"] = 2
				// 		self.setState({user})
				// 		self.submitProject();
				// 		// self.tokenBalanceAfterTransfer();
				// 		// self.payment(result.tx);
        //
				// 	}
				// 	else{
				// 		alert("failed to transfer but your project was saved in Posted projects")
				// 		const user = self.state.params.project
				// 		user["projectStatusId"] = 1
				// 		self.setState({user})
				// 		self.submitProject(e);
				// 	}
				// 	return result
				// })
			})
		}
		}
 // Function to check the balance of Token
 // tokenBalance() {
	//  this.setState({
	//   loading: true,
	// 	indicatorDisplay: 'block'
	//  })
	//  // event.preventDefault();
	// 	var self = this;
	// 	    const contract = require('truffle-contract')
	// 	    const hurify = contract(Hurify)
	// 			if ((this.state.web3 == "undefined") || (this.state.web3 == null)) {
	// 				self.setState({
	// 				loading: false,
	// 				indicatorDisplay: 'none'
	// 			 })
 //          alert("Please install Meta mask to proceed furthur")
 //        }
 //        else {
	// 	    hurify.setProvider(this.state.web3.currentProvider)
	// 	    var hurifyInstance;
	// 	    this.state.web3.eth.getAccounts((error, accounts) => {
	// 				// console.log("accounts of 0"+accounts[0]);
	// 				if ((accounts[0] == "undefined") || (accounts[0] == null)) {
	// 					alert("Please unlock Metamask, and create Metamask account to proceed further")
	// 					self.setState({
	// 			 	  loading: false,
	// 			 		indicatorDisplay: 'none'
	// 			 	 })
	// 				}
	// 				else {
	// 	      hurify.deployed().then(function(instance) {
	// 	        hurifyInstance = instance;
	// 	        return hurifyInstance.balanceOf(accounts[0], {from: accounts[0]})
	// 	      }).then(function(balance) {
	// 					console.log("balance isssss"+balance);
	// 					if (balance.div(1e18) >= 1) {
	// 						cookies.set('balance', crypt.encrypt(balance.div(1e18)), { path: '/' });
	// 						self.tokenTransfer(balance.div(1e18));
	// 					}
	// 					else {
	// 						self.setState({
	// 				 	  loading: false,
	// 				 		indicatorDisplay: 'none'
	// 				 	 })
	// 						alert("You have unsufficient balance, Please get some HUR. Your balance is " + balance.div(1e18))
	// 					}
	// 	      }).catch(err => {
	// 					console.log("err"+err);
	// 					self.setState({
	// 			 	  loading: false,
	// 			 		indicatorDisplay: 'none'
	// 			 	 })
	// 					alert("Please create an account in Metamask to proceed further")
	// 				})
	// 			}
	// 	    })
	// 		}
 //  }
 //
	// 	tokenTransfer(balance1) {
	// 		if ((this.state.params.project.category == "") || (this.state.params.project.category == null)) {
	// 			this.setState({
	// 	 	  loading: false,
	// 	 		indicatorDisplay: 'none'
	// 	 	 })
	// 			 alert("Please select atleast one category!");
	// 		}
	// 		else {
	// 		var self = this;
	//     const contract = require('truffle-contract')
	//   	const hurify = contract(Hurify)
	//     hurify.setProvider(this.state.web3.currentProvider)
	//     var hurifyInstance
	//     this.state.web3.eth.getAccounts((error, accounts) => {
	//       hurify.deployed().then((instance) => {
	//         hurifyInstance = instance
	//         return hurifyInstance.transfer("0xbF3b79a27a91a8DC12D66Eb1785C37B73c597706", 1000000000000000000, {from: accounts[0]})
	//       }).then((result) => {
	// 				this.setState({
	// 				 loading: false,
	// 				 indicatorDisplay:'none'
	// 				})
	// 				if (result.receipt.status == "0x1"){
	// 					// alert("successfully transferred")
	// 					self.tokenBalanceAfterTransfer();
	// 				}
	// 				else {
	// 					alert("failed to transfer but your project was saved in Posted projects")
	// 					const user = self.state.params.project
	// 					user["projectStatusId"] = 1
	// 					self.setState({user})
	// 					self.submitProject(e);
	// 				}
	//         return result
	//       })
	//     })
	// 	}
	//   }

	submitProject(e) {
		const stateParams = this.state.params
		stateParams["token"] = crypt.decrypt(cookies.get('token'))
		this.setState({stateParams})
		const user = this.state.params.project
		user["clientId"] = crypt.decrypt(cookies.get('client_id'))
		this.setState({user})

		// if (user.category == "" || user.category == null) {
		// 	 alert("Please select atleast one category!");
		// }
		// else {
		const request = new FormData();
		var ProjectData = JSON.stringify(this.state.params.project);
		request.append('file', this.state.params.file);
		request.append('token', crypt.decrypt(cookies.get('token')));
		request.append('project', ProjectData)
		axios.post(require('./../../../config').serverAPI + '/apicall/addproject', request).then(result => {
			// alert(JSON.stringify(result.data))
			if(result.data.success) {
				alert("1 HUR successfully transferred to Hurify Wallet. Project successfully submitted.")
				  window.location = "/dashboard/postedprojects"
			}
			else {
				 alert("Failed to Project Submit, Please Try Again")
			}
		});
	// }
	}

	changeUser(event) {
		const field = event.target.name
		const user = this.state.params.project
		user[field] = event.target.value
		this.setState({user})
	}

	handleChange(event) {
		const user = this.state.params.project
		user['category'] = catStr
		this.setState({user})
	}

	handleFileChange(event) {
		event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0];
		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
			const user = this.state.params
			user["file"] = file
			this.setState({user});
		}
		reader.readAsDataURL(file);

	}
	confirmClick() {
		this.setState({
			confirmDisplay:'none'
		})
		this.tokenBalance();
	}
	cancelClick() {
		this.setState({
			confirmDisplay:'none'
		})
	}
	submitClick(event) {
		event.preventDefault();
		this.setState({
			confirmDisplay:'block'
		})
	}
	render(){
		return(
			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'85vh',overFlowY:'scroll'}}>
				<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
					<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Submit Project</label>
				</div>
				<div className={styles.well} style={{margin:'50px 120px 150px 150px'}}>
					<div className="row" style={{margin:'10px',padding:'20px 25px'}}>
						<h3 className="text-center"></h3>
					<form onSubmit={this.submitClick}>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="projectName" className={styles.fieldname}>Project Name<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="projectName" onChange={this.changeUser} required/>
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="technology" className={styles.fieldname}>Technology<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="technology" onChange={this.changeUser} required />
								</div>
							</div>
						</div>

						<div className="row">

							<div className="col-md-6">
								<div className="form-group">
									<label for="Price" className={styles.fieldname}>Price (in HUR)<span className="kv-reqd">*</span></label>
									<input type="number" className="form-control" name="price" onChange={this.changeUser} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="experience" className={styles.fieldname}>Experience<span className="kv-reqd">*</span></label>
									<select className="form-control" id="experience" name="experienceLevel" onChange={this.changeUser} required>
										<option>Beginner</option>
										<option>Intermediate</option>
										<option>Expert</option>
									</select>
								</div>
							</div>

						</div>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="estimatedtime" className={styles.fieldname}>Estimated Days<span className="kv-reqd">*</span></label>
									<input type="number" className="form-control" name="estimatedDays" onChange={this.changeUser} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="abstract" className={styles.fieldname}>Abstract<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="projectAbstract" maxLength="120" onChange={this.changeUser} required />
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
									<label for="categories" className={styles.fieldname}>Categories<span className="kv-reqd">*</span></label><br/>
										<label className="checkbox-inline" style={{color:'#0c1d4c',paddingLeft:'30px'}}><input type="checkbox" value="Network" style={{display: 'block'}} onChange={this.handleChange} />Network</label>
										<label className="checkbox-inline" style={{color:'#0c1d4c',paddingLeft:'30px'}}><input type="checkbox" value="Mobile" style={{display: 'block'}} onChange={this.handleChange} />Mobile</label>
										<label className="checkbox-inline" style={{color:'#0c1d4c',paddingLeft:'30px'}}><input type="checkbox" value="Embedded" style={{display: 'block'}} onChange={this.handleChange} />Embedded</label>
										<label className="checkbox-inline" style={{color:'#0c1d4c',paddingLeft:'30px'}}><input type="checkbox" value="Cloud" style={{display: 'block'}} onChange={this.handleChange} />Cloud</label>
										<label className="checkbox-inline" style={{color:'#0c1d4c',paddingLeft:'30px'}}><input type="checkbox" value="Webui" style={{display: 'block'}} onChange={this.handleChange} />WebUI</label>
										<label className="checkbox-inline" style={{color:'#0c1d4c',paddingLeft:'30px'}}><input type="checkbox" value="Middleware" style={{display: 'block'}} onChange={this.handleChange} />Middleware</label>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
  									<label for="comment" className={styles.fieldname}>Project Description<span className="kv-reqd">*</span></label>
  									<textarea className="form-control" rows="2" id="comment" name="projectDesc" onChange={this.changeUser} required></textarea>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
  									<label for="comment" className={styles.fieldname}>Attachment</label>
											<form ref="uploadForm" encType="multipart/form-data">
												<input type="file" onChange={(e)=>this.handleFileChange(e)} name="file" accept=".pdf,.doc"/>
											</form>
								</div>
							</div>
						</div>

						<div className="row" style={{padding:'15px 15px'}}>
							<div className="text-right">
								<input type="Submit" className="btn btn-primary btn-md" style={{color:'#0c1d4c',backgroundColor: '#ffffff'}} value="Submit"></input>
							</div>
						</div>
						</form>
					</div>
				</div>
				<div className={styles.indicator} style={{display:this.state.confirmDisplay}}>
					<div className={styles.confirmPopup}>
						<p style={{color:'#fff', marginTop:'20px',fontSize: '20px', textAlign: 'center',marginBottom: '0px'}}>By submitting the project, the platform will initiate the transfer of 1 HUR from your Metamask account to Hurify wallet.</p>
						<div style={{marginTop:'40px',marginBottom:'20px'}}>
							<button className="btn btn-primary btn-md" style={{color:'#fff',backgroundColor: 'rgb(79, 195, 247)', width:'170px', fontWeight:'700', fontSize:'20px',marginLeft:'10px'}} onClick={this.confirmClick}>Confirm Submit</button>
							<button className="btn btn-primary btn-md" style={{color:'#fff',backgroundColor: 'rgb(79, 195, 247)', width:'170px', fontWeight:'700', fontSize:'20px',marginLeft:'10px'}} onClick={this.cancelClick}>Cancel</button>
						</div>
					</div>
			  </div>
				<div className={styles.indicator} style={{display:this.state.indicatorDisplay}}>
					<div className={styles.RingLoader}>
					<div style={{marginLeft: '140px'}}>
						<RingLoader
		          color={'#3c8dbc'}
		          loading= {this.state.loading}
		        />
					</div>
						<p style={{color:'#fff', marginTop:'30px',fontSize: '20px', textAlign: 'center',marginBottom: '0px'}}>Please wait for few seconds</p>
					</div>
			</div>
        <HURPopup/>
        <HURAmount/>

			</div>
		)
	}
}

SubmitProjectpage.contextTypes = {
    router: PropTypes.object.isRequired
}

export default SubmitProjectpage
