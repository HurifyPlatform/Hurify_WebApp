import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './HURAmount.css'
import SubmitSuccessPopup from './SubmitSuccessPopup'
import PropTypes from 'prop-types'

@observer
class HURAmount extends React.Component{
	constructor(props){
		super(props)
		this.state = {
      		user: {
	        	email: ''
      		}
    	}
		this.yesClick = this.yesClick.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}
	hide(e) {
		if (e) e.preventDefault()
		ModalStore.setDisplayed('HUR_amount', false)
	}
	yesClick(event)
	{
		this.context.router.push('/dashboard/hursuccess')
	}
	changeUser(event) {
			const field = event.target.name
			const user = this.state.user
			user[field] = event.target.value
			this.setState({user})
		}
	render(){
		return(
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['HUR_amount'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.yesClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<label className={resendStyles.labelField}>You have 700 HUR tokens, Do you want to submit this project?</label>
							<a className={resendStyles.nobtn} href="#" onClick = {function(e) { e.preventDefault(); ModalStore.setDisplayed('HUR_amount', false)}} >No</a>
							<a className={resendStyles.yesbtn} href="#success" onClick = {this.yesClick} >Yes</a>
				 </div>
			  </form>
			</div>
		);
	}
}

HURAmount.contextTypes = {
    router: PropTypes.object.isRequired
}
export default HURAmount;
