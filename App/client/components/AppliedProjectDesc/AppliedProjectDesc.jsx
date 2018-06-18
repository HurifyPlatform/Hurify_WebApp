import React from 'react'
import styles from './AppliedProjectDesc.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import moment from 'moment'
import DatePicker from 'react-bootstrap-date-picker'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class AppliedProjectDesc extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                params: {
                    token: '',
                    projectId: '',
                    user: {
                        projectName: '',
                        technology: '',
                        category: '',
                        price: '',
                        experienceLevel: '',
                        estimatedDays: '',
                        projectAbstract: '',
                        projectDesc: '',
                        createdAt: '',
                        attachmentPath: '',
                        contractAddress: '',
                        AppliedProjects: []
                    },
                    Agreement: {
                        projectId: '',
                        startDate: '',
                        bidValue: '',
                        estimatedDays: '',
                        filePath: ''
                    },
                    project: {
                        developerHURAddress: '',
                        projectId: '',
                        agreementId: ''
                    },
                    display: 'none',
                    status4Display: 'block',
                    escrowDisplay: 'none',
                    conformContractDisplay: 'block',
                    verifyDisplay: 'none',
                    attachmentDisplay: '',
                    paymentDisplay: 'none',
                    web3: null
                }
            }
            this.NegociationAccept = this.NegociationAccept.bind(this);
            this.NegociationReject = this.NegociationReject.bind(this);
            this.ProjectDetails = this.ProjectDetails.bind(this);
            this.tokenBalance = this.tokenBalance.bind(this);
            this.AcceptingContract = this.AcceptingContract.bind(this);
            this.InitiatePayment = this.InitiatePayment.bind(this);
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
                })
            this.ProjectDetails()
        }
        tokenBalance(event) {
            var self = this;
            const contract = require('truffle-contract')
            const hurify = contract(Hurify)
            hurify.setProvider(this.state.web3.currentProvider)
            var hurifyInstance;
            this.state.web3.eth.getAccounts((error, accounts) => {
                const user = self.state.params.project
                user['developerHURAddress'] = accounts[0]
                self.setState({
                    user
                })
            })
        }
        ProjectDetails() {

            this.state.params.display = "none"
            this.state.params.escrowDisplay = 'none'
            this.state.params.conformContractDisplay = 'block'
            const user = this.state.params
            user['projectId'] = crypt.decrypt(cookies.get('project_id'))
            user['token'] = crypt.decrypt(cookies.get('token'))
            this.setState({
                user
            })
            AuthLayer.PostedProjectDesc(this.state.params)
                .then(response => {
                    if (response.data.success) {
                        const user = this.state.params.user
                        user['projectName'] = response.data.data.projectName
                        user['technology'] = response.data.data.technology
                        user['category'] = response.data.data.category
                        user['price'] = response.data.data.price
                        user['experienceLevel'] = response.data.data.experienceLevel
                        user['estimatedDays'] = response.data.data.estimatedDays
                        user['projectAbstract'] = response.data.data.projectAbstract
                        user['projectDesc'] = response.data.data.projectDesc
                        user['AppliedProjects'] = response.data.data.AppliedProjects
                        user['attachmentPath'] = response.data.data.attachmentPath
                        user['contractAddress'] = "https://rinkeby.etherscan.io/address/" + response.data.data.contractAddress
                        var todaysDate = moment(new Date());
                        user['createdAt'] = todaysDate.diff(moment(response.data.data.createdAt), 'days')
                        this.setState({
                            user
                        })
                        this.tokenBalance();
                        if ((response.data.data.attachmentPath == "") || (response.data.data.attachmentPath == null)) {
                            this.state.params.attachmentDisplay = 'none'
                        }
                        if (response.data.data.developerId == crypt.decrypt(cookies.get('devid'))) {
                            if (response.data.data.projectStatusId == 3) {
                                if (response.data.data.approvalFlag == true) {
                                    this.state.params.display = "block"
                                    const Agreement = this.state.params.Agreement
                                    Agreement['projectId'] = response.data.data.Agreement.projectId
                                    Agreement['bidValue'] = response.data.data.Agreement.bidValue
                                    Agreement['estimatedDays'] = response.data.data.Agreement.estimatedDays
                                    Agreement['startDate'] = response.data.data.Agreement.startDate
                                    Agreement['filePath'] = response.data.data.Agreement.filePath
                                    this.setState({
                                        Agreement
                                    })
                                    const user1 = this.state.params.project
                                    user1['projectId'] = crypt.decrypt(cookies.get('project_id'))
                                    user1['agreementId'] = response.data.data.Agreement.id
                                    this.setState({
                                        user1
                                    })
                                }
                            } else if (response.data.data.projectStatusId == 4) {
                                this.state.params.display = "block"
                                this.state.params.status4Display = "none"
                                this.state.params.escrowDisplay = 'block'
                                const Agreement = this.state.params.Agreement
                                Agreement['projectId'] = response.data.data.Agreement.projectId
                                Agreement['bidValue'] = response.data.data.Agreement.bidValue
                                Agreement['estimatedDays'] = response.data.data.Agreement.estimatedDays
                                Agreement['startDate'] = response.data.data.Agreement.startDate
                                Agreement['filePath'] = response.data.data.Agreement.filePath
                                this.setState({
                                    Agreement
                                })
                                const user1 = this.state.params.project
                                user1['projectId'] = crypt.decrypt(cookies.get('project_id'))
                                user1['agreementId'] = response.data.data.Agreement.id
                                this.setState({
                                    user1
                                })
                                if (this.state.params.Agreement.filePath == null) {
                                    this.state.params.escrowDisplay = 'none'
                                }
                                if (response.data.data.contractFlag == true) {
                                    this.state.params.conformContractDisplay = 'none'
                                }
                            } else if (response.data.data.projectStatusId == 5) {
                                this.state.params.display = "block"
                                this.state.params.status4Display = "none"
                                this.state.params.escrowDisplay = 'block'
                                this.state.params.conformContractDisplay = 'none'
                                this.state.params.verifyDisplay = 'block'
                                // this.state.params.paymentDisplay = 'block'
                                const Agreement = this.state.params.Agreement
                                Agreement['projectId'] = response.data.data.Agreement.projectId
                                Agreement['bidValue'] = response.data.data.Agreement.bidValue
                                Agreement['estimatedDays'] = response.data.data.Agreement.estimatedDays
                                Agreement['startDate'] = response.data.data.Agreement.startDate
                                Agreement['filePath'] = response.data.data.Agreement.filePath
                                this.setState({
                                    Agreement
                                })
                                const user1 = this.state.params.project
                                user1['projectId'] = crypt.decrypt(cookies.get('project_id'))
                                user1['agreementId'] = response.data.data.Agreement.id
                                this.setState({
                                    user1
                                })
                              }
                            // } else if (response.data.data.projectStatusId == 6) {
                            //     this.state.params.display = "block"
                            //     this.state.params.status4Display = "none"
                            //     this.state.params.escrowDisplay = 'block'
                            //     this.state.params.conformContractDisplay = 'none'
                            //     this.state.params.verifyDisplay = 'block'
                            //     const Agreement = this.state.params.Agreement
                            //     Agreement['projectId'] = response.data.data.Agreement.projectId
                            //     Agreement['bidValue'] = response.data.data.Agreement.bidValue
                            //     Agreement['estimatedDays'] = response.data.data.Agreement.estimatedDays
                            //     Agreement['startDate'] = response.data.data.Agreement.startDate
                            //     Agreement['filePath'] = response.data.data.Agreement.filePath
                            //     this.setState({
                            //         Agreement
                            //     })
                            //     const user1 = this.state.params.project
                            //     user1['projectId'] = crypt.decrypt(cookies.get('project_id'))
                            //     user1['agreementId'] = response.data.data.Agreement.id
                            //     this.setState({
                            //         user1
                            //     })
                            // } else if (response.data.data.projectStatusId == 7) {
                            //     this.state.params.display = "block"
                            //     this.state.params.status4Display = "none"
                            //     this.state.params.escrowDisplay = 'block'
                            //     this.state.params.conformContractDisplay = 'none'
                            //     this.state.params.verifyDisplay = 'block'
                            //     const Agreement = this.state.params.Agreement
                            //     Agreement['projectId'] = response.data.data.Agreement.projectId
                            //     Agreement['bidValue'] = response.data.data.Agreement.bidValue
                            //     Agreement['estimatedDays'] = response.data.data.Agreement.estimatedDays
                            //     Agreement['startDate'] = response.data.data.Agreement.startDate
                            //     Agreement['filePath'] = response.data.data.Agreement.filePath
                            //     this.setState({
                            //         Agreement
                            //     })
                            //     const user1 = this.state.params.project
                            //     user1['projectId'] = crypt.decrypt(cookies.get('project_id'))
                            //     user1['agreementId'] = response.data.data.Agreement.id
                            //     this.setState({
                            //         user1
                            //     })
                            // }
                        }
                    } else {}
                })
        }

        NegociationAccept() {
            this.tokenBalance();
            const user = this.state.params.project
            user['projectId'] = parseInt(crypt.decrypt(cookies.get('project_id')))
            this.setState({
                user
            })
            AuthLayer.DeveloperAceeptNegociation(this.state.params)
                .then(response => {
                    if (response.data.success) {
                        alert("Accepted Terms and Conditions, Please wait until Client send you the Contract")
                        this.ProjectDetails();
                    } else {
                        alert("Failed to Accept Negotiation, Please Try Again")
                    }
                })
        }

        NegociationReject() {
            AuthLayer.DeveloperRejectNegociation(this.state.params)
                .then(response => {
                    if (response.data.success) {
                        alert("Rejected Terms and Conditions")
                        this.ProjectDetails()
                    } else {
                        alert("Failed to Reject")
                    }
                })
        }

        AcceptingContract() {
            AuthLayer.DeveloperAcceptsContract(this.state.params)
                .then(response => {
                    if (response.data.success) {
                        alert("Contract was accepted")
                        this.ProjectDetails()
                    } else {

                    }
                })
        }

        InitiatePayment(event) {
            event.preventDefault();
            AuthLayer.DeveloperInitiatePayment(this.state.params)
                .then(response => {
                    if (response.data.success) {
                        this.state.params.paymentDisplay = 'none'
                        alert("Successfully Initiated your payment, Wait till client send you the confirmation");
                        this.ProjectDetails();

                    } else {
                        alert(JSON.stringify(response.data))
                    }
                })
        }

	render(){

		return(
			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
        <div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
          <label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Applied Projects Status</label>
        </div>
                <div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
									<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
										<h4>{this.state.params.user.projectName}</h4>
										<div className="row" style={{padding:'10px 15px'}}>
											<div className="col-md-3 col-sm-12 col-xs-12">
												<div className="row">
													<div className="col-md-6 col-sm-6 col-xs-6 text-left"><span className={styles.labelname}>Created Date:</span></div>
													<div className="col-md-6 col-sm-6 col-xs-6 text-left"><span className={styles.labelvalue}>{this.state.params.user.createdAt} Days Ago</span></div>
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
									</div>
								</div>


									<div className={styles.well} style={{display:this.state.params.display,margin:'50px 50px 50px 80px'}}>
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
														<input type="text" className="form-control" name="bidValue" value={this.state.params.project.developerHURAddress} readOnly />
													</div>
												</div>
											</div>

											<div className="row" style={{padding:'15px 15px', display:this.state.params.status4Display}}>
												<div className="text-right">
													<button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px'}} onClick={this.NegociationAccept}><span className="glyphicon glyphicon glyphicon-ok"></span> Accept</button>
													<button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px'}} onClick={this.NegociationReject}><span className="glyphicon glyphicon glyphicon-remove"></span> Reject</button>
												</div>
											</div>
										</div>
									</div>

					<div className={styles.well} style={{display:this.state.params.escrowDisplay,margin:'50px 50px 50px 80px'}}>
						<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
							<div className="col-md-12">
								<h4 style={{textAlign:'center'}}>ESCROW AGREEMENT</h4>
							</div>



							<div className="row" style={{height:'250px',padding:'10px 15px'}}>
								<iframe src={this.state.params.Agreement.filePath} style={{width:'100%', height:'500px', border:'2px solid #000', borderRadius:'5px'}} frameBorder="0"></iframe>

								<div className="row" style={{margin:'10px',padding:'10px 15px 15px 20px'}}>
									<div className="col-md-12 text-right">
										<button type="button" className="btn btn-primary btn-md" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px', display:this.state.params.conformContractDisplay}} onClick={this.AcceptingContract}><span className="fa fa-credit-card"></span>  Confirm Contract</button>
										<p className={styles.verify} style={{display:this.state.params.verifyDisplay}}>Verify your contract in <a href={this.state.params.user.contractAddress} target="_blank">Etherscan.</a></p>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className={styles.well} style={{display:this.state.params.paymentDisplay,margin:'50px 50px 50px 80px'}}>
						<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
						<div className="col-md-12">
							<h4 style={{textAlign:'center'}}>PAYMENT</h4>
						</div>
						<div className="col-md-12" style={{marginTop:'10px'}}>
							<p className={styles.verify}>After Successfull Project Submission, Please initiate invoice</p>
						</div>
						<div className="text-center">
							<button type="button" className="btn btn-primary btn-md" style={{color:'#14317f',backgroundColor: '#ffffff',margin:'0px 5px',marginTop:'10px',marginBottom:'15px'}} onClick={this.InitiatePayment }><span className="glyphicon glyphicon glyphicon-ok"></span> Initiate Pay</button>
						</div>

						</div>
					</div>


			</div>




			)
	}
}
AppliedProjectDesc.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AppliedProjectDesc
