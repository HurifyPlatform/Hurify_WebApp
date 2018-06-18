import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './SuccessPopup.css'
import PropTypes from 'prop-types'



class SuccessPopup extends React.Component{
	constructor(props){
		super(props)
		this.state = {
      		user: {

	        	email: ''

      		}
    	}
	}


	componentWillMount() {
		setTimeout(function() { this.context.router.push('/dashboard/appliedprojects')
 }.bind(this), 3000);
	}


	render(){

		return(

<div className={resendStyles.formContainer}>
				<form>

					<div className={resendStyles.content}>

							<h2 className={resendStyles.formHeading}>Successfully Applied</h2>
							<img src={require('./successMark.png')} />

				 </div>
				</form>

			</div>

		);

	}
}

SuccessPopup.contextTypes = {

    router: PropTypes.object.isRequired

}

export default SuccessPopup;
