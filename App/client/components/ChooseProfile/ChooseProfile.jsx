import React from 'react'
import styles from './ChooseProfile.css'
import PropTypes from 'prop-types'
import UserStore from './../../stores/UserStore'

//const ChooseProfile = () => {
class ChooseProfile extends React.Component {
	constructor(props) {
			super(props)

		}
		componentWillMount() {
			if (localStorage.getItem('account_type') == "developer") {
				this.context.router.push('/dashboard/developerviewprofile')
				 //window.location = '/dashboard/developerviewprofile'
			}
			else if (localStorage.getItem('account_type') == "client"){
				this.context.router.push('/dashboard/clientviewprofile')
			}
			else {
				UserStore.setProfilePhoto("https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png")
				localStorage.setItem('ProfilePhoto', "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png")
				this.context.router.push('/dashboard')
			}
		}

	render() {
	return(

			<div className="row" style={{padding:'10% 20%', backgroundColor:'#e2e2e2', flex:'1', minHeight:'91vh'}}>
				<div className={styles.well}>
				<h3 className="text-center" style={{padding:'50px 30px 10px 10px', color:'#fff'}}> Choose Profile which profile you want create</h3>
					<div className="row" style={{margin:'0px auto',padding:'50px'}}>
						<div className="col-md-6">
							<a href='/dashboard/clientprofileupdate' style={{ textDecoration:"none" }}><button type="button" className="btn btn-primary btn-lg btn-block" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}}><span className="glyphicon glyphicon-user"></span>Client</button></a>
						</div>
						<div className="col-md-6">
							<a href='dashboard/developerprofileupdate' style={{ textDecoration:"none" }}><button type="button" className="btn btn-primary btn-lg btn-block" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}}><span className="glyphicon glyphicon-user"></span>Developer</button></a>
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
