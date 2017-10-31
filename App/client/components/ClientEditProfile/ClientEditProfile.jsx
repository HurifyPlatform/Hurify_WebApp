import React from 'react'
import Imageupload from './../../components/Imageupload/Imageupload'
import styles from './ClientEditProfile.css'
import $ from "jquery";
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'



class ClientEditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            params: {
                token: '',
                user: {
                    token: '',
                    userId: '',
                    name: '',
                    languages: '',
                    userDesc: ''
                }
            }
        }
        this.changeUser = this.changeUser.bind(this);
        this.updatingProfile = this.updatingProfile.bind(this);
    }

    componentWillMount() {
        const user = this.state.params.user
        user['userId'] = localStorage.getItem('UserID')
        user['token'] = localStorage.getItem('token')
        user['email'] = localStorage.getItem('email')
        this.setState({
            user
        })
        console.log(this.state.params.user);

        AuthLayer.getProfileDetails(this.state.params.user).then(response => {
            if (response.data.success) {
                const user = this.state.params.user
                user['country'] = response.data.data.profile.country
                user['name'] = response.data.data.profile.name
                user['languages'] = response.data.data.profile.languages
                user['userDesc'] = response.data.data.profile.userDesc
                this.setState({
                    user
                })
            } else {
                alert("Can't get the details, refresh the page and try again")
            }
        })
    }

    updatingProfile(event) {
        if ((!this.state.params.user.name.length) || (!this.state.params.user.languages.length) || (!this.state.params.user.userDesc.length)) {
            alert('All details are mandatory, Please enter every detail')

        } else {
            event.preventDefault();
            const user = this.state.params.user
            user['userId'] = localStorage.getItem('UserID')
            this.setState({
                user
            })
            const params = this.state.params
            params['token'] = localStorage.getItem('token')
            this.setState({
                params
            })
            AuthLayer.editProfile(this.state.params).then(response => {
                if (response.data.success) {
                    alert("Profile updated successfully!")
                    this.setState({
                        status: response.status,
                        message: response.data.message,
                        errors: response.data.errors,

                    })
                    UserStore.setName(this.state.params.user.name)
                    localStorage.setItem('name', this.state.params.user.name)
                    this.context.router.push('/dashboard/clientviewprofile')
                } else {
                    alert(JSON.stringify(response.data.error))
                }
            })
        }
    }

    changeUser(event) {
        console.log(event.target.name);
        const field = event.target.name
        const user = this.state.user
        user[field] = event.target.value
        this.setState({
            user
        })
        console.log(this.state.user);
    }

render() {
	return(
		<div className="row" style={{padding:'100px 50px 50px 50px', backgroundColor:'#e2e2e2', flex:'1', minHeight:'91vh'}}>
			<div className={styles.well}>
				<div className="row" style={{margin:'0px',backgroundColor:'#337ab7'}}>
					<div className="col-md-3" style={{minHeight:'300px', backgroundColor:'#337ab7', borderRadius:'3px'}}>
						<div className="row text-center" style={{padding:'50px 30px'}}>
							<Imageupload />
						</div>
					</div>
					<div className="col-md-9">
						<h3 className="text-center" style={{color:'#ffffff'}}></h3>
							<div className="row">
								<div className="col-sm-6">
									<div className="form-group">
											<label htmlFor="email" className={styles.fieldname}>Email Address<span className="kv-reqd">*</span></label>
											<input type="email" className="form-control" name="email" placeholder={this.state.params.user.email} readOnly/>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="form-group">
											<label htmlFor="fullName" className={styles.fieldname}>Name<span className="kv-reqd">*</span></label>
											<input type="text" className="form-control"  name="name" value={this.state.params.user.name} onChange={this.changeUser} required />
									</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
										<div className="form-group">
										<label htmlFor="sel1" className={styles.fieldname}>Country<span className="kv-reqd">*</span></label>
										<input type="text" className="form-control" name="country" placeholder={this.state.params.user.country} onChange={this.changeUser} readOnly />
									</div>
								</div>
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Languages Known<span className="kv-reqd">*</span></label>
												<input type="text" className="form-control" name="languages" value={this.state.params.user.languages} onChange={this.changeUser} required />
										</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
										<div className="form-group">
											<label htmlFor="comment" className={styles.fieldname}>Profile Description<span className="kv-reqd">*</span></label>
											<textarea className="form-control" rows="2" id="comment" name="userDesc" style = {{resize: 'vertical'}} value={this.state.params.user.userDesc} onChange={this.changeUser}></textarea>
									</div>
								</div>
							</div>

							<div className="row" style={{padding:'15px 15px'}}>
								<div className="text-right">
									<button type="button" className="btn btn-primary btn-md" onClick={this.updatingProfile} style={{color:'#ffffff',backgroundColor: '#4FC3F7'}}><span className="glyphicon glyphicon-hand-up"></span> Submit</button>
								</div>
							</div>
					</div>
				</div>
			</div>
		</div>
		)
	}
}

ClientEditProfile.contextTypes = {
    router: PropTypes.object.isRequired
}

export default ClientEditProfile
