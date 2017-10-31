import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './ResendEmailConfirmation.css'

@observer
class ResendEmailConfirmation extends React.Component{
	constructor(props){
		super(props)
		this.state = {
      		user: {
	        	emailId: ''
      		}
    	}
		this.resendClick = this.resendClick.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}
	hide(e) {
		if (e) e.preventDefault()
		ModalStore.setDisplayed('confirm', false)
	}
	resendClick(event)
	{
		event.preventDefault();
		if (!this.state.user.emailId.length) {
			alert('email is required, Please enter')
		}
		else {
			console.log(this.state.user);
	    	AuthLayer.attemptResendVerification(this.state.user)
	    	.then(response => {
					//alert(JSON.stringify(response.data))
	      	if (response.data.success){
	      		alert(JSON.stringify(response.data.data))
	        	this.setState({
	          	status: response.status,
	          	message: response.data.message,
	          	errors: response.data.errors
	        })
					this.hide();
	      } else {
	        alert(JSON.stringify(response.data.error))

	      }
	    })
	  	}

	}
	changeUser(event) {
		console.log(event.target.value)
			const field = event.target.name
			const user = this.state.user
			user[field] = event.target.value
			this.setState({user})
		}
	render(){
		return(
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['confirm'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.resendClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>Resend Verification</h2>
							<input className={resendStyles.inputField} type="email" placeholder="Email" name="emailId" value={this.state.email} onChange={this.changeUser} onClick={this.onclick} />
							<a className={resendStyles.btn} href="#" onClick = {this.resendClick} style={{textDecoration:'none'}}>Resend</a>
				 </div>
			  </form>
			</div>
		);
	}
}


export default ResendEmailConfirmation;
