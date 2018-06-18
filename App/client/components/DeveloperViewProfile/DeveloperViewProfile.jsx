import React from 'react'
import styles from './DeveloperViewProfile.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie';
import ReactStars from 'react-stars'
var crypt = require('./../../../config/crypt')
const cookies = new Cookies();
class DeveloperViewProfile extends React.Component{
	constructor(props){
			super(props)
			this.state = {
						user: {
	            token: '',
              developerId:'',
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
						 uuid: '',
						 profileAttachment: '',
						 referrerCode:'',
             skillArray:[],
             rating:'',
	           profilePhotoPath: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'
					 },
					 attachmentDisplay: 'block',
					 referrerDisplay:'block',
           statistics: {
             appliedProjects:'',
             projectsCompleted:'',
             ongingProject:''
           }
				}
				this.editProfileDetails = this.editProfileDetails.bind(this);
		}
		componentWillMount() {
	    const user = this.state.user
	    user['userId'] = crypt.decrypt(cookies.get('UserID'))
	    user['token'] = crypt.decrypt(cookies.get('token'))
	    this.setState({user})
	        AuthLayer.getProfileDetails(this.state.user)
	        .then(response => {
            console.log(JSON.stringify(response.data));
	            if (response.data.success){
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
								user['uuid'] = response.data.data.user.uuid
								user['profileAttachment'] = response.data.data.profile.attachmentPath
                user['skillArray'] = (response.data.data.profile.skills).split(',')
                var totalRating = 0
                for (var i = 0; i < response.data.data.profile.Feedbacks.length; i++) {
                  totalRating += response.data.data.profile.Feedbacks[i].rating
                }
                  user['rating'] = (totalRating/response.data.data.profile.Feedbacks.length)
								if (response.data.data.user.referrerCode == null) {
									this.state.referrerDisplay = "none"
								}
								else {
									user['referrerCode'] = response.data.data.user.referrerCode
								}
								if ((response.data.data.profile.attachmentPath == "") || (response.data.data.profile.attachmentPath == null)) {
									this.state.attachmentDisplay = 'none'
								}
	              if (response.data.data.user.profilePhotoPath != null) {
	              	user['profilePhotoPath'] = response.data.data.user.profilePhotoPath
									cookies.set('ProfilePhoto', crypt.encrypt(response.data.data.user.profilePhotoPath), { path: '/' });
							 }
							 else {
								 user['profilePhotoPath'] = "https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"
								 cookies.set('ProfilePhoto', crypt.encrypt("https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png"), { path: '/' });
							 }
               user['developerId'] = response.data.data.profile.id
                this.setState({user})
               AuthLayer.developerDashboard(this.state.user)
     	        .then(response1 => {
                // alert(JSON.stringify(response1.data))
                if (response1.data.success) {
                  const statistics = this.state.statistics
                  statistics["appliedProjects"] = response1.data.data.appliedProjects
                  statistics["projectsCompleted"] = response1.data.data.projectsCompleted
                  statistics["ongingProject"] = response1.data.data.ongingProject
                  this.setState({statistics})
                }
              })
							 cookies.set('name', crypt.encrypt(response.data.data.profile.name), { path: '/' });
							 cookies.set('devid', crypt.encrypt(response.data.data.profile.id), { path: '/' });
	            }
							else {
 							 if (response.data.error == "API session expired, Please login again!") {
 								 this.context.router.push('/logout');
 							 }
	              }
	        })
		}
	    editProfileDetails(event)
	    {
	      if (crypt.decrypt(cookies.get('account_type')) == "developer") {
	      this.context.router.push('/dashboard/developereditprofile')
	    }
	    else {
	      this.context.router.push('/dashboard/clienteditprofile')
	    }
	      }
render(){
	return(
			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'85vh'}}>
				<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
					<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Profile</label>
				</div>
				<div className={styles.well} style={{margin:'50px 100px 170px 130px'}}>
					<div className="row" style={{margin:'10px', padding:'30px 0px 0px 0px'}}>
            <div className="col-md-2">
              <img src={this.state.user.profilePhotoPath} name="aboutme" width="100" height="120" className="img-circle" />
            </div>
            <div className="col-md-7">
              <h4 style={{color:'#000', paddingTop:'0px', fontSize:'2em'}}>{this.state.user.name}</h4>
              <span style={{paddingLeft:"10px",paddingTop:'5px'}}>{this.state.user.email}</span>
              <div style={{paddingLeft:"10px",paddingTop:'5px'}}>{this.state.user.jobTitle}</div>
              <div style={{paddingLeft:'10px',paddingTop:'3px'}}>Rate per Hour - {this.state.user.salaryPerHour} HUR</div>
              <div style={{paddingLeft:'5px'}}>
                <ReactStars
                  count={5}
                  size={24}
                  color2={'#D4AF37'}
                  edit={false}
                  value={this.state.user.rating}
                />
              </div>
              <div style={{padding:"0px 0px 0px 10px",display:this.state.referrerDisplay}}>Referral Code - {this.state.user.referrerCode}</div>
            </div>
            <div className="col-md-3" style={{}}>
              <div style={{width:'90%',textAlign:'right',paddingTop:'10px'}}>
                <div style={{margin:'0px',textAlign:'center',border:'1px', backgroundColor:'#3c8dbc',padding:'2px',color:'#fff',fontWeight:'900',fontSize:'1.2em',marginBottom:'10px'}}>Statistics</div>
								<div>Applied Projects - {this.state.statistics.appliedProjects}</div>
								<div>Projects Completed - {this.state.statistics.projectsCompleted}</div>
								<div>Working Projects - {this.state.statistics.ongingProject}</div>
              </div>
            </div>
					</div>
          <div className="row" style={{margin:'0px 10px 10px 30px', padding:'20px 0px 5px 0px'}}>
            <h5 style={{fontSize:'1.2em',padding:'0px 10px'}}>Profile Description</h5>
            <div style={{margin:"10px 30px 0px 10px", textAlign:'justify'}}>{this.state.user.userDesc}</div>
          </div>
          <div className="row" style={{margin:'5px 20px',padding:'10px 0px 0px 0px'}}>
            <div className="col-md-12 col-sm-6 col-xs-6">
              {this.state.user.skillArray.map((i) =>
                    <span className={styles.tech}>{i}</span>
              )}
            </div>
          </div>
					<div className="row" style={{margin:'25px 20px 0px 25px',padding:'10px 0px 0px 0px',display:this.state.attachmentDisplay}} >
						<div className="col-md-12">
							<span className="">Profile Attachment - <a className="" href={this.state.user.profileAttachment} download>Download</a></span>
						</div>
					</div>
					<div>
					<div className="row" style={{padding:'20px 0px'}}>
						<div className="text-right">
							<button type="button" className="btn btn-primary btn-md" style={{color:'#ffffff',backgroundColor: '#3c8dbc',marginRight:'30px',padding:'5px 20px 5px 20px'}} onClick={this.editProfileDetails}><span className="glyphicon glyphicon-pencil"></span> Edit</button>
						</div>
					</div>
					</div>
				</div>
			</div>
		)
}
}
DeveloperViewProfile.contextTypes = {
    router: PropTypes.object.isRequired
}
export default DeveloperViewProfile
