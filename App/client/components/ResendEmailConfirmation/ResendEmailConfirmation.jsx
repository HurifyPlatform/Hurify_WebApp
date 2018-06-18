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
      		},
					value:false
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
		this.setState({
			value:true
		})
		event.preventDefault();
		if (!this.state.user.emailId.length) {
			this.setState({
				value:false
			})
			alert('email is required, Please enter')
		}
		else {
			console.log(this.state.user);
	    	AuthLayer.attemptResendVerification(this.state.user)
	    	.then(response => {
	      	if (response.data.success){
	      		alert(JSON.stringify(response.data.data))
						this.setState({
							value:false
						})
					this.hide();
	      } else {
					this.setState({
						value:false
					})
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
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['confirm'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.resendClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>Resend Verification</h2>
							<input className={resendStyles.inputField} type="email" placeholder="Email" name="emailId" value={this.state.email} onChange={this.changeUser} onClick={this.onclick} required/>
							<input type="submit" className="btn btn-primary btn-md" style={{marginTop:'25px',backgroundColor:'#2979FF'}} disabled={this.state.value} value="Resend"></input>
				 </div>
			  </form>
			</div>
		);
	}
}


export default ResendEmailConfirmation;
