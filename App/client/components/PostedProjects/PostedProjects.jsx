import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import styles from './PostedProjects.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import moment from 'moment'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import {balance} from './../SubmitProjectPage/SubmitProjectpage'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class PostedProjects extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			params: {
				token: '',
				userId:'',
				clientId: '',
				projectId: '',
				projectStatusId: '',
				message: []
			}
		}
		this.projectClick = this.projectClick.bind(this);
		this.ProjectsList = this.ProjectsList.bind(this);
		this.tokenBalance = this.tokenBalance.bind(this);
		this.tokenTransfer = this.tokenTransfer.bind(this);
		this.UpdatingStatusValue = this.UpdatingStatusValue.bind(this);
	}
	componentWillMount() {
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
							this.ProjectsList();
						} else {
								if (response.data.error == "API session expired, Please login again!") {
									this.context.router.push('/logout');
								}
							}
				})

		}
		ProjectsList(){
			const user = this.state.params
			user['clientId'] = crypt.decrypt(cookies.get('client_id'))
			user['token'] = crypt.decrypt(cookies.get('token'))
			this.setState({user})
					AuthLayer.PostedProjectsList(this.state.params)
					.then(response => {
							if (response.data.success){
								const user = this.state.params
								user['message'] = response.data.data
								this.setState({user})
								getWeb3
								.then(results => {
									this.setState({
										web3: results.web3
									})
								})
								.catch(() => {
									console.log('Error finding web3.')
								})

							} else {
								//alert(JSON.stringify(response.data.error))
								}
					})
		}
		projectClick(event) {
			cookies.set('project_id', crypt.encrypt(event), { path: '/' });
			this.context.router.push('/dashboard/postedprojectsdesc')
		}

UpdateStatus(projectId){
const user = this.state.params
user['token'] = crypt.decrypt(cookies.get('token'))
user['projectId'] = projectId
this.setState({user})
this.tokenBalance();
}
UpdatingStatusValue(){
	AuthLayer.UpdateProjectStatus(this.state.params)
	.then(response => {
			if (response.data.success){
				alert("Your project is changed to open for bids")
				this.ProjectsList();
		  }else {
				//alert(JSON.stringify(response.data.error))
				alert("Failed to transfer HUR")
				}
	})
}
tokenBalance() {
	 		var self = this;
			 const contract = require('truffle-contract')
			 const hurify = contract(Hurify)
			 hurify.setProvider(this.state.web3.currentProvider)
			 var hurifyInstance;
			 this.state.web3.eth.getAccounts((error, accounts) => {
				 hurify.deployed().then(function(instance) {
					 hurifyInstance = instance;
					 return hurifyInstance.balanceOf(accounts[0], {from: accounts[0]})
				 }).then(function(balance) {
					 if (balance.div(1e18) >= 1) {
						 self.tokenTransfer();
					 }
					 else {
						 alert("You have unsufficient balance, Please get some HUR. Your balance is " + balance.div(1e18))
					 }
				 })
			 })
 }

 // Function to Transfer token to HUR address while submitting projects.
	 tokenTransfer() {
		 var self = this;
		 const contract = require('truffle-contract')
		 const hurify = contract(Hurify)
		 hurify.setProvider(this.state.web3.currentProvider)
		 var hurifyInstance
		 this.state.web3.eth.getAccounts((error, accounts) => {
			 hurify.deployed().then((instance) => {
				 hurifyInstance = instance
				 return hurifyInstance.transfer("0x5149Bd53B0207ac731267826801e7f06f3F52fcF", 1000000000000000000, {from: accounts[0]})
			 }).then((result) => {
				 if (result.receipt.status == "0x1"){
					 const user = self.state.params
					 user['projectStatusId'] = 2
					 this.setState({user})
					 self.UpdatingStatusValue();
				 }
				 else {

					 alert("failed to transfer but your project was saved in Posted projects")
					 const user = self.state.params
					 user['projectStatusId'] = 1
					 this.setState({user})
					 self.UpdatingStatusValue();
				 }
				 return result
			 })
		 })
	 }
	render(){
		const List = this.state.params.message
		var todaysDate = moment(new Date());
		var arr = [];
		var sampleArray = [];
		var projectList = '';

		if (List == "") {
         projectList = (
            <div className="row">
              <div className="col-md-12" style={{width:'100%', textAlign:'center'}}>
                No Projects Posted
              </div>
            </div>
        )
    }
    else {
		 sampleArray = List.map((i) => {
			if (i.ProjectStatus.status == "submitted") {
					arr.push(<button type="button" className="btn btn-primary btn-xs" style={{color:'#ffffff',backgroundColor: '#4FC3F7',marginLeft:'5px'}} onClick={() => this.UpdateStatus(i.id)}>{i.ProjectStatus.status}</button>)
			}
			else {
				arr.push(<span className={styles.fieldvalue} style={{paddingLeft:'10px'}}>{i.ProjectStatus.status}</span>)
			}
	  })

		 projectList = List.map((i, index) =>
				<div>
									<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
										<a href='#' onClick={() => this.projectClick(i.id)}><h4>{i.projectName}</h4></a>
											<div className="row" style={{margin:'5px'}}>

												<div className="col-md-12">
													<div className="row" style={{padding:'5px 0px 10px 0px'}}>

														<div className="col-md-10">
															<span className={styles.fieldname} style={{padding:'0px 5px 0px 0px'}}>{todaysDate.diff(moment(i.createdAt), 'days')} Days Ago</span> -
															<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>{i.experienceLevel}</span> -
															<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>Est.Time: {i.estimatedDays} Days</span> -
															<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>Cost: {i.price} HUR</span>
														</div>

														<div className="col-md-2 text-left">
															<span className={styles.fieldname}>No of Bids:</span><span className={styles.fieldvalue} style={{paddingLeft:'10px'}}>{i.AppliedProjects.length}</span>
														</div>
													</div>
												</div>

												<div className="row" style={{padding:'5px 0px 10px 15px'}}>

													<div className="col-sm-12 text-left">
														<span className={styles.fieldvaluedesc}>{i.projectAbstract}</span>
													</div>
												</div>
												<div className="row" style={{margin:'5px 0px',padding:'5px 0px 0px 0px'}}>
													<div className="col-sm-12">
														{i.category.split(',').map((i) =>
																	<span className={styles.tech}><a href='#'>{i}</a></span>
				       							)}
													</div>
												</div>
												<div className="row" style={{padding:'10px 0px 0px 15px'}}>
													<div className="col-md-12 text-left">
														<p style={{textAlign:'left'}}><span className={styles.fieldname}>Project Status:</span>{arr[index]}</p>
													</div>
												</div>

											</div>
									</div>

									<hr style={{width:'96%',align:'center', marginLeft:'2%', marginTop:'0px',marginBottom:'0px'}}/>
					</div>
		);
}
		return(
			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
				<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
					<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Projects List</label>
				</div>
				<div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
					{projectList}

				</div>
			</div>
			)
	}
}

PostedProjects.contextTypes = {
    router: PropTypes.object.isRequired
}
export default PostedProjects
