import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './ForgotPassword.css'

@observer
class ForgotPassword extends React.Component{
	constructor(props){
		super(props)
		this.state = {
      		user: {
	        	email: ''
      		}
    	}
		this.forgotClick = this.forgotClick.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}
	hide(e) {
		if (e) e.preventDefault()
		ModalStore.setDisplayed('forgot', false)
	}
	forgotClick(event)
	{

		console.log("yes correct");
		event.preventDefault();
		if (!this.state.user.email.length) {
			alert('email is required, Please enter')
		}
		else {
	  	AuthLayer.forgotPassword(this.state.user)
		.then(response => {
					//alert(JSON.stringify(response))
	      	if (response.data.success){
	      		alert(JSON.stringify(response.data.data))
	        	this.setState({
	        	status: response.status,
	        	message: response.data.message,
	        	errors: response.data.errors
	        })
		   ModalStore.setDisplayed('newpass', true)

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
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['forgot'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.forgotClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>Forgot Password</h2>
							<input className={resendStyles.inputField} type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.changeUser} onClick={this.onclick} />
							<a className={resendStyles.btn} href="#newpass" onClick = {this.forgotClick} style={{textDecoration:'none'}}>Send</a>
				 </div>

			  </form>
			</div>
		);
	}
}


export default ForgotPassword;
