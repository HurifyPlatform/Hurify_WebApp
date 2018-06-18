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
      		},
					valu:false
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
		this.setState({
			value:true
		})
		event.preventDefault();
		if (!this.state.user.email.length) {
			this.setState({
				value:false
			})
			alert('email is required, Please enter')
		}
		else {
	  	AuthLayer.forgotPassword(this.state.user)
		.then(response => {
	      	if (response.data.success){
	      		alert("We have sent you the code, Please check your mail")
						this.setState({
							value:false
						})
		   ModalStore.setDisplayed('newpass', true)

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
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['forgot'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.forgotClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>Forgot Password</h2>
							<input className={resendStyles.inputField} type="email" placeholder="Email" name="email" value={this.state.email} onChange={this.changeUser} onClick={this.onclick} required/>
							<input type="submit" className="btn btn-primary btn-md" style={{marginTop:'25px',backgroundColor:'#2979FF'}} disabled={this.state.value} value="Send"></input>
				 </div>

			  </form>
			</div>
		);
	}
}


export default ForgotPassword;
