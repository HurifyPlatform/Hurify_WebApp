import React from 'react'
import styles from './EditProject.css'
import AuthLayer from './../../network/AuthLayer'
import ModalStore from './../../stores/ModalStore'
import HURPopup from './../HURcheck/HURPopup'
import HURAmount from './../HURamount/HURAmount'
import axios from 'axios'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


var catArr = [];
var catStr = "";


const cookies = new Cookies();
class EditProject extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token: '',
				projectId: '',
        file: null,
					project: {
							projectId: '',
							projectName: '',
							technology: '',
							category: '',
							price: '',
							experienceLevel: '',
							estimatedDays: '',
							projectAbstract: '',
							projectDesc: ''

				}


			}
		}
		this.submitProject = this.submitProject.bind(this);
		this.changeUser = this.changeUser.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.updateCheckbox = this.updateCheckbox.bind(this);
    this.cancelClick = this.cancelClick.bind(this);
	}
	componentWillMount() {
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
		const user = this.state.params
		user['token'] = crypt.decrypt(cookies.get('token'))
		user['projectId'] = crypt.decrypt(cookies.get('project_id'))
		this.setState({user})

				AuthLayer.PostedProjectDesc(this.state.params)
				.then(response => {
						if (response.data.success){
							const user = this.state.params.project
							user['projectName'] = response.data.data.projectName
							user['technology'] = response.data.data.technology
							user['category'] = response.data.data.category
							user['price'] = response.data.data.price
							user['experienceLevel'] = response.data.data.experienceLevel
							user['estimatedDays'] = response.data.data.estimatedDays
							user['projectAbstract'] = response.data.data.projectAbstract
							user['projectDesc'] = response.data.data.projectDesc
							user['AppliedProjects'] = response.data.data.AppliedProjects
							this.setState({user})
							this.updateCheckbox()
						} else {
							}
				})
	}



	submitProject(event) {
		event.preventDefault();
		const user = this.state.params.project
		user["projectId"] = crypt.decrypt(cookies.get('project_id'))
		this.setState({user})
		if (user.category == "" || user.category == null) {
			return alert("Please select atleast one category!");
		}
    const request = new FormData();
    var ProjectData = JSON.stringify(this.state.params.project);
    request.append('file', this.state.params.file);
    request.append('token', crypt.decrypt(cookies.get('token')));
    request.append('project', ProjectData)
    axios.post(require('./../../../config').serverAPI + '/apicall/editproject', request).then(result => {
      if(result.data.success) {
        alert("Project updated successfully")
        this.context.router.push('/dashboard/postedprojectsdesc')
      }
      else {
        alert("Failed to Update Project Details, Please Try Again")
      }
    });


	}
  handleFileChange(event) {
    event.preventDefault();
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      this.setState({
        file: file,
        imagePreviewUrl: reader.result
      });
      const user = this.state.params
      user["file"] = file
      this.setState({user});
    }
    reader.readAsDataURL(file);

  }
	changeUser(event) {
		const field = event.target.name
		const user = this.state.params.project
		user[field] = event.target.value
		this.setState({user})
	}

	handleChange(event) {
		const user = this.state.params.project
		user['category'] = catStr
		this.setState({user})
	}
  cancelClick() {
    this.context.router.push('/dashboard/postedprojectsdesc')
  }
	updateCheckbox(){
		var array = (this.state.params.project.category).split(',');
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


	render(){
		return(
			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'85vh',overFlowY:'scroll'}}>
        <div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
          <label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Edit Project</label>
        </div>
        <form onSubmit={this.submitProject}>
				<div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
					<div className="row" style={{margin:'10px',padding:'20px 25px'}}>
						<h3 className="text-center"></h3>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="projectName" className={styles.fieldname}>Project Name<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="projectName" onChange={this.changeUser} value={this.state.params.project.projectName} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="technology" className={styles.fieldname}>Technology<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="technology" onChange={this.changeUser} value={this.state.params.project.technology} required />
								</div>
							</div>
						</div>

						<div className="row">

							<div className="col-md-6">
								<div className="form-group">
									<label for="Price" className={styles.fieldname}>Price<span className="kv-reqd">*</span></label>
									<input type="number" className="form-control" name="price" onChange={this.changeUser} value={this.state.params.project.price} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="experience" className={styles.fieldname}>Experience<span className="kv-reqd">*</span></label>
									<select className="form-control" id="experience" name="experienceLevel" onChange={this.changeUser} value={this.state.params.project.experienceLevel} required>
										<option>Beginner</option>
										<option>Intermediate</option>
										<option>Expert</option>
									</select>
								</div>
							</div>

						</div>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="estimatedtime" className={styles.fieldname}>Estimated Days<span className="kv-reqd">*</span></label>
									<input type="number" className="form-control" name="estimatedDays" onChange={this.changeUser} value={this.state.params.project.estimatedDays} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="abstract" className={styles.fieldname}>Abstract<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="projectAbstract" maxLength="120" onChange={this.changeUser} value={this.state.params.project.projectAbstract} required />
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
									<label for="categories" className={styles.fieldname}>Categories<span className="kv-reqd">*</span></label><br/>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" id="Network" value="Network" style={{display: 'block'}} onChange={this.handleChange} />Network</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" id="Mobile" value="Mobile" style={{display: 'block'}} onChange={this.handleChange} />Mobile</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" id="Embedded" value="Embedded" style={{display: 'block'}} onChange={this.handleChange} />Embedded</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" id="Cloud" value="Cloud" style={{display: 'block'}} onChange={this.handleChange} />Cloud</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" id="Webui" value="Webui" style={{display: 'block'}} onChange={this.handleChange} />WebUI</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" id="Middleware" value="Middleware" style={{display: 'block'}} onChange={this.handleChange} />Middleware</label>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
  									<label for="comment" className={styles.fieldname}>Project Description<span className="kv-reqd">*</span></label>
  									<textarea className="form-control" rows="2" id="comment" name="projectDesc" onChange={this.changeUser} value={this.state.params.project.projectDesc} required></textarea>
								</div>
							</div>
						</div>
            <div className="row">
							<div className="col-md-12">
								<div className="form-group">
  									<label for="comment" className={styles.fieldname}>Attachment</label>
											<form ref="uploadForm" encType="multipart/form-data">
												<input type="file" onChange={(e)=>this.handleFileChange(e)} name="file"/>
											</form>
								</div>
							</div>
						</div>

						<div className="row" style={{padding:'15px 15px'}}>
							<div className="text-right">
                <button type="button" className="btn btn-primary btn-md" style={{color:'#ffffff',backgroundColor: '#4FC3F7',margin:'0px 5px'}} onClick={this.cancelClick}> Cancel</button>
								<input type="Submit" className="btn btn-primary btn-md" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}} value="Submit"></input>

							</div>
						</div>

					</div>
				</div>
      </form>
        <HURPopup/>
        <HURAmount/>
			</div>
		)
	}
}
EditProject.contextTypes = {
    router: PropTypes.object.isRequired
}
export default EditProject
