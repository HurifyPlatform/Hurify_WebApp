import React from 'react'
import { observer } from 'mobx-react'
import { browserHistory } from 'react-router'
import ModalStore from './../../../stores/ModalStore'
import AuthLayer from './../../../network/AuthLayer'
import resendStyles from './ReasonOfCancellation.css'
import { RingLoader } from 'react-spinners';

@observer
class ReasonOfCancellation extends React.Component{
	constructor(props){
		super(props)
		this.state = {
				walletAddress:"",
				reason:'',
				indicatorDisplay:'none'
    	}
		this.SubmitCancellation = this.SubmitCancellation.bind(this);
		this.changesUser = this.changesUser.bind(this);
	}
	hide(e) {

		 e.preventDefault()
		ModalStore.setDisplayed('reason', false)
	}

	SubmitCancellation(event)
	{
		event.preventDefault();
		this.setState({
			indicatorDisplay:'block'
		})
		const data = {
	    token:localStorage.getItem('token'),
	    orderId:localStorage.getItem('cancelOrderId'),
	    reason:this.state.reason,
	    walletAddress:this.state.walletAddress
	  }
	  console.log("data", data);
	  AuthLayer.cancelPlacedOrder(data)
	  .then(response => {
	    // alert(JSON.stringify(response.data));
	    console.log(JSON.stringify(response.data));
	      if (response.data.success){
					this.setState({
						indicatorDisplay:'none'
					})
					alert("Your order cancelled successfully")
					ModalStore.setDisplayed('reason', false)
					browserHistory.push('/home')
	      }
				else {
					this.setState({
						indicatorDisplay:'none'
					})
					alert(JSON.stringify(response.data.error))
				}
	  })

	}
	changesUser(event) {
			const field = event.target.name
			const user = this.state
			user[field] = event.target.value
			this.setState({user})
		}
	render(){
		return(
			<div className={"formContainer" + (ModalStore.modalDisplayed['reason'] == false ? (' ' + "close") : '')}>
				<form action='/' onSubmit={this.SubmitCancellation}>
					<a onClick={this.hide} href="#close" title="Close" className="closeButton">X</a>
					<div className="content">
							<input type="text" className="inputField" name="walletAddress" placeholder="Wallet Address" onChange={this.changesUser} required/>
							<textarea className="form-control" rows="5" id="comment" name="reason" placeholder="Reason for cancellation" onChange={this.changesUser} required></textarea>
							<input type="submit" className="btn" id="btn" disabled={this.state.value1} value="Submit"/>
				 		</div>
			  </form>
				<div className="indicator" style={{display:this.state.indicatorDisplay}}>
    				<div className="RingLoader">
    				<div style={{paddingLeft:'40%', textAlign:'center'}}>
    					<RingLoader
    						color={'#fff'}
    						loading= {this.state.loading}
    					/>
    				</div>
    					<p style={{color:'#fff', marginTop:'30px',fontSize: '20px', textAlign: 'center',marginBottom: '0px'}}>Please wait for few seconds</p>
    				</div>
    			</div>
			</div>
		);
	}
}


export default ReasonOfCancellation;
