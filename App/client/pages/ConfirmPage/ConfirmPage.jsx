import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import style from './ConfirmPage.css'
import AuthLayer from './../../network/AuthLayer'
import ModalStore from './../../stores/ModalStore'


class ConfirmPage extends React.Component{


	constructor(props){
		super(props)
		this.state = {
      		user: {
	        	token: '',
						message: '',
						image: ''
      		}
    	}


	}
  componentWillMount() {

		console.log(this.props.params.token);
		const user = this.state.user
		user['token'] = this.props.params.token;
		this.setState({user})
		AuthLayer.confirmEmail(this.state.user)
		.then(response => {

				if (response.data.success){
					//alert(JSON.stringify(response.data.data))
					let user = this.state.user
					user['message'] = "Successfully verified your account!"
					user['image'] = require('./Animation2.gif')
					this.setState({user})
				setTimeout(function() { this.context.router.push('/') }.bind(this), 3000);
				} else {
					let user = this.state.user
					user['message'] = response.data.error
					//user['image'] = require('./Animation2.gif')
					this.setState({user})
					setTimeout(function() { this.context.router.push('/') }.bind(this), 3000);
					//alert(JSON.stringify(response.data.error))
					}
		})

  }

	render(){
		return(
						<div className="container-fluid" style={{backgroundColor:'#01172A', minHeight:'100vh'}}>

							<div className="container">
								<div className="row">
									<div className={style.centered}><h1>{this.state.user.message}</h1></div>
									<div className="span4">
										<img className="center-block" style={{display:'block',marginLeft: 'auto', marginRight: 'auto', width:'40%',marginTop:'5%'}}src={this.state.user.image} />
								</div>
									<div className="span4"></div>
								</div>
							</div>
						</div>

					)
			}

			}
ConfirmPage.contextTypes = {
    router: PropTypes.object.isRequired
}
export default ConfirmPage;
