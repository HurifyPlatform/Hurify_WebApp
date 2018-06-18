import React from 'react'
import Imageupload from './../../components/Imageupload/Imageupload'
import styles from './ClientEditProfile.css'
import $ from "jquery";
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import axios from 'axios'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


const cookies = new Cookies();
class ClientEditProfile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            params: {
                token: '',
                  file: null,
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
        user['userId'] = crypt.decrypt(cookies.get('UserID'))
        user['token'] = crypt.decrypt(cookies.get('token'))
        user['email'] = crypt.decrypt(cookies.get('email'))
        this.setState({
            user
        })
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
            event.preventDefault();
            const user = this.state.params.user
            user['userId'] = crypt.decrypt(cookies.get('UserID'))
            this.setState({
                user
            })

            const request = new FormData();
            var ProjectData = JSON.stringify(this.state.params.user);
            request.append('file', this.state.params.file);
            request.append('token', crypt.decrypt(cookies.get('token')));
            request.append('user', ProjectData);
            axios.post(require('./../../../config').serverAPI + '/apicall/edituserprofile', request).then(result => {
              if(result.data.success) {
                alert("Profile updated successfully!")
                cookies.set('name', crypt.encrypt(this.state.params.user.name), { path: '/' });
                // this.context.router.push('/dashboard/clientviewprofile')
                window.location = "/dashboard/clientviewprofile"
              }
              else {
                alert("Failed to Update Profile, Please Try Again")
              }
            });

    }

    changeUser(event) {
        const field = event.target.name
        const user = this.state.user
        user[field] = event.target.value
        this.setState({
            user
        })
    }

render() {
	return(
		<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'91vh'}}>
      <div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
        <label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Edit Profile</label>
      </div>
    <form onSubmit={this.updatingProfile}>
			<div className={styles.well} style={{margin:'50px 50px 250px 80px'}}>
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
											<textarea className="form-control" rows="2" id="comment" name="userDesc" style = {{resize: 'vertical'}} value={this.state.params.user.userDesc} onChange={this.changeUser} required></textarea>
									</div>
								</div>
							</div>

							<div className="row" style={{padding:'15px 15px'}}>
								<div className="text-right">
									<input type="Submit" className="btn btn-primary btn-md" value="Submit" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}}></input>
								</div>
							</div>
					</div>
				</div>
			</div>
    </form>
		</div>
		)
	}
}

ClientEditProfile.contextTypes = {
    router: PropTypes.object.isRequired
}

export default ClientEditProfile
