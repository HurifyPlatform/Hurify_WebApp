import React from 'react'
import styles from './FindProjects.css'
import PropTypes from 'prop-types'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import $ from "jquery";
import moment from 'moment'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


var catArr = [];
var catStr = "";
var expArr = [];
var expStr = "";


const cookies = new Cookies();
class FindProjects extends React.Component{
	constructor(props){
			super(props)
			this.state = {
	      		user: {
							token: '',
              developerId: '',
		        	categories: '',
							experienceLevel: '',
							message: []

	      		}
	    	}
	this.handleChange = this.handleChange.bind(this);
	this.expChange = this.expChange.bind(this);
	this.listofProjects = this.listofProjects.bind(this);
  this.projectClick = this.projectClick.bind(this);
	}
	componentWillMount() {
    $(document).ready(function()
    {

            $('input[type="checkbox"]').click(function(){
                if($(this).is(":checked")){
    							if ($(this).attr("name") == "technology") {
    								if (catArr == "") {
    									 catArr.push($(this).attr("value"))
    									catStr = catArr.join(",")
    								}

    								else {
    									catArr.push($(this).attr("value"))
    									catStr = catArr.join(",")
    								}
    							}
    							else if ($(this).attr("name") == "experience") {
    								if (expArr == "") {
    									 expArr.push($(this).attr("value"))
    									expStr = expArr.join(",")
    								}
    								else {
    									expArr.push($(this).attr("value"))
    									expStr = expArr.join(",")
    								}
    							}

    						}
    							else if($(this).is(":not(:checked)")){
    								if ($(this).attr("name") == "technology") {
    								var i = catArr.indexOf($(this).attr("value"));
    									 catArr.splice(i, 1);
    								catStr = catArr.join(",")

    							}

    							else if ($(this).attr("name") == "experience") {
    								var i = expArr.indexOf($(this).attr("value"));
    									 expArr.splice(i, 1);
    								expStr = expArr.join(",")
    							}
    						}
    							}
            );

    });
	  this.listofProjects();
	}

	handleChange(event) {
					const user = this.state.user
					user['categories'] = catStr
					this.setState({user})
					this.listofProjects();
	}
	expChange(event) {
					const user = this.state.user
					user['experienceLevel'] = expStr
					this.setState({user})
					this.listofProjects();
	}
	listofProjects() {
    const user = this.state.user
		user['token'] = crypt.decrypt(cookies.get('token'))
    user['developerId'] = crypt.decrypt(cookies.get('devid'))
		this.setState({user})
		AuthLayer.FindProjects(this.state.user)
		.then(response => {
			if (response.data.success){
				const user = this.state.user
				user['message'] = response.data.data
				this.setState({user})
		} else {
			const user = this.state.user
	                user['message'] = []
	                this.setState({user})
      alert("No Projects Posted.")
		}
		})
	}
  projectClick(event) {
    cookies.set('project_id', crypt.encrypt(event), { path: '/' });
    this.context.router.push('/dashboard/applyproject')
  }


	render(){
		const List = this.state.user.message
    var todaysDate = moment(new Date());
    var projectList = '';
    if (List == "") {
         projectList = (
            <div className="row">
              <div className="col-md-12" style={{width:'100%', textAlign:'center'}}>
                Projects are not there
              </div>
            </div>
        )
    }
    else {
       projectList = List.map((i) =>
  				<div>
              <div className="row" style={{margin:'10px',padding:'10px 15px'}}>
              							<a href='#' onClick={() => this.projectClick(i.id)}><h4>{i.projectName}</h4></a>
              							<div className="row" style={{margin:'5px'}}>

              								<div className="col-md-12">
              									<div className="row" style={{padding:'5px 0px 10px 0px'}}>

              										<div className="col-md-10">
              											<span className={styles.fieldname} style={{padding:'0px 5px 0px 0px'}}>{todaysDate.diff(moment(i.createdAt), 'days')} Days Ago</span> -
              											<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>{i.experienceLevel}</span> -
              											<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>Est.Time: {i.estimatedDays} Days</span> -
              											<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>Cost: {i.price} HUR</span>
              										</div>

              										<div className="col-md-2 text-left">
              											<span className={styles.fieldname}>No of Bids:</span><span className={styles.fieldvalue} style={{paddingLeft:'10px'}}>{i.AppliedProjects.length}</span>
              										</div>
              									</div>
              								</div>
              								<div className="row" style={{padding:'5px 0px 10px 12px'}}>
              									<div className="col-md-12 col-sm-12 col-xs-12 text-left">
              										<span className={styles.fieldvaluedesc}>{i.projectAbstract}</span>
              									</div>
              								</div>
              								<div className="row" style={{margin:'5px 0px',padding:'10px 0px 10px 0px'}}>
              									<div className="col-md-12 col-sm-6 col-xs-6">
                                  {i.category.split(',').map((i) =>
                                        <span className={styles.tech}>{i}</span>
                                  )}
              									</div>
              								</div>

              							</div>
              						</div>


  						<hr style={{width:'96%',align:'center', marginLeft:'2%', marginTop:'0px',marginBottom:'0px'}}/>
  					</div>
  	  );
    }

		return(

          <div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
						<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
							<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Find Work</label>
						</div>
          					<div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
          						<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
          							<div className="col-md-12 col-xs-12 col-sm-12">
          								<div className="form-group" style={{paddingTop:'10px'}}>
                            <label for="categories" className={styles.fieldname}>Categories</label><br/>
          									<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'5px'}}><input type="checkbox" name="technology" value="WebUI" onChange={this.handleChange}/><span>WebUI</span></label>
          									<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="technology" value="Mobile" onChange={this.handleChange}/><span>Mobile</span></label>
          									<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="technology" value="Cloud" onChange={this.handleChange}/><span>Cloud</span></label>
          									<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="technology" value="Network" onChange={this.handleChange}/><span>Network</span></label>
          									<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="technology" value="Middleware" onChange={this.handleChange}/><span>Middleware</span></label>
          									<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="technology" value="Embedded" onChange={this.handleChange}/><span>Embedded</span></label>
          								</div>
          							</div>
          							<div className="col-md-12 col-xs-12 col-sm-12">
          								<div className="form-group">
          									<label for="categories" className={styles.fieldname}>Experience Level</label><br/>
          										<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="experience" value="Beginner" onChange={this.expChange}/><span>Beginner</span></label>
          										<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="experience" value="Intermediate" onChange={this.expChange}/><span>InterMediate</span></label>
          										<label className="checkbox-inline" style={{marginTop:'10px', marginBottom:'5px',paddingLeft:'0px'}}><input type="checkbox" name="experience" value="Expert" onChange={this.expChange}/><span>Expert</span></label>
          								</div>
          							</div>
          						</div>
          					</div>


					<div className={styles.well} style={{margin:'50px 50px 50px 50px'}}>
						{projectList}
					</div>
				</div>
			)
	}
}
FindProjects.contextTypes = {
    router: PropTypes.object.isRequired
}
export default FindProjects
