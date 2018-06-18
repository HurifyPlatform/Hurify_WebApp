import React from 'react'
import styles from './ApplyProject.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import ModalStore from './../../stores/ModalStore'
import ApplyPopup from './ApplyPopup'
import moment from 'moment'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


const cookies = new Cookies();
class ApplyProject extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			params: {
				token: '',
				userId:'',
				projectId: '',
				details: {
					projectName: '',
					technology: '',
					category: '',
					price: '',
					experienceLevel: '',
					estimatedDays: '',
					projectAbstract: '',
					projectDesc: '',
					createdAt: ''
				}
			}
		}
		this.ApplyProject = this.ApplyProject.bind(this);
		this.backClick = this.backClick.bind(this);

	}
	componentWillMount() {
		const user = this.state.params
		user['userId'] = crypt.decrypt(cookies.get('UserID'))
		user['token'] = crypt.decrypt(cookies.get('token'))
		this.setState({user})
				AuthLayer.getProfileDetails(this.state.params)
				.then(response => {
						if (response.data.success){
						 cookies.set('name', crypt.encrypt(response.data.data.profile.name), { path: '/' });
						 cookies.set('devid', crypt.encrypt(response.data.data.profile.id), { path: '/' });
						 this.ProjectDesc();
						}
						else {
						 if (response.data.error == "API session expired, Please login again!") {
							 this.context.router.push('/logout');
						 }
							}
				})

		}
		ProjectDesc() {
			const user = this.state.params
			user['projectId'] = crypt.decrypt(cookies.get('project_id'))
			this.setState({user})
					AuthLayer.PostedProjectDesc(this.state.params)
					.then(response => {
							if (response.data.success){
								const user1 = this.state.params.details
								user1['projectName'] = response.data.data.projectName
								user1['technology'] = response.data.data.technology
								user1['category'] = response.data.data.category
								user1['price'] = response.data.data.price
								user1['experienceLevel'] = response.data.data.experienceLevel
								user1['estimatedDays'] = response.data.data.estimatedDays
								user1['projectAbstract'] = response.data.data.projectAbstract
								user1['projectDesc'] = response.data.data.projectDesc
								var todaysDate = moment(new Date());
								user1['createdAt'] = todaysDate.diff(moment(response.data.data.createdAt), 'days')
								this.setState({user1})
							} else {
								//alert(JSON.stringify(response.data))
								}
					})
		}
		ApplyProject() {
			ModalStore.setDisplayed('apply', true)

		}
		backClick() {
			this.context.router.push('/dashboard/findprojects')
		}
	render(){

		return(


				<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
					<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
						<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 30px'}}>Apply Project</label>
					</div>
									<div className={styles.well} style={{margin:'50px 50px 350px 50px'}}>
										<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
											<h4>{this.state.params.details.projectName}</h4>

											<div className="row" style={{padding:'5px 15px'}}>
												<div className="col-md-3 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-6 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Created Date:</span></div>
														<div className="col-md-6 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.details.createdAt} Days Ago</span></div>
													</div>
												</div>
												<div className="col-md-3">
													<div className="row">
														<div className="col-md-5 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Experience:</span></div>
														<div className="col-md-7 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.details.experienceLevel}</span></div>
													</div>
												</div>
												<div className="col-md-3">
													<div className="row">
														<div className="col-md-4 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Est.Time:</span></div>
														<div className="col-md-8 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.details.estimatedDays} days</span></div>
													</div>
												</div>
												<div className="col-md-3">
													<div className="row">
														<div className="col-md-3 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Cost:</span></div>
														<div className="col-md-9 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.details.price} HUR</span></div>
													</div>
												</div>
											</div>

											<div className="row" style={{padding:'5px 15px'}}>
												<div className="col-md-12 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-12 col-sm-12 col-xs-12 text-left" style={{paddingLeft:'15px'}}><span className={styles.labelname}>Abstract:</span></div>
													</div>
													<div className="row">
														<div className="col-md-12 col-sm-12 col-xs-12 text-left" style={{paddingLeft:'15px'}}><span className={styles.labeldesc}>{this.state.params.details.projectAbstract}</span></div>
													</div>
												</div>
											</div>

											<div className="row" style={{padding:'5px 15px'}}>
												<div className="col-md-12 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-12 col-sm-12 col-xs-12 text-left" style={{paddingLeft:'15px'}}><span className={styles.labelname}>Overview:</span></div>
													</div>
													<div className="row">
														<div className="col-md-12 col-sm-12 col-xs-12 text-left" style={{paddingLeft:'15px'}}><span className={styles.labeldesc}>{this.state.params.details.projectDesc}</span></div>
													</div>
												</div>
											</div>
											<div className="row" style={{padding:'5px 15px'}}>
												<div className="col-md-6 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-3 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Categories:</span></div>
														<div className="col-md-9 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.details.category}</span></div>
													</div>
												</div>
												<div className="col-md-3 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-5 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Technology:</span></div>
														<div className="col-md-7 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.details.technology}</span></div>
													</div>
												</div>
												<div className="col-md-3 col-sm-12 col-xs-12">
													<div className="row">
														<div className="col-md-5 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Attachments:</span></div>
														<div className="col-md-7 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}><a style={{color: '#333333'}} href="#">Download</a></span></div>
													</div>
												</div>
											</div>
											<div className="row" style={{padding:'10px 15px'}}>
												<div className="col-md-12 text-right">
													<button type="button" className="btn btn-primary btn-md" style={{color:'#14317f',backgroundColor: '#ffffff',marginRight:'10px'}} onClick={this.ApplyProject}><span className="glyphicon glyphicon glyphicon-ok"></span>Apply </button>
													<button type="button" className="btn btn-primary btn-md" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}} onClick={this.backClick}><span className="glyphicon glyphicon-arrow-left"></span>Back</button>
												</div>
											</div>

										</div>
									</div>
									<ApplyPopup/>
								</div>


		)
	}
}
ApplyProject.contextTypes = {
    router: PropTypes.object.isRequired
}
export default ApplyProject
