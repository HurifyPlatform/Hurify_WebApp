import React from 'react'
import styles from './TokensaleStatus.css'
import AuthLayer from './../../network/AuthLayer'
import ModalStore from './../../stores/ModalStore'
import axios from 'axios'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')
import fetch from 'node-fetch';
import moment from 'moment'
const cookies = new Cookies();
var referralData = {}
var KYCStatus = '';
var KYCButtonDisplay = 'none';
class TokensaleStatus extends React.Component {
	constructor(props) {
        super(props)
        this.state = {
            params: {
                token: '',
								email:'',
								data:[],
								walletAddress:''
            },
						referralData: {},
						infoDisplay:'none',
						formDisplay:'none',
						// KYCStatus:'',
						// KYCButtonDisplay:'none',
						transactionStatus:'Transaction Verified'
        }
				this.SubmitKYCClick = this.SubmitKYCClick.bind(this);

    }
    componentWillMount() {
			const user = this.state.params
      user["token"] = crypt.decrypt(cookies.get('token'))
      user["email"] = crypt.decrypt(cookies.get('email'))
			user["userId"] = crypt.decrypt(cookies.get('UserID'))
      this.setState({user})
			AuthLayer.getAllTokenData(this.state.params)
			.then(response => {
					if (response.data.success) {
						console.log(JSON.stringify(response.data))
						if ((response.data.data == null) || (response.data.data == "")) {
							const params = this.state.params
							params["data"] = []
							this.setState({params})
							this.setState({
								infoDisplay:'block',
								formDisplay:'none'
							})
						}
						else {
							this.setState({
								infoDisplay:'none',
								formDisplay:'block'
							})
						const params = this.state.params
						params["data"] = response.data.data
						params["walletAddress"] = response.data.data[0].walletAddress
						this.setState({params})
						if ((response.data.data[0].firstName == null) || (response.data.data[0].firstName == "")) {
							// this.setState({
							// 	KYCStatus:'Not Submitted',
							// 	KYCButtonDisplay:'block'
							// })
							KYCStatus = "Not Submitted"
							KYCButtonDisplay = "block"
						}
						else {
							if (response.data.data[0].riskFlag == 1) {
							// 	this.setState({
							// 	KYCStatus:'Verification in process',
							// 	KYCButtonDisplay:'none'
							// })
							KYCStatus = "Verification in process"
							KYCButtonDisplay = "none"
							}
							else {
									// this.setState({
									// 	KYCStatus:'Submitted',
									// 	KYCButtonDisplay:'none'
									// })
									KYCStatus = "Submitted"
									KYCButtonDisplay = "none"
							}
						}
					}
					// this.getReferralCount();
					this.testingReferrals();
			}
			else {
				alert(JSON.stringify(response.data.error))
			}
		});

    }
		// getReferralCount() {
		// 	AuthLayer.getReferralCount(this.state.params)
		// 	.then(response => {
		// 		alert(JSON.stringify(response.data))
		// 		if (response.data.success) {
		// 			this.setState({referralData : {
		// 				"userSignup":(response.data.data.referredData.user) + (response.data.data.userAction.user),
		// 				"telegram":(response.data.data.referredData.telBounty) + (response.data.data.userAction.telBounty),
		// 				"productHunt":(response.data.data.referredData.prodHunt) + (response.data.data.userAction.prodHunt),
		// 				"tokenSale":(response.data.data.referredData.tokSale) + (response.data.data.userAction.tokSale),
		// 				"airDrop":(response.data.data.userAction.airDrop)
		// 			}})
		// 			this.testingReferrals();
		// 		}
		// 	})
		// }
		testingReferrals() {
			const AllData = {
				token:this.state.params.token,
				data: {
					userId:this.state.params.userId,
					email:crypt.decrypt(cookies.get('email'))
				}
			}
			AuthLayer.totalReferralStakes(AllData)
			.then(response => {
				// alert(JSON.stringify(response.data))
				if (response.data.success) {
					this.setState({referralData : {
						"userSignup":response.data.data.user,
						"telegram":response.data.data.telBounty,
						"productHunt":response.data.data.prodHunt,
						"tokenSale":response.data.data.tokSale,
						"airDrop":response.data.data.airdrop
					}})
				}
			})
		}
// ValidateTransactionHash() {
// 	var transactionData = {
// 		token:crypt.decrypt(cookies.get('token')),
// 		transactionHash:"0x3084e2dc533208d1215c7c060ca7486f210230beca7486f210230beca7486f",
// 		type:"DASH"
// 	}
// 	console.log(transactionData);
// 	AuthLayer.validateTransactionHash(transactionData)
// 	.then(response => {
// 		// alert(JSON.stringify(response))
// 			if (response.data.success) {
// 				// alert(JSON.stringify(response.data))
//
//
// 			}
// 	});
// }
SubmitKYCClick(event) {
	event.preventDefault();
	this.context.router.push('/dashboard/kycform')
}
	render(){
	var arr = [];
	// var gridColorArr =[];
	var statusColor = [];
	var data = this.state.params.data
	var sampleArray = data.map((i, index) => {
		// console.log(index);
		 if ((i.referralCode == "")  || (i.referralCode == null)){
				 arr.push(<div className='col-md-3' style={{display:'none'}}></div>)
		 }
		 else {
			 arr.push(<div className='col-md-3' style={{display:'block'}}><label style={{paddingRight:'10px'}}>Referral Code:</label>  {i.referralCode}</div>)
		 }
		//  if (index%2 == 1) {
		// 	 gridColorArr.push("#fff")
		//  }
		//  else {
		//  	gridColorArr.push("#fff")
		// }
		if ((i.status == "Dispute") || (i.status == "Transaction Invalid") || (i.status == "dispute")){
			statusColor.push("#f15722")
		}
		else if ((i.status == "Submitted") || (i.status == "submitted")){
			statusColor.push("#0268a6")
		}
		else if (i.status == "Transaction Verified") {
			statusColor.push("green")
		}
		else if (i.status == "Tokens Transferred") {
			statusColor.push("green")
			// this.setState({
			// 	KYCStatus:'Verified',
			// 	KYCButtonDisplay:'none'
			// })
			KYCStatus = "Verified"
			KYCButtonDisplay = "none"
		}
		else {
			statusColor.push("black")
		}
	 })
	var List = '';
	List = data.map((i, index) =>
	<div>
	    <div className="list-group-item" style={{borderTop:'0 none',backgroundColor:'#fff'}} >
				<div className="row" style={{paddingTop:'-40px'}}>
					<div className="col-md-1" style={{textAlign:'center',paddingTop:'30px',fontSize:'20px'}}>
							<div className={styles.data}></div>
					</div>
					<div className="col-md-11">
			      <div className="row" style={{color:'#000'}}>
							<div className="col-md-6"><span style={{paddingRight:'10px',fontSize:'18px'}}>Status:</span><span style={{fontSize:'18px',color:statusColor[index]}}> {i.status}</span></div>
							<div className="col-md-6" style={{textAlign:'right'}}><label style={{paddingRight:'10px'}}>Date:</label>  {new moment(new Date(i.createdAt)).format('MM/D/YY')}</div>

						</div>

						<div className="row" style={{paddingTop:'10px'}}>
							<div className='col-md-3'><label style={{paddingRight:'10px'}}>Currency Type:</label> {i.currency}</div>
							<div className='col-md-3'><label style={{paddingRight:'10px'}}>no. of Currency:</label>  {i.numberOfCryptoCurrency}</div>
							{arr[index]}
						</div>
						<p className="list-group-item-text"><label style={{paddingRight:'10px',paddingTop:'10px'}}>Transaction Hash:</label> {i.transactionHash}</p>
						{/*<p className="list-group-item-text" style={{paddingTop:'10px',paddingBottom:'5px'}}><label style={{paddingRight:'10px'}}>HUR Tokens:</label>  30000</p>*/}
					</div>
			  </div>
	    </div>
			<hr style={{width:'96%',align:'center', marginLeft:'2%', marginTop:'0px',marginBottom:'0px'}}/>
			</div>
	)
		return(
			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'85vh',overFlowY:'scroll'}}>
				<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
					<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>My Token</label>
				</div>
				<p style={{display:this.state.infoDisplay,textAlign:'center',paddingTop:'70px',fontSize:'20px'}}>No transactions found!</p>


			<table class="table table-striped" className={styles.table1} id="notification" style={{margin:'80px 30px 70px 30px'}}>
						<thead>
						<tr>
								<th className={styles.tableheader} style={{width:'20%', float:'left'}}>Telegram Bounty</th>
								<th className={styles.tableheader} style={{width:'20%', float:'left'}}>Product Hunt Bounty</th>
								<th className={styles.tableheader} style={{width:'20%', float:'left'}}>AirDrop</th>
								<th className={styles.tableheader} style={{width:'20%', float:'left'}}>Token Sale Referrals</th>
								<th className={styles.tableheader} style={{width:'20%', float:'left'}}>User Signup Referrals</th>
						</tr>
						</thead>
						<tbody className={styles.tbody}>
						<tr className={styles.tablerow}>
								<td className={styles.tabledata} style={{width:'20%', float:'left'}}><a type="button" className={styles.tableButton}> {this.state.referralData.telegram} STAKES</a></td>
								<td className={styles.tabledata} style={{width:'20%', float:'left'}}><a type="button" className={styles.tableButton}> {this.state.referralData.productHunt} STAKES</a></td>
								<td className={styles.tabledata} style={{width:'20%', float:'left'}}><a type="button" className={styles.tableButton}> {this.state.referralData.airDrop} STAKES</a></td>
								<td className={styles.tabledata} style={{width:'20%', float:'left'}}><a type="button" className={styles.tableButton}> {this.state.referralData.tokenSale} STAKES </a></td>
								<td className={styles.tabledata} style={{width:'20%', float:'left'}}><a type="button" className={styles.tableButton}> {this.state.referralData.userSignup} STAKES</a></td>
						</tr>
						</tbody>
					</table>


				<div style={{margin:'50px 20px 70px 30px',display:this.state.formDisplay}}>
				<div className="row" style={{paddingBottom:'5px'}}>
					<div className="col-md-5">
						<label style={{float:'left'}}>KYC Status:</label> <span style={{color:'#f15722',fontSize:'16px',paddingLeft:'10px',float:'left'}}>{KYCStatus}</span>
						<span><button style={{padding:'0px',marginLeft:'20px',backgroundColor:'#0268a6',color:'#fff',paddingLeft:'10px',paddingRight:'10px',display:KYCButtonDisplay,float:'left'}} onClick={this.SubmitKYCClick}>Submit KYC</button></span>
					</div>
					<div className="col-md-7" style={{textAlign:'right'}}>
						<label>Wallet Address:</label> <span style={{color:'f15722',fontSize:'16px',paddingLeft:'10px'}}>{this.state.params.walletAddress}</span>
					</div>
				</div>
				<div className="list-group" style={{backgroundColor:'#fff'}}>
					<div className="list-group-item" style={{borderBottom:'1 none'}}>
						<h4 style={{textAlign:'center',paddingBottom:'0px'}}>Transactions</h4>
					</div>
					<div id={styles.list}>
					{List}
					</div>
				</div>
				</div>
			</div>
		)
	}
}
TokensaleStatus.contextTypes = {
    router: PropTypes.object.isRequired
}
export default TokensaleStatus
