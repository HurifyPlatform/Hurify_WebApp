import React from 'react'
import styles from './ClientViewProfile.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'


class ClientViewProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                token: '',
                userId: '',
                email: '',
                country: '',
                name: '',
                languages: '',
                jobTitle: '',
                salaryPerHour: '',
                categories: '',
                skills: '',
                userDesc: '',
                profilePhotoPath: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
            }
        }
        this.editProfileDetails = this.editProfileDetails.bind(this);
    }
    componentWillMount() {

        const user = this.state.user
        user['userId'] = localStorage.getItem('UserID')
        user['token'] = localStorage.getItem('token')
        this.setState({
            user
        })

        AuthLayer.getProfileDetails(this.state.user)
            .then(response => {
                if (response.data.success) {
                    const user = this.state.user
                    user['email'] = response.data.data.user.email
                    user['country'] = response.data.data.profile.country
                    user['name'] = response.data.data.profile.name
                    user['languages'] = response.data.data.profile.languages
                    user['jobTitle'] = response.data.data.profile.jobTitle
                    user['salaryPerHour'] = response.data.data.profile.salaryPerHour
                    user['categories'] = response.data.data.profile.categories
                    user['skills'] = response.data.data.profile.skills
                    user['userDesc'] = response.data.data.profile.userDesc
                    if (response.data.data.user.profilePhotoPath != null) {
                        user['profilePhotoPath'] = response.data.data.user.profilePhotoPath
                    this.setState({
                        user
                    })
                    UserStore.setProfilePhoto(response.data.data.user.profilePhotoPath)
                    localStorage.setItem('ProfilePhoto', response.data.data.user.profilePhotoPath)
                  }
                  else {
                    UserStore.setProfilePhoto("https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png")
                    localStorage.setItem('ProfilePhoto', "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png")
                  }
                  //  UserStore.setProfilePhoto(response.data.data.user.profilePhotoPath)
                  //  localStorage.setItem('ProfilePhoto', response.data.data.user.profilePhotoPath)
                    UserStore.setName(response.data.data.profile.name)
                    localStorage.setItem('name', response.data.data.profile.name)
                    UserStore.setClientid(response.data.data.profile.id)
                    localStorage.setItem('client_id', response.data.data.profile.id)
                } else {
                    alert(JSON.stringify(response.data))
                }
            })
    }


    editProfileDetails(event) {
        if (localStorage.getItem('account_type') == "client") {
            this.context.router.push('/dashboard/clienteditprofile')
        } else {
            this.context.router.push('/dashboard/developereditprofile')
        }

    }

render(){
	return(
			<div className="row" style={{padding:'100px 50px 50px 50px', backgroundColor:'#e2e2e2', flex:'1', minHeight:'91vh'}}>
				<div className={styles.well}>
					<div className="row" style={{margin:'0px'}}>
						<div className="col-md-3" style={{minHeight:'230px', backgroundColor:'#337ab7', borderRadius:'3px'}}>
							<div className="row text-center" style={{padding:'50px 30px'}}>
								<img src={this.state.user.profilePhotoPath} name="aboutme" width="120" height="120" className="img-circle" />
								<h4 style={{color:'#fff', paddingTop:'10px', fontSize:'1.2em'}}>{this.state.user.name}</h4>
							</div>
						</div>
						<div className="col-md-9" style={{backgroundColor:'#222d32'}}>
							<h3 className="text-center" style={{color:'#4FC3F7'}}></h3>
								<div className="row" style={{padding:'15px 5px'}}>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Name</span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.name}</span></div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Email</span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.email}</span></div>
										</div>
									</div>
								</div>
								<div className="row" style={{padding:'15px 5px'}}>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Country </span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.country}</span></div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Languages Known </span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.languages}</span></div>
										</div>
									</div>
								</div>
								<div className="row" style={{padding:'15px 5px'}}>
									<div className="col-md-3 "><span className={styles.fieldname}>Profile Description:</span></div>

								</div>
								<div className="row" style={{padding:'0px 5px'}}>

									<div className="col-md-12 text-left"><span className={styles.fieldvalue}>{this.state.user.userDesc}</span></div>
								</div>
								<div className="row" style={{padding:'10px 15px'}}>
									<div className="text-right">
										<button type="button" className="btn btn-primary btn-md" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}} onClick={this.editProfileDetails}><span className="glyphicon glyphicon-pencil"></span> Edit</button>
									</div>
								</div>
						</div>
					</div>
				</div>
			</div>
		)
}
}
ClientViewProfile.contextTypes = {
    router: PropTypes.object.isRequired
}
export default ClientViewProfile
