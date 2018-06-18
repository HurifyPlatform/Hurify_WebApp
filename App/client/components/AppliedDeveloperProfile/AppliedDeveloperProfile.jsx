import React from 'react'
import styles from './AppliedDeveloperProfile.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import ReactStars from 'react-stars'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class AppliedDeveloperProfile extends React.Component {
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
                    profileAttachment: '',
                    rating: 0,
                    profilePhotoPath: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
                },
                attachmentDisplay: 'block'
            }
        }
        componentWillMount() {
            const user = this.state.user
            user['userId'] = crypt.decrypt(cookies.get('devid'))
            user['token'] = crypt.decrypt(cookies.get('token'))
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
                        user['profileAttachment'] = response.data.data.profile.attachmentPath
                        if (response.data.data.user.profilePhotoPath != null) {
                            user['profilePhotoPath'] = response.data.data.user.profilePhotoPath
                        } else {
                            user['profilePhotoPath'] = "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
                        }

                        var totalRating = 0
                        for (var i = 0; i < response.data.data.profile.Feedbacks.length; i++) {
                          totalRating += response.data.data.profile.Feedbacks[i].rating
                        }
                        this.state.user.rating = (totalRating/response.data.data.profile.Feedbacks.length)
                        if ((response.data.data.profile.attachmentPath == "") || (response.data.data.profile.attachmentPath == null)) {
        									this.state.attachmentDisplay = 'none'
        								}
                        this.setState({
                            user
                        })
                    } else {

                    }
                })
        }

render(){
	return(
			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'85vh'}}>
        <div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
          <label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Developer Profile</label>
        </div>
        <div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
					<div className="row" style={{margin:'0px'}}>
						<div className="col-md-3" style={{minHeight:'330px', backgroundColor:'#337ab7', borderRadius:'3px'}}>
							<div className="row text-center" style={{padding:'50px 30px'}}>
								<img src={this.state.user.profilePhotoPath} name="aboutme" width="120" height="120" className="img-circle" />
								<h4 style={{color:'#fff', paddingTop:'10px', fontSize:'1.2em', textAlign:'center'}}>{this.state.user.name}</h4>
                <div className={styles.rating}>
                <ReactStars
                  count={5}
                  size={24}
                  color2={'#D4AF37'}
                  edit={false}
                  value={this.state.user.rating}
                />
                </div>
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
											<div className="col-md-4 "><span className={styles.fieldname}>Country</span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.country}</span></div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Skills</span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.skills}</span></div>
										</div>
									</div>
								</div>
								<div className="row" style={{padding:'15px 5px'}}>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Categories you are intrested</span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.categories}</span></div>
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
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Job Title</span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.jobTitle}</span></div>
										</div>
									</div>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Salary per Hour</span></div>
											<div className="col-md-8"><span className={styles.fieldvalue}>{this.state.user.salaryPerHour}</span></div>
										</div>
									</div>
								</div>
								<div className="row" style={{padding:'10px 5px'}}>
									<div className="col-md-3 "><span className={styles.fieldname}>Profile Description:</span></div>
								</div>
								<div className="row" style={{padding:'0px 5px 20px 5px'}}>
									<div className="col-md-12 text-left"><span className={styles.fieldvalue}>{this.state.user.userDesc}</span></div>
								</div>
								<div className="row" style={{padding:'15px 5px',display:this.state.attachmentDisplay}}>
									<div className="col-md-6">
										<div className="row text-left">
											<div className="col-md-4 "><span className={styles.fieldname}>Profile Attachment</span></div>
											<div className="col-md-8"><a className={styles.fieldvalue} href={this.state.user.profileAttachment} download>Download</a></div>
										</div>
									</div>
								</div>

						</div>
					</div>
				</div>
			</div>
		)
}
}
AppliedDeveloperProfile.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AppliedDeveloperProfile
