import React from 'react'
import Imageupload from './../../components/Imageupload/Imageupload'
import styles from './DeveloperEditProfile.css'
import $ from "jquery";
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'


var catArr = [];
var catStr = "";
var catArr = [];
var catStr = "";
$(document).ready(function()
{
        $('input[type="checkbox"]').click(function(){
            if($(this).is(":checked")){
                      catArr.push($(this).attr("value"))
                      catStr = catArr.join(", ")
              }
            else if($(this).is(":not(:checked)")){
                      var i = catArr.indexOf($(this).attr("value"));
                      catArr.splice(i, 1);
                      catStr = catArr.join(",")
            }
        });
});

class DeveloperEditProfile extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			params: {
				token: '',
				user: {
					token:'',
					userId: '',
					email: '',
					country: '',
					name: '',
					languages_known: '',
					job_title: '',
					salary_per_hour: '',
					categories: '',
					skills: '',
					description: ''
				}
			}
		}
		this.updatingProfile = this.updatingProfile.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.changeUser = this.changeUser.bind(this);
		this.updateCheckbox = this.updateCheckbox.bind(this);
	}
    componentWillMount() {
        const user = this.state.params.user
        user['userId'] = localStorage.getItem('UserID')
        user['token'] = localStorage.getItem('token')
        this.setState({user})
            AuthLayer.getProfileDetails(this.state.params.user)
            .then(response => {
                if (response.data.success){
                  const user = this.state.params.user
                  user['name'] = response.data.data.profile.name
                  user['email'] = response.data.data.user.email
                  user['country'] = response.data.data.profile.country
                  user['languages'] = response.data.data.profile.languages
                  user['jobTitle'] = response.data.data.profile.jobTitle
                  user['salaryPerHour'] = response.data.data.profile.salaryPerHour
                  user['categories'] = response.data.data.profile.categories
                  user['skills'] = response.data.data.profile.skills
                  user['userDesc'] = response.data.data.profile.userDesc
                  this.setState({user})
                  this.updateCheckbox()
                } else {
                  alert(JSON.stringify(response.data.error))
                  }
            })
      }

      updateCheckbox(){
        var array = (this.state.params.user.categories).split(',');
        var array1 = [];
        for (var i = 0; i < array.length; i++) {
          array1[i] = array[i].trim();
        }

        for(var i=0;i<array1.length;i++)
          {
            var check = array1[i].trim();
            if(check=="Mobile"){
              $("#Mobile").prop( "checked", true );
              catArr.push("Mobile")
            }
            else if(check=="Network"){
              $("#Network").prop( "checked", true );
              catArr.push("Network")
            }
            else if(check=="Webui"){
              $("#Webui").prop( "checked", true );
              catArr.push("Webui")
            }
            else if(check=="Cloud"){
              $("#Cloud").prop( "checked", true );
              catArr.push("Cloud")
            }
            else if(check=="Embedded"){
              $("#Embedded").prop( "checked", true );
              catArr.push("Embedded")
            }
            else if(check=="Middleware"){
              $("#Middleware").prop( "checked", true );
              catArr.push("Middleware")
            }
          }
      }


	updatingProfile(event) {
		event.preventDefault();

		let userDetails = this.state.params.user;
		console.log(userDetails)
		if (userDetails.name == "" || userDetails.name == null) {
			return alert("Please enter your name!");
		}
		if (userDetails.country == "" || userDetails.country == null) {
			return alert("Please select country!");
		}
		if (userDetails.languages == "" || userDetails.languages == null) {
			return alert("Please enter known languages!");
		}
		if (userDetails.jobTitle == "" || userDetails.jobTitle == null) {
			return alert("Please enter your job title!");
		}
		if (userDetails.salaryPerHour == "" || userDetails.salaryPerHour == null) {
			return alert("Please enter your Hourly Rate in HUR!");
		}
		if (userDetails.skills == "" || userDetails.skills == null) {
			return alert("Please enter your skills!");
		}
		if (userDetails.categories == "" || userDetails.categories == null) {
			return alert("Please select interested categories!");
		}
		if (userDetails.userDesc == "" || userDetails.userDesc == null) {
			return alert("Please write about you!");
		}

		const userIdAdding = this.state.params.user
		userIdAdding['userId'] = localStorage.getItem('UserID')
		this.setState({userIdAdding})


			const params = this.state.params
			params['token'] = localStorage.getItem('token')
			this.setState({params})
			AuthLayer.editProfile(this.state.params).then(response => {
				if (response.data.success){
					alert("Profile updated successfully")
					this.setState({
						status: response.status,
						message: response.data.message,
						errors: response.data.errors
					})
					UserStore.setName(this.state.params.user.name)
					localStorage.setItem('name', this.state.params.user.name)
					this.context.router.push('/dashboard/developerviewprofile')
				} else {
					alert(JSON.stringify(response.data.error))
				}
			})
	}


  		changeUser(event) {
  	    	const field = event.target.name
  	    	const user = this.state.params.user
  	    	user[field] = event.target.value
  				this.setState({user})
  		}
  	handleChange(event) {
		const user = this.state.params.user
		user['categories'] = catStr
		this.setState({user})
	}

	render(){
	return(

		<div className="row" style={{padding:'100px 50px 50px 50px', backgroundColor:'#e2e2e2', flex:'1', minHeight:'85vh'}}>
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
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Job Title<span className="kv-reqd">*</span></label>
												<input type="text" className="form-control" name="jobTitle" value={this.state.params.user.jobTitle} onChange={this.changeUser} required />
										</div>
								</div>
								<div className="col-sm-6">
									<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Hourly Rate<span className="kv-reqd">*</span></label>
												<input type="text" className="form-control" name="salaryPerHour" value={this.state.params.user.salaryPerHour} onChange={this.changeUser} required />
										</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Categories you are intersted<span className="kv-reqd">*</span></label><br/>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" id="Network" value="Network" onChange={this.handleChange} style={{marginLeft:'-20px'}}/>Network</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" id="Mobile" value="Mobile" onChange={this.handleChange} style={{marginLeft:'-20px'}} />Mobile</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" id="Embedded" value="Embedded" onChange={this.handleChange} style={{marginLeft:'-20px'}} />Embedded</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" id="Cloud" value="Cloud" onChange={this.handleChange} style={{marginLeft:'-20px'}} />Cloud</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" id="Webui" value="Webui" onChange={this.handleChange} style={{marginLeft:'-20px'}} />WebUI</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" id="Middleware" value="Middleware" onChange={this.handleChange} style={{marginLeft:'-20px'}} />Middleware</label>
										</div>
								</div>
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Skills<span className="kv-reqd">*</span></label>
												<input type="text" className="form-control" name="skills" value={this.state.params.user.skills} onChange={this.changeUser} required />
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
DeveloperEditProfile.contextTypes = {
    router: PropTypes.object.isRequired
}
export default DeveloperEditProfile
