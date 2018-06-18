import React from 'react'
import { Dashboard, Header, Sidebar } from 'react-adminlte-dash'
import $ from "jquery";
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import style from './Dashboardpage.css'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')
import AuthLayer from './../../network/AuthLayer'
import axios from 'axios'
import logout from './logout.png'
import PlatformHeader from './PlatformHeader'
import PrivacyPolicyNew from './../../components/PrivacyPolicyNew/PrivacyPolicyNew'
import TermsAndConditionsNew from './../../components/TermsAndConditionsNew/TermsAndConditionsNew'
import ModalStore from './../../stores/ModalStore'
import CookiePolicy from './../../components/CookiePolicy/CookiePolicy'
import GDPRpolicy from './../../components/GDPRpolicy/GDPRpolicy'
import PrivacyPolicyNew_dash from './../../components/PrivacyPolicyNew_Dashboard/PrivacyPolicyNew'
import CookiePolicy_dash from './../../components/CookiePolicy_Dashboard/CookiePolicy'
import DataRetensionPolicy from './../../components/DataRetensionPolicy/DataRetensionPolicy'

const cookies = new Cookies();
var Email = '';
var balance ='';
class Dashboardpage extends React.Component {
	constructor(props) {
		super(props)
    this.state = {
      profile: '',
			name:'',
			jobTitle:'',
			params: {
				token:'',
				userId:''
			},
			PurchaseConfirmation:'none',
			supportManagementDisplay:'none',
			tokenURL:'',
			infoDisplay:'none',
			countryBlockDisplay:'none',
			transactionsDisplay:'none',
			cookiePolicyDisplay:'none',
			adminOrderStatus:'none',
			denyPolicyDisplay:'none'
    }
		this.logout = this.logout.bind(this);
		this.updateCookiePolicyFlag = this.updateCookiePolicyFlag.bind(this);
		this.DenyPolicies = this.DenyPolicies.bind(this);
  }
  componentWillMount() {
		 Email = (crypt.decrypt(cookies.get('email')))
		 balance = (crypt.decrypt(cookies.get('balance')))
    if (crypt.decrypt(cookies.get('token')) == null) {
      window.location = "/logout"
			// window.location.href =  '/logout'
    }
		if(Email =="schmouli@hurify.co" || Email =="timgalvin@hurify.co" || Email =="lspandana1995@gmail.com"){
			this.setState({
				PurchaseConfirmation:'block'
			})
		}
		if (Email =="schmouli@hurify.co" || Email =="lakshmi.spandana@mobodexter.com" || Email =="russell.murphy@hurify.co") {
			this.setState({
				adminOrderStatus:'block'
			})
		}
    this.state.profile = crypt.decrypt(cookies.get('ProfilePhoto'))
		this.state.name = (crypt.decrypt(cookies.get('name')))
		this.state.jobTitle = crypt.decrypt(cookies.get('jobTitle'))
		this.CheckUserData();
		this.checkTransactionData();
		axios.get("https://api.ipify.org?format=json", {
				validateStatus: () => true
		}).then(result => {
				axios.get("https://ipapi.co/" + result.data.ip + "/json/", {
						validateStatus: () => true
				}).then(result => {
						if (result.data.country == "Canada") {
							this.setState({
								infoDisplay:'none',
								countryBlockDisplay:'block'
							})
						}
						else {
							this.setState({
								infoDisplay:'block',
								countryBlockDisplay:'none'
							})
						}
				}).catch(err => {
					this.setState({
						infoDisplay:'none',
						countryBlockDisplay:'block'
					})
				})
		})
  }
	CheckUserData() {
		const user = this.state.params
		user["token"] = crypt.decrypt(cookies.get('token'))
		user['userId'] = crypt.decrypt(cookies.get('UserID'))
		this.setState({user})
	AuthLayer.CheckUserData(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
		if((crypt.decrypt(cookies.get('email')) == "schmouli@hurify.co") || (crypt.decrypt(cookies.get('email')) == "sridharkrishnan73@gmail.com")) {
			this.setState({
				supportManagementDisplay:'block'
			})
		}
		if (response.data.data.cookiePolicyFlag == 0) {
			this.setState({
				cookiePolicyDisplay:'block'
			})
		}
	}
	else {
		if (response.data.error == "API session expired, Please login again!") {
			this.context.router.push('/logout');
		}
	}
	})
}
checkTransactionData() {
	const user = {
	token: crypt.decrypt(cookies.get('token')),
	userId: crypt.decrypt(cookies.get('UserID')),
	email: crypt.decrypt(cookies.get('email'))
	}
	AuthLayer.getAllTokenData(this.state.user)
	.then(response => {
		console.log(JSON.stringify(response.data))
			if (response.data.success) {

				if ((response.data.data != null) && (response.data.data != "")) {
					this.setState({
						transactionsDisplay:'block'
					})
				}
			}
		})
}
logout(event) {
	// event.preventDefault();
	  window.location = '/logout'
		// window.location.href =  '/dashboard/welcometoHURIFY'
}
updateCookiePolicyFlag() {
	var data = {
		token : crypt.decrypt(cookies.get('token')),
		userId: crypt.decrypt(cookies.get('UserID'))
	}
	AuthLayer.updateCookiePolicyFlag(data)
	.then(response => {
		if (response.data.success) {
			console.log("cookieeee ", response.data);
			this.setState({
				cookiePolicyDisplay:'none'
			})
		}
		else {
			this.setState({
				cookiePolicyDisplay:'block'
			})
			alert(response.data.error)
		}
	})
}
DenyPolicies(e) {
	e.preventDefault();
	 window.location = '/logout'
}

  render(){
		const nav = () => {

				return(
					<div>


					</div>
				);


		}

const sb = () => {
	if ((crypt.decrypt(cookies.get('profileupdate_status')) == "true") || (crypt.decrypt(cookies.get('profileupdate_status')) == "1")){
		if (crypt.decrypt(cookies.get('account_type')) == "developer") {
			return(
				<div>
				<a href="/dashboard/mytoken" style={{textAlign:'center',marginTop:'-10px',color:'#fff'}}>
					<div className="row" style={{marginTop:'-20px',marginBottom:'50px'}}>
						<img className="logo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" style={{width:'75px'}}alt="hurify" />
					</div>
				</a>
				<Sidebar.Menu key="1">
					<Sidebar.Menu.Item title="My Tokens" href="/dashboard/mytoken" icon={{className:'fa fa-database'}}/>
					<Sidebar.Menu.Item title="Projects" icon={{className:'fa fa-clipboard'}}>
						<Sidebar.Menu.Item title="Find Projects" href="/dashboard/findprojects" icon={{className:'fa-search'}}/>
						<Sidebar.Menu.Item title="Applied Jobs" href="/dashboard/appliedprojects" icon={{className:'fa-folder-open-o'}}/>
					</Sidebar.Menu.Item>
					<Sidebar.Menu.Item title="Marketplace" href="/dashboard/marketplace" icon={{className:'fa fa-shopping-cart'}}/>
					<div style={{display:this.state.transactionsDisplay}}>
						<Sidebar.Menu.Item title="Tokensale Transactions" href="/dashboard/tokensalestatus"  icon={{className:'fa fa-hourglass-2'}}/>
					</div>
					<div style={{display:this.state.PurchaseConfirmation}}>
						<Sidebar.Menu.Item title="Purchase Confirmation" href="/dashboard/purchaseconfirmation" icon={{className:'fa fa-share-square-o'}}/>
					</div>
					<Sidebar.Menu.Item title="Support" icon={{className:'fa fa-question-circle-o'}}>
						<Sidebar.Menu.Item title="Videos" href="/dashboard/productvideos" icon={{className:'fa fa-video-camera'}}/>
						<Sidebar.Menu.Item title="Blogs" href="/dashboard/blogs" icon={{className:'fa fa-bold'}}/>
						<Sidebar.Menu.Item title="Support" href="/dashboard/support" icon={{className:'fa fa-question-circle-o'}}/>
					</Sidebar.Menu.Item>
					<div style={{display:this.state.supportManagementDisplay}}>
						<Sidebar.Menu.Item title="Support Management" href="/dashboard/supportmanagement" icon={{className:'fa fa-question-circle-o'}}/>
					</div>
					<div style={{display:this.state.adminOrderStatus}}>
						<Sidebar.Menu.Item title="Admin Access" href="/dashboard/marketplace/admin_orders" icon={{className:'fal fa-user-circle-o'}}/>
					</div>
				</Sidebar.Menu>
			</div>
			);
		}
	 else if (crypt.decrypt(cookies.get('account_type')) == "client") {
		 return(
			 <div>
			 <a href="/dashboard/mytoken" style={{textAlign:'center',marginTop:'-10px',color:'#fff'}}>
				 <div className="row" style={{marginTop:'-20px',marginBottom:'50px'}}>
					 <img className="logo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" style={{width:'75px'}}alt="hurify" />
				 </div>
			 </a>
			 <Sidebar.Menu key="1">
			 	 <Sidebar.Menu.Item title="My Tokens" href="/dashboard/mytoken" icon={{className:'fa fa-database'}}/>
				 <Sidebar.Menu.Item title="Projects" icon={{className:'fa fa-clipboard'}}>
					 <Sidebar.Menu.Item title="Create Project" href="/dashboard/submitproject" icon={{className:'fa fa-folder-o'}}/>
			 	   <Sidebar.Menu.Item title="Manage Project" href="/dashboard/postedprojects" icon={{className:'fa-random'}}/>
				 </Sidebar.Menu.Item>
				 <div style={{display:this.state.transactionsDisplay}}>
					 <Sidebar.Menu.Item title="Tokensale Transactions" href="/dashboard/tokensalestatus"  icon={{className:'fa fa-hourglass-2'}}/>
				 </div>
				 <div style={{display:this.state.PurchaseConfirmation}}>
					 <Sidebar.Menu.Item title="Purchase Confirmation" href="/dashboard/purchaseconfirmation" icon={{className:'fa fa-share-square-o'}}/>
				 </div>
				 <Sidebar.Menu.Item title="Marketplace" href="/dashboard/marketplace" icon={{className:'fa fa-shopping-cart'}}/>
				 <Sidebar.Menu.Item title="Support" icon={{className:'fa fa-question-circle-o'}}>
					 <Sidebar.Menu.Item title="Videos" href="/dashboard/productvideos" icon={{className:'fa fa-video-camera'}}/>
					 <Sidebar.Menu.Item title="Blogs" href="/dashboard/blogs" icon={{className:'fa fa-bold'}}/>
					 <Sidebar.Menu.Item title="Support" href="/dashboard/support" icon={{className:'fa fa-question-circle-o'}}/>
				 </Sidebar.Menu.Item>
				 <div style={{display:this.state.supportManagementDisplay}}>
				 	<Sidebar.Menu.Item title="Support Management" href="/dashboard/supportmanagement" icon={{className:'fa fa-question-circle-o'}}/>
				 </div>
				 <div style={{display:this.state.adminOrderStatus}}>
					 <Sidebar.Menu.Item title="Admin Access" href="/dashboard/marketplace/admin_orders" icon={{className:'fal fa-user-circle-o'}}/>
				 </div>
			</Sidebar.Menu>
			</div>
		 );
	 }

	}
	else {
		return(
			<div>
				<a href="/dashboard/mytoken" style={{textAlign:'center',marginTop:'-10px',color:'#fff'}}>
					<div className="row" style={{marginTop:'-20px',marginBottom:'50px'}}>
						<img className="logo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" style={{width:'75px'}}alt="hurify" />
					</div>
				</a>
			<Sidebar.Menu key="1">
				<Sidebar.Menu.Item title="My Tokens" href="/dashboard/mytoken" icon={{className:'fa fa-database'}}/>
				<Sidebar.Menu.Item title="Create Profile" href="/dashboard/chooseprofile" icon={{className:'fa fa-folder-o'}}/>
				<div style={{display:this.state.transactionsDisplay}}>
					<Sidebar.Menu.Item title="Tokensale Transactions" href="/dashboard/tokensalestatus"  icon={{className:'fa fa-hourglass-2'}}/>
				</div>
				<div style={{display:this.state.PurchaseConfirmation}}>
					<Sidebar.Menu.Item title="Purchase Confirmation" href="/dashboard/purchaseconfirmation" icon={{className:'fa fa-share-square-o'}}/>
				</div>
				<Sidebar.Menu.Item title="Marketplace" href="/dashboard/marketplace" icon={{className:'fa fa-shopping-cart'}}/>
				<Sidebar.Menu.Item title="Support" icon={{className:'fa fa-question-circle-o'}}>
					<Sidebar.Menu.Item title="Videos" href="/dashboard/productvideos" icon={{className:'fa fa-video-camera'}}/>
					<Sidebar.Menu.Item title="Blogs" href="/dashboard/blogs" icon={{className:'fa fa-bold'}}/>
					<Sidebar.Menu.Item title="Support" href="/dashboard/support" icon={{className:'fa fa-question-circle-o'}}/>
				</Sidebar.Menu.Item>
				<div style={{display:this.state.supportManagementDisplay}}>
					<Sidebar.Menu.Item title="Support Management" href="/dashboard/supportmanagement" icon={{className:'fa fa-question-circle-o'}}/>
				</div>
				<div style={{display:this.state.adminOrderStatus}}>
					<Sidebar.Menu.Item title="Admin Access" href="/dashboard/marketplace/admin_orders" icon={{className:'fal fa-user-circle-o'}}/>
				</div>
			</Sidebar.Menu>
			</div>
		);
	}
}


const footer = () => ([
  <strong>
    <p style={{textAlign:'center'}}>Copyright © 2017 Hurify.Inc.<span style={{fontWeight:'500'}}> All rights reserved.</span></p>
  </strong>,
	<p style={{textAlign:'center'}}>
	<a href="#termsofservice" onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('terms', true)}} target="_blank">Terms of Services </a><span style={{paddingLeft:'10px',paddingRight:'10px'}}> | </span>
	<a href="#privacypolicy" onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('privacy_policy', true)}} target="_blank"> Privacy Policy</a></p>
]);
// const Dashboardpage = (props) => {
	return (
		<div>
			<div className="main" style={{display:this.state.countryBlockDisplay,minHeight:'100vh'}}>

					<img style={{marginLeft:'40%',marginRight:'50%',marginTop:'80px'}} src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png"/>
					<p style={{textAlign:'center',fontSize:'2.0em',paddingTop:'100px',color:'#fff'}}>Sorry, Hurify Platform is not available for your country!!</p>

			</div>
			<div style={{display:this.state.infoDisplay}}>

				{/*<div className="row" style={{color:'#000',fontSize:'28px',paddingLeft:'280px',height:'60px'}}>
					<div className="col-md-2">
						<label style={{color:'#000',paddingTop:'10px',fontSize:'28px',fontWeight:'600'}}>Hurify</label>
					</div>
					<div className="col-md-9"></div>
					<div className="col-md-1" style={{paddingTop:'10px'}}>
						<button className={style.logout} style={{width:'30px',height:'40px',background:'transparent',border:'transparent'}} onClick={this.logout} ><span className="glyphicon glyphicon-log-out"><br/><span style={{fontSize:'16px'}}>Logout</span></span></button>
					</div>
				</div>*/}
				<PlatformHeader
					profileImage={this.state.profile}
				/>

			<Dashboard
	    		navbarChildren={nav()}
	    		sidebarChildren={sb()}
	        footerChildren={footer()}
	    		theme="skin-blue"
	    		logoLg = {<span><img style={{width:'50px',paddingRight:'5px'}} src={require("./Hur.png")}/><b>Hurify</b></span>}
	    		sidebarMini
	    		logoSm = {<span><b>H</b>UR</span>}
	  		>
	      {this.props.children}

				<div className={style.indicator} style={{display:this.state.cookiePolicyDisplay}}>
					<div className={style.confirmPopup}>
						To continue with this site, you must first agree to the Hurify Privacy and Cookie policies.
						<div style={{marginTop:'20px'}}>By clicking Accept, you are here by consenting that you are Accepting the <span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('privacy_policy_dashboard', true)}} style={{color:'#fff',textDecoration:'underline'}}> Privacy</a>, </span><span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('cookie_policy_dashboard', true)}} style={{color:'#fff',textDecoration:'underline'}}>Cookie</a>,</span><span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('gdpr_policy', true)}} style={{color:'#fff',textDecoration:'underline'}}>Tier-2 Privacy Policy </a>and <span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('retension_policy', true)}} style={{color:'#fff',textDecoration:'underline'}}> Data retention Policy</a></span> of Hurify Digital Markets, Inc. </span></div>
						<div style={{width:'100%', textAlign:'center'}}>
							<button style={{margin:'20px',textAlign:'center',backgroundColor:'#F5AA51',border:'none',padding:'5px', fontWeight:'700', fontSize:'16px', width:'80px'}} onClick={this.DenyPolicies}>Deny</button>
							<button style={{margin:'20px',textAlign:'center',backgroundColor:'#5dd3f7',border:'none',padding:'5px', fontWeight:'700', fontSize:'16px', width:'80px'}} onClick={this.updateCookiePolicyFlag}>Accept</button>
						</div>
						<div>*  By clicking Deny, You will not be able to avail Hurify services.</div>
				  </div>
				</div>

				{/*<div className={style.indicator} style={{display:this.state.cookiePolicyDisplay}}>
					<div className={style.confirmPopup}>
						To continue with this site, you must first agree to the Hurify <span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('privacy_policy_dashboard', true)}} style={{color:'#fff',textDecoration:'underline'}}> Privacy</a>, </span><span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('cookie_policy_dashboard', true)}} style={{color:'#fff',textDecoration:'underline'}}>Cookie</a> & </span><span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('gdpr_policy', true)}} style={{color:'#fff',textDecoration:'underline'}}>GDPR</a> policies. </span>
						<div style={{marginTop:'20px'}}>By clicking Accept, You are here by consenting that you are accepting the Privacy, Cookie and GDPR policies of Hurify Digital Markets, Inc.</div>
						<div style={{width:'100%', textAlign:'center'}}>
							<button style={{margin:'20px',textAlign:'center',backgroundColor:'#F5AA51',border:'none',padding:'5px', fontWeight:'700', fontSize:'16px', width:'80px'}} onClick={this.DenyPolicies}>Deny</button>
							<button style={{margin:'20px',textAlign:'center',backgroundColor:'#5dd3f7',border:'none',padding:'5px', fontWeight:'700', fontSize:'16px', width:'80px'}} onClick={this.updateCookiePolicyFlag}>Accept</button>
						</div>
						<div>*  By clicking Deny, You will not be able to avail Hurify services.</div>
				  </div>
				</div>*/}

				{/*<div className={popupStyles.formContainer + (ModalStore.modalDisplayed['cookies_popup'] == false ? (' ' + resendStyles.close) : '')}>
		      <form action='/' onSubmit={this.SubmitQuery}>

		        <div className={resendStyles.content}>
		            To continue with this site, you must agree to <span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('privacy_policy', true)}}>Hurify Privacy Policy</a></span>
		            <div>Hurify use cookies for functional and analytical purposes, Please read our <span><a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('terms', true)}}>Cookie Policy</a></span> for funther information. If you agree to our use of cookies, Please close this message and continue using this site.</div>
		            <button>Accept & Close</button>
		        </div>
		      </form>
		    </div>*/}
	  		</Dashboard>
				<PrivacyPolicyNew/>
				<TermsAndConditionsNew/>
				<CookiePolicy/>
				<GDPRpolicy/>
				<PrivacyPolicyNew_dash/>
				<CookiePolicy_dash/>
				<DataRetensionPolicy/>
		</div>
		</div>
	)
}
}
// }
Dashboardpage.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Dashboardpage
