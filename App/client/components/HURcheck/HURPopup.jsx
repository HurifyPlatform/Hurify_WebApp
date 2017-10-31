import React from 'react'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'
import AuthLayer from './../../network/AuthLayer'
import resendStyles from './HURPopup.css'
//import HURAmount from './HURAmount'

@observer
class HURPopup extends React.Component{
	constructor(props){
		super(props)
		this.state = {


      		user: {
	        	hurAddress: '',
						token: ''
      		}

    	}
		this.HURcheck = this.HURcheck.bind(this);
		this.changeUser = this.changeUser.bind(this);
	}
	hide(e) {
		if (e) e.preventDefault()
		ModalStore.setDisplayed('HUR', false)
	}
	HURcheck(event)
	{

		console.log("yes correct");
		console.log(localStorage.getItem('client_id'));
    event.preventDefault();
    const user1 = this.state.user
    user1["token"] = localStorage.getItem('token')
    this.setState({user1})
    AuthLayer.HURcheck(this.state.user)
    .then(response => {
      alert(JSON.stringify(response.data))
        if (response.data.success){
      //  alert(JSON.stringify(response.data))

        	 ModalStore.setDisplayed('HUR_amount', true)

        } else {
          alert(JSON.stringify(response.data))

          }
    })

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
			<div className={resendStyles.formContainer + (ModalStore.modalDisplayed['HUR'] == false ? (' ' + resendStyles.close) : '')}>
				<form action='/' onSubmit={this.okClick}>
					<a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
					<div className={resendStyles.content}>
							<h2 className={resendStyles.formHeading}>HUR Token</h2>
							<input className={resendStyles.inputField} type="text" placeholder="HUR Address" name="hurAddress" value={this.state.hurAddress} onChange={this.changeUser} />
							<a className={resendStyles.btn} href="#newpass" onClick = {this.HURcheck} >send</a>
				 </div>

			  </form>
			</div>
		);
	}
}


export default HURPopup;
