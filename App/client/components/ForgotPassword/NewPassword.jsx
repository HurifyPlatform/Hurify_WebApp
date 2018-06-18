import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './NewPassword.css'

@observer
class NewPassword extends React.Component{
	constructor(props){
		super(props)
		this.state = {
      		user: {
	        	forgotPasswordToken: '',
						password:'',
						retypenewpass:''
      		}
    	}
		this.resetpassClick = this.resetpassClick.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}
	hide(e) {
		if (e) e.preventDefault()
		ModalStore.setDisplayed('newpass', false)
	}
	resetpassClick(event)
	{

		event.preventDefault();
		if ((this.state.userforgotPasswordToken == 0) || (this.state.user.password.length == 0) || (this.state.user.retypenewpass.length == 0)) {
				alert('All fields are require please enter')
		}
		else if (this.state.user.password.length <= 5) {
			alert('Minimum password length should be 6 characters')
		}
		 if (this.state.user.password != this.state.user.retypenewpass) {
				alert('Password and Retype password are not matched')
		}
		else {
	    	AuthLayer.updateForgotPassword(this.state.user)
	    	.then(response => {
	      	if (response.data.success){
	      		alert("Successfully changed password")
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
			const field = event.target.name
			const user = this.state.user
			user[field] = event.target.value
			this.setState({user})
		}
	render(){
		return(
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['newpass'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.forgotClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>New Password</h2>
							<input className={resendStyles.inputField} type="text" placeholder="code" name="forgotPasswordToken" value={this.state.token} onChange={this.changeUser} required/>
							<input className={resendStyles.inputField} type="password" placeholder="New Password" name="password" value={this.state.password} onChange={this.changeUser} required/>
							<input className={resendStyles.inputField} type="password" placeholder="Retype New Password" name="retypenewpass" value={this.state.retypenewpass} onChange={this.changeUser} required/>
							<a className={resendStyles.btn} href="#" onClick = {this.resetpassClick} style={{textDecoration:'none'}}>Submit</a>
				 </div>
			  </form>
			</div>
		);
	}
}


export default NewPassword;
