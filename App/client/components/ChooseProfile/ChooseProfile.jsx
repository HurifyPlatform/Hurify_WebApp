import React from 'react'
import styles from './ChooseProfile.css'
import PropTypes from 'prop-types'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
import AuthLayer from './../../network/AuthLayer'
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class ChooseProfile extends React.Component {
	constructor(props) {
			super(props)
				this.state = {
					params: {
					token: '',
					userId: '',
					userAccountType: ''
				}
		}
	}
		componentWillMount() {
			if ((crypt.decrypt(cookies.get('token')) == null) || (crypt.decrypt(cookies.get('token')) == "")) {
				this.context.router.push('/')
			}
			else {
					if (crypt.decrypt(cookies.get('account_type')) == "client") {
						this.context.router.push('/dashboard/clientprofileupdate')
          }
					else if (crypt.decrypt(cookies.get('account_type')) == "developer"){
						this.context.router.push("/dashboard/developerprofileupdate")
					}
					else {
						this.context.router.push("/dashboard/chooseprofile")
					}
				}
		}
AccountType(accType) {
	this.state.params.token = crypt.decrypt(cookies.get('token'))
	this.state.params.userId = crypt.decrypt(cookies.get('UserID'))
	this.state.params.userAccountType = accType
		AuthLayer.UpdateUserAccountType(this.state.params)
		.then(response => {
			(JSON.stringify(response.data))
				if (response.data.success){

					cookies.set('account_type', crypt.encrypt(accType), { path: '/' });
					if (accType == "client") {
						this.context.router.push("/dashboard/clientprofileupdate")
					}
					if (accType == "developer") {
						this.context.router.push("/dashboard/developerprofileupdate")
					}
					// this.context.router.push("/dashboard/tokensale")

				} else {
					alert(JSON.stringify(response.data))

				}
		})
}
	render() {
	return(

			<div className="row" style={{padding:'10% 20%', backgroundColor:'#d7e1eb', flex:'1', minHeight:'91vh'}}>
							<div className={styles.well}>
							<h3 className="text-center" style={{padding:'50px 30px 10px 10px', color:'#ffffff'}}> Which profile you want to create?</h3>
								<div className="row" style={{margin:'0px auto',padding:'50px'}}>
									<div className="col-md-6 text-center">
										<button type="button" className="btn btn-primary btn-lg btn-block" style={{color:'#ffffff',backgroundColor: 'transparent', border:'none'}} onClick={() => this.AccountType("client")}><img src={require('./group.png')} style={{ width:"120px"}}/></button>
										<span style={{fontSize:'1.6em', fontWeight:'500', color:'#ffffff'}}>Client</span>
									</div>
									<div className="col-md-6 text-center">
										<button type="button" className="btn btn-primary btn-lg btn-block" style={{color:'#ffffff',backgroundColor: 'transparent', border:'none'}} onClick={() => this.AccountType("developer")}><img src={require('./user1.png')} style={{ width:"120px"}}/></button>
										<span style={{fontSize:'1.6em', fontWeight:'500', color:'#ffffff'}}>Developer</span>
									</div>
								</div>
							</div>
						</div>

		)
}
}
ChooseProfile.contextTypes = {
    router: PropTypes.object.isRequired
}
export default ChooseProfile
