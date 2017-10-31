import React from 'react'
import $ from 'jquery'
import styles from './ProfileUpdate.css'
import Imageupload from './../../components/Imageupload/Imageupload'




class ProfileUpdate extends React.Component{

	constructor(props) {
		super(props);
		 this.state = { pictures: [] };
		 this.onDrop = this.onDrop.bind(this);
	}

	onDrop(picture) {
		this.setState({
            pictures: this.state.pictures.concat(picture),
        });
	}

	render(){
		return(
				<div className="row" style={{padding:'30px 50px', backgroundColor:'#e2e2e2', flex:'1', minHeight:'85vh'}}>
						<div className={styles.well}>
							<div className="row">
									<div className="col-md-12 text-center">
										<h3>ProfileUpdate</h3>
									</div>
							</div>
							<div className="row" style={{margin:'10px',paddingTop:'15px'}}>

								<div id="kv-avatar-errors-2" className="center-block"></div>
									<form className="form form-vertical">
									    <div className="row" style={{margin:'0px'}}>
									        <div className="col-sm-3 text-center">
									            <Imageupload />
									        </div>
									        <div className="col-sm-9">
									            <div className="row">
										            <div className="col-sm-6">
										              <div className="form-group">
										                <label for="email">Email Address<span className="kv-reqd">*</span></label>
										                <input type="email" className="form-control" name="email" placeholder="padmanabham.pakki@gmail.com" readOnly/>
										              </div>
										            </div>
										            <div className="col-sm-6">
										              <div className="form-group">
										                <label for="pwd">Name<span className="kv-reqd">*</span></label>
										                <input type="text" className="form-control" name="fullName" required />
										              </div>
										            </div>
									          	</div>
									          <div className="row">
									            <div className="col-sm-6">
									              <div className="form-group">
													  <label for="sel1">Select Country<span className="kv-reqd">*</span></label>
													  <select className="form-control" id="sel1">
													    <option>IND</option>
													    <option>USA</option>
													    <option>AUS</option>
													    <option>EN</option>
													  </select>
													</div>
									            </div>
									            <div className="col-sm-6">
									              <div className="form-group">
									                <label for="lname">Languages Known<span className="kv-reqd">*</span></label>
									                <input type="text" className="form-control" name="lname" required />
									              </div>
									            </div>
									          </div>
									          <div className="row">
									            <div className="col-sm-6">
									              <div className="form-group">
									                <label for="lname">Job Title<span className="kv-reqd">*</span></label>
									                <input type="text" className="form-control" name="lname" required />
									              </div>
									            </div>
									            <div className="col-sm-6">
									              <div className="form-group">
									                <label for="lname">Hourly Rate<span className="kv-reqd">*</span></label>
									                <input type="text" className="form-control" name="lname" required />
									              </div>
									            </div>
									          </div>
									          <div className="row">
									            <div className="col-sm-6">
									              <div className="form-group">
									              	<label for="lname">Categories you are intersted<span className="kv-reqd">*</span></label><br/>
									                <label className="checkbox-inline"><input type="checkbox" value="" />Network</label>
													<label className="checkbox-inline"><input type="checkbox" value="" />Mobile</label>
													<label className="checkbox-inline"><input type="checkbox" value="" />Embedded</label>
													<label className="checkbox-inline"><input type="checkbox" value="" />Cloud</label>
													<label className="checkbox-inline"><input type="checkbox" value="" />WebUI</label>
									              </div>
									            </div>
									            <div className="col-sm-6">
									              <div className="form-group">
									                <label for="lname">Skills<span className="kv-reqd">*</span></label>
									                <input type="text" className="form-control" name="lname" required />
									              </div>
									            </div>
									          </div>
									          <div className="row">
									          	<div className="col-md-12">
									          		<div className="form-group">
  														<label for="comment">Overview<span className="kv-reqd">*</span></label>
  														<textarea className="form-control" rows="2" id="comment"></textarea>
													</div>
												</div>
									          </div>
									          <div className="form-group">

									            <div className="text-center">
									              <button type="submit" className="btn btn-primary">Submit</button>
									            </div>
									          </div>
									        </div>
									    </div>
									</form>
							</div>
						</div>

				</div>
			)
	}
}

export default ProfileUpdate
