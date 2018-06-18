import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './SubmitSuccessPopup.css'
import PropTypes from 'prop-types'


class SubmitSuccessPopup extends React.Component{
	constructor(props){
		super(props)
		this.state = {
      		user: {
	        	email: ''
      		}
    	}
	}
	componentWillMount() {

	}
	render(){
		return(
			<div className={resendStyles.formContainer}>
                                <form>
                                        <div className={resendStyles.content}>
                                                        <h2 className={resendStyles.formHeading}>Successfully Applied</h2>
                                                        <img src={require('./source.gif')} />
                                 </div>
                                </form>
                        </div>
		);
	}
}

SubmitSuccessPopup.contextTypes = {
    router: PropTypes.object.isRequired
}

export default SubmitSuccessPopup;
