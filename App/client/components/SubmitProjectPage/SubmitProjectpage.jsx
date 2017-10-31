import React from 'react'
import styles from './SubmitProjectpage.css'
import AuthLayer from './../../network/AuthLayer'
import ModalStore from './../../stores/ModalStore'
import HURPopup from './../HURcheck/HURPopup'
import HURAmount from './../HURamount/HURAmount'
import axios from 'axios'

var catArr = [];
var catStr = "";

$(document).ready(function() {
	$('input[type="checkbox"]').click(function() {
		if($(this).is(":checked")) {
			catArr.push($(this).attr("value"))
			catStr = catArr.join(",")
		}
		else if($(this).is(":not(:checked)")) {
			var i = catArr.indexOf($(this).attr("value"));
			catArr.splice(i, 1);
			catStr = catArr.join(",")
		}
	});
});

class SubmitProjectpage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token: '',
				project: {
					clientId: '',
					projectName: null,
					technology: '',
					category: null,
					price: null,
					experienceLevel: '',
					estimatedDays: null,
					projectAbstract: '',
					projectDesc: ''
				}
			}
		}
		this.submitProject = this.submitProject.bind(this);
		this.changeUser = this.changeUser.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);

	}

	submitProject(event) {
		event.preventDefault();
		const stateParams = this.state.params
		stateParams["token"] = localStorage.getItem('token')
		this.setState({stateParams})
		const user = this.state.params.project
		user["clientId"] = localStorage.getItem('client_id')
		this.setState({user})
		console.log(JSON.stringify(user))
		if (user.projectName == "" || user.projectName == null) {
			return alert("Please enter project name!");
		}
		if (user.technology == "" || user.technology == null) {
			return alert("Please enter technologies!");
		}
		if (user.price == "" || user.price == null) {
			return alert("Please enter amount!");
		}
		if (user.estimatedDays == "" || user.estimatedDays == null || typeof parseInt(user.estimatedDays) != "number") {
			return alert("Please enter estimated no. of days!");
		}
		if (user.category == "" || user.category == null) {
			return alert("Please select atleast one category!");
		}
		if (user.projectAbstract == "" || user.projectAbstract == null) {
			return alert("Please enter project abstract!");
		}
		if (user.projectDesc == "" || user.projectDesc == null) {
			return alert("Please enter project description!");
		}
		AuthLayer.createProject(this.state.params).then(response => {
			if (response.data.success){
				alert("Project submitted succeccfully")
				this.setState({
					status: response.status,
					message: response.data.message,
					errors: response.data.errors
				})

				ModalStore.setDisplayed('HUR', true)
			} else {
				alert("Failed to Submit Project, Check your Input Data!")
			}
		})
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

	handleSubmit(event) {
		event.preventDefault();
		const request = new FormData();
		let file = this.state.file;
		request.append('file', file);
		request.append('name', 'file');
		request.append('token', localStorage.getItem('token'));
		request.append('userId',localStorage.getItem('UserID'));
		request.append('desc', 'This is sample upload');
		axios.post(require('./../../../config').serverAPI + '/apicall/uploadprofilephoto', request).then(result => {
			console.log("suceeeeee");
			if(result.data.success) {
				alert("File Updated Successfully!")
			}
		});
	}

	handleImageChange(event) {
		event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0];
		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
		}
		reader.readAsDataURL(file);
	}

	render(){
		return(
			<div className="row" style={{padding:'100px 50px 50px 50px', backgroundColor:'#e2e2e2', flex:'1', minHeight:'85vh',overFlowY:'scroll'}}>
				<div className={styles.well}>
					<div className="row" style={{margin:'10px',padding:'20px 25px'}}>
						<h3 className="text-center"></h3>
						<div className="row">
							<div className="col-md-6">
								<div className="form-group">
									<label for="projectName" className={styles.fieldname}>Project Name<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="projectName" onChange={this.changeUser} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="technology" className={styles.fieldname}>Technology<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="technology" onChange={this.changeUser} required />
								</div>
							</div>
						</div>

						<div className="row">

							<div className="col-md-6">
								<div className="form-group">
									<label for="Price" className={styles.fieldname}>Price<span className="kv-reqd">*</span></label>
									<input type="number" className="form-control" name="price" onChange={this.changeUser} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="experience" className={styles.fieldname}>Experience<span className="kv-reqd">*</span></label>
									<select className="form-control" id="experience" name="experienceLevel" onChange={this.changeUser}>
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
									<input type="number" className="form-control" name="estimatedDays" onChange={this.changeUser} required />
								</div>
							</div>
							<div className="col-md-6">
								<div className="form-group">
									<label for="abstract" className={styles.fieldname}>Abstract<span className="kv-reqd">*</span></label>
									<input type="text" className="form-control" name="projectAbstract" onChange={this.changeUser} required />
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
									<label for="categories" className={styles.fieldname}>Categories<span className="kv-reqd">*</span></label><br/>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" value="Network" onChange={this.handleChange} />Network</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" value="Mobile" onChange={this.handleChange} />Mobile</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" value="Embedded" onChange={this.handleChange} />Embedded</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" value="Cloud" onChange={this.handleChange} />Cloud</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" value="Webui" onChange={this.handleChange} />WebUI</label>
										<label className="checkbox-inline" style={{color:'#ffffff',paddingLeft:'30px'}}><input type="checkbox" value="Middleware" onChange={this.handleChange} />Middleware</label>
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div className="form-group">
  									<label for="comment" className={styles.fieldname}>Project Description<span className="kv-reqd">*</span></label>
  									<textarea className="form-control" rows="2" id="comment" name="projectDesc" onChange={this.changeUser}></textarea>
								</div>
							</div>
						</div>
						<form ref="uploadForm" encType="multipart/form-data">
							<input className={styles.fileInput} type="file" onChange={(e)=>this.handleImageChange(e)} name="file"/>
							<button onClick={(e)=>this.handleSubmit(e)} className={styles.submitButton} disabled={!this.state.file} type="submit">Upload File</button>
						</form>
						<div className="row" style={{padding:'15px 15px'}}>
							<div className="text-right">
								<button type="button" className="btn btn-primary btn-md" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}} onClick={this.submitProject}><span className="glyphicon glyphicon-hand-up"></span> Submit</button>
							</div>
						</div>

					</div>
				</div>
        <HURPopup/>
        <HURAmount/>
			</div>
		)
	}
}


export default SubmitProjectpage
