import React from 'react'
import styles from './MyTokenPage2.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
import ProgressArc from 'progress-arc-component'
var crypt = require('./../../../config/crypt')
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import ModalStore from './../../stores/ModalStore'

const cookies = new Cookies();
class MyTokenPage2 extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token:'',
        userId:'',
				web3: null
			},

			devOpacity:1,
			clientOpacity:1,
			userOpacity:0.6,
			profileCompletenessOpacity:1,
			clientHref:null,
			devHref:null,
			metamaskBalance:0
  }
}
componentWillMount() {

	getWeb3
	.then(results => {
		this.setState({
			web3: results.web3
		})
		console.log(results.web3);
	})
	.catch((err) => {
		console.log(err)
		// alert("Please install Meta mask to proceed further")
	})

// this.tokenBalance();

	const user = this.state.params
	user['token'] = crypt.decrypt(cookies.get('token'))
	user['userId'] = crypt.decrypt(cookies.get('UserID'))
	this.setState({user})
	AuthLayer.CheckUserData(this.state.params)
	.then(response => {
		if (response.data.success) {
			console.log(JSON.stringify(response.data))
			if (response.data.data.userAccountType == "client") {
				this.setState({
					devOpacity:0.6,
					clientHref:'/dashboard/submitproject'
				})
				$('#developerData').attr('disabled', true);
			}
			else if (response.data.data.userAccountType == "developer") {
				this.setState({
					clientOpacity:0.6,
					devHref:'/dashboard/findprojects'
				})
				$('#clientData').attr('disabled', true);
			}
			else {
				$('#developerData').attr('disabled', true);
				$('#clientData').attr('disabled', true);
				this.setState({
					clientOpacity:0.6,
					devHref:null,
					devOpacity:0.6,
					clientHref:null
				})
			}
			// this.profileCompleteness();
			this.tokenBalance();
		}
	})
}
tokenBalance() {
	// alert("entered")
	// e.preventDefault();

	var self = this;
			const contract = require('truffle-contract')
			const hurify = contract(Hurify)
			// console.log(this.state.web3);
			if ((this.state.web3 == "undefined") || (this.state.web3 == null)) {
				// alert("Please install Meta mask to proceed furthur")

			}
			else {
				this.state.web3.version.getNetwork((err, netId) => {
					if (netId != 1) {
						// alert("Please choose Main Etherium Network.")
						// this.setState({
						// 	indicatorDisplay:'none'
						// })
						// window.stop();
					}
					else {
			hurify.setProvider(this.state.web3.currentProvider)
			var hurifyInstance;
			this.state.web3.eth.getAccounts((error, accounts) => {
				 console.log("accounts of 0"+accounts[0]);
				if ((accounts[0] == "undefined") || (accounts[0] == null)) {
					// alert("Please unlock Metamask, and create Metamask account to proceed further")

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
						cookies.set('balance', crypt.encrypt(balanceAmount), { path: '/' });
										 self.setState({
											 metamaskBalance:balanceAmount
										 })
						//return resolve({success : "true" , balanceAmount : balanceAmount});
					}).catch(function(err) {
						console.log("Err: ", err);

							// alert("Please create an account in Metamask to proceed further")

					});
			}
			})
		}
	})
		}
 }

profileCompleteness() {
	AuthLayer.profileCompleteness(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
			if (response.data.data.profilePercentage == 100) {
				$('#profile').attr('disabled', true);
				this.setState({
					profileCompletenessOpacity:0.6
				})
			}
			else {
			}
		}
	})
}
render(){
  return(
    <div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#eaeef1',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
      <div className="row" style={{backgroundColor:'#fff', height:'55px',marginTop:'60px'}}>
					<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Token Balance: {this.state.metamaskBalance.toString()} HUR</label>
				</div>
			<div className="row" style={{margin:'50px 80px 0px 80px',textAlign:'center',background:'#fff',paddingBottom:'20px'}}>
				<p style={{fontSize:'25px',fontWeight:'600'}}>SPEND</p>
				<div className={styles.flex_container2}>
					<a href={this.state.clientHref}><div className={styles.box} id="clientData" style={{opacity:this.state.clientOpacity}}>
						<div className={styles.borderedBox}>
						<div className={styles.icon}>
							<i className="fa fa-upload" aria-hidden="false" style={{fontSize:'40px',textAlign:'center',margin:'10px auto'}}></i>
						</div>
						<h4 style={{margin:'0px auto',textAlign:'center',color:'#000'}}>Submit Project</h4>
						<p style={{fontSize:'16px',fontWeight:'600'}}>HUR Negotiable</p>
						<p style={{fontWeight:'600'}}>Upload Project Details and find developers whose skills match your requirements.</p>
						</div>
						<div>
							<a className={styles.mytokenButton} href={this.state.clientHref}>Submit Project</a>
						</div>
					</div></a>
					<a href="/dashboard/marketplace"><div className={styles.box}>
						<div className={styles.borderedBox}>
						<div className={styles.icon}>
							<i className="fa fa-shopping-cart" aria-hidden="false" style={{fontSize:'40px',textAlign:'center',margin:'10px auto'}}></i>
						</div>
						<h4 style={{margin:'0px auto',textAlign:'center',color:'#000'}}>Shop Hardware Marketplace</h4>
						<p style={{fontSize:'16px',fontWeight:'600'}}>HUR (Varies)</p>
						<p style={{fontWeight:'600'}}>Find devices, development boards and other components in small or large quantities.</p>
						</div>
						<div>
							<a className={styles.mytokenButton} href="/dashboard/marketplace">Shop Hardware Marketplace</a>
						</div>
					</div></a>
					<a><div className={styles.box} style={{opacity:this.state.userOpacity}}>
						<div className={styles.borderedBox}>
						<div className={styles.icon}>
							<i className="fa fa-user-plus" aria-hidden="false" style={{fontSize:'40px',textAlign:'center',margin:'10px auto'}}></i>
						</div>
						<h4 style={{margin:'0px auto',textAlign:'center',color:'#000'}}>Upgrade Profile</h4>
						<p style={{fontSize:'16px',fontWeight:'600'}}>HUR (20)</p>
						<p style={{fontWeight:'600'}}>Add badges, training certificates and other features to help you stand out from the crowd.</p>
						</div>
						<div>
							<a className={styles.mytokenButton}>Upgrade Profile</a>
						</div>
					</div></a>
				</div>
			</div>
			<div className="row" style={{margin:'50px 80px 50px 80px',textAlign:'center',background:'#fff',paddingBottom:'20px'}}>
				<p style={{fontSize:'25px',fontWeight:'600'}}>EARN</p>
				<div className={styles.flex_container2}>
					<a href={this.state.devHref}><div className={styles.box} id="developerData" style={{opacity:this.state.devOpacity}}>
						<div className={styles.borderedBox}>
						<div className={styles.icon}>
							<i className="fa fa-pencil-square-o" aria-hidden="false" style={{fontSize:'40px',textAlign:'center',margin:'10px auto'}}></i>
						</div>
						<h4 style={{margin:'0px auto',textAlign:'center',color:'#000'}}>Find a Project</h4>
						<p style={{fontSize:'16px',fontWeight:'600'}}>HUR Negotiable</p>
						<p style={{fontWeight:'600'}}>Browse through open projects and apply for work.</p>
						</div>
						<div>
							<a className={styles.mytokenButton} href={this.state.devHref}>Find A Project</a>
						</div>
					</div></a>
					<a><div className={styles.box} style={{opacity:this.state.userOpacity}}>
						<div className={styles.borderedBox}>
						<div className={styles.icon}>
							<i className="fa fa-search" aria-hidden="false" style={{fontSize:'40px',textAlign:'center',margin:'10px auto'}}></i>
						</div>
						<h4 style={{margin:'0px auto',textAlign:'center',color:'#000'}}>Write a Product Review</h4>
						<p style={{fontSize:'16px',fontWeight:'600'}}>HUR (80)</p>
						<p style={{fontWeight:'600'}}>Write a product review to help the community understand what it is really like to work with a hardware or software product.</p>
						</div>
						<div>
							<a className={styles.mytokenButton}>Write a Product Review</a>
						</div>
					</div></a>
					<a><div className={styles.box} id="profile" style={{opacity:this.state.userOpacity}}>
						<div className={styles.borderedBox}>
						<div className={styles.icon}>
							<i className="fa fa-user-circle-o" aria-hidden="false" style={{fontSize:'40px',textAlign:'center',margin:'10px auto'}}></i>
						</div>
						<h4 style={{margin:'0px auto',textAlign:'center',color:'#000'}}>Complete Profile</h4>
						<p style={{fontSize:'16px',fontWeight:'600'}}>HUR (25)</p>
						<p style={{fontWeight:'600'}}>Answer questions about your experience to help match your skills to appropriate projects, Detailed profiles rank higher.</p>
						</div>
						<div>
							<a className={styles.mytokenButton}>Complete Profile</a>
						</div>
					</div></a>

				</div>

			</div>

   </div>
  )
}
}
MyTokenPage2.contextTypes = {
  router: PropTypes.object.isRequired
}
export default MyTokenPage2
