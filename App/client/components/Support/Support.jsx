import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './Support.css'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')
const cookies = new Cookies();

@observer
class Support extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			params: {
				email:'',
				subject:'',
				query:''
			},
			value:false
    	}
		this.SubmitQuery = this.SubmitQuery.bind(this);
		this.changesUser = this.changesUser.bind(this);
	}
	hide(e) {

		 e.preventDefault()
		ModalStore.setDisplayed('support', false)
	}

	SubmitQuery(event)
	{
		this.setState({
			value:true
		})
		event.preventDefault();
		AuthLayer.SubmitQueryBeforeLogin(this.state.params)
		.then(response => {
			if (response.data.success){
				alert("Your query is submitted successfully, we will get back to you at the earliest. ")
				const params = this.state.params
				params["email"] = ""
				params["subject"] = ""
				params["query"] = ""
				this.setState({params})
				this.setState({
					value:false
				})
				ModalStore.setDisplayed('support', false)
		} else {
			this.setState({
				value:false
			})
			alert(JSON.stringify(response.data.error))
		}
		})
	}
	changesUser(event) {
			const field = event.target.name
			const user = this.state.params
			user[field] = event.target.value
			this.setState({user})
		}
	render(){
		return(
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['support'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.SubmitQuery}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>Support</h2>
							<input type="email" className={resendStyles.inputField} name="email" placeholder="Email" value={this.state.params.email} onChange={this.changesUser} required/>
							<textarea className="form-control" rows="2" name="subject" placeholder="Query" id="comment" value={this.state.params.subject} onChange={this.changesUser} required></textarea>
							<textarea className="form-control" rows="5" id="comment" name="query" placeholder="Subject" value={this.state.params.query} onChange={this.changesUser} required></textarea>
							<input type="submit" className="btn btn-primary btn-md" id={resendStyles.btn} disabled={this.state.value} value="Submit"/>
				 		</div>
			  </form>
			</div>
		);
	}
}


export default Support;
