import React from 'react'
import styles from './SupportForm.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')
const cookies = new Cookies();



class SupportForm extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token:'',
				email:'',
				subject:'',
				query:''
			},
			popupDisplay:'none',
			value:false
		}
			this.SubmitQuery = this.SubmitQuery.bind(this);
			this.changesUser = this.changesUser.bind(this);
		}
	componentWillMount() {
		const user = this.state.params
		user['token'] = crypt.decrypt(cookies.get('token'))
		user['email'] = crypt.decrypt(cookies.get('email'))
		this.setState({user})
	}
	SubmitQuery(event) {
		this.setState({
			value:true
		})
		event.preventDefault();
		AuthLayer.SubmitQueryAfterLogin(this.state.params)
		.then(response => {
			if (response.data.success){
				// alert(JSON.stringify(response.data))
				this.setState({
					popupDisplay:'block'
				})
				setTimeout(function() {
					this.setState({
						popupDisplay:'none',
						value:false
					})
					const user = this.state.params
					user['subject'] = ""
					user['query'] = ""
					this.setState({user})
				}.bind(this), 6000);
		} else {
			this.setState({
				value:false
			})
			alert(JSON.stringify(response.data.error))
		}
		})
	}
	changesUser(event){
		const field = event.target.name
		const user = this.state.params
		user[field] = event.target.value
		this.setState({user})
	}
	render(){
		return(
				<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'90vh'}}>
					<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
						<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Support</label>
					</div>
					<div className={styles.well} style={{margin:'50px 150px 150px 180px'}}>
						<div className="row" style={{margin:'10px 50px',padding:'20px 25px'}}>
							<h3 className="text-center" style={{color:'#000'}}>Support Form</h3>
							<form onSubmit={this.SubmitQuery}>
							<div className="row">
								<div className="col-md-12">
									<div className="form-group">
										<label for="projectName" className={styles.fieldname}>Email<span className="kv-reqd">*</span></label>
										<input type="email" className="form-control" name="email" value={this.state.params.email} readOnly />
									</div>
								</div>
								<div className="col-md-12">
									<div className="form-group">
  										<label for="comment" className={styles.fieldname}>Subject<span className="kv-reqd">*</span></label>
  										<textarea className="form-control" rows="2" name="subject" id="comment" value={this.state.params.subject} onChange={this.changesUser} required></textarea>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
									<div className="form-group">
	  									<label for="comment" className={styles.fieldname}>Query<span className="kv-reqd">*</span></label>
	  									<textarea className="form-control" rows="5" id="comment" name="query" value={this.state.params.query} onChange={this.changesUser} required></textarea>
									</div>
								</div>
							</div>
							<div className="row" style={{padding:'15px 15px'}}>
								<div className="text-center">
								<input type="Submit" className="btn btn-primary btn-md" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}} disabled={this.state.value} value="Submit"></input>
								</div>
							</div>
						</form>
						</div>
					</div>
					<div className={styles.indicator} style={{display:this.state.popupDisplay}}>
						<div className={styles.RingLoader}>
							<p style={{color:'#fff', marginTop:'30px',fontSize: '20px', textAlign: 'center',marginBottom: '20px'}}>Your query is submitted successfully, we will get back to you at the earliest. </p>
						</div>
					</div>
				</div>
			)
	}
}

SupportForm.contextTypes = {
    router: PropTypes.object.isRequired
}
export default SupportForm
