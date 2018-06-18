import React from 'react'
import ReactDOM from 'react-dom'
import { Link } from 'react-router'
import styles from './AppliedProjectsList.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import moment from 'moment'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class AppliedProjectsList extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                params: {
                    token: '',
                    userId:'',
                    developerId: '',
                    message: []
                }
            }
            this.projectClick = this.projectClick.bind(this);
        }
        componentWillMount() {
          const user = this.state.params
          user['userId'] = crypt.decrypt(cookies.get('UserID'))
          user['token'] = crypt.decrypt(cookies.get('token'))
          this.setState({user})
              AuthLayer.getProfileDetails(this.state.params)
              .then(response => {
                  if (response.data.success){
                   cookies.set('name', crypt.encrypt(response.data.data.profile.name), { path: '/' });
                   cookies.set('devid', crypt.encrypt(response.data.data.profile.id), { path: '/' });
                   this.ProjectsList();
                  }
                  else {
                   if (response.data.error == "API session expired, Please login again!") {
                     this.context.router.push('/logout');
                   }
                    }
              })

        }
  ProjectsList() {
    const user = this.state.params
    user['developerId'] = crypt.decrypt(cookies.get('devid'))
    this.setState({
        user
    })
    AuthLayer.AppliedProjectsList(this.state.params)
        .then(response => {
            if (response.data.success) {
                const user = this.state.params
                user['message'] = response.data.data
                this.setState({user})
            } else {

            }
        })
  }
  projectClick(event) {
    cookies.set('project_id', crypt.encrypt(event), { path: '/' });
      this.context.router.push('/dashboard/appliedprojectdesc')
  }

	render(){
		const List = this.state.params.message
		var todaysDate = moment(new Date());
		var projectList = '';
		if (List == "") {
				 projectList = (
						<div className="row">
							<div className="col-md-12" style={{width:'100%', textAlign:'center'}}>
								No applied projects
							</div>
						</div>
				)
		}
		else {
		 projectList = List.map((i, index) =>
				<div>
					<div className="row" style={{margin:'10px',padding:'10px 15px'}}>
						<a href='#' onClick={() => this.projectClick(i.projectId)}><h4>{i.Project.projectName}</h4></a>
							<div className="row" style={{margin:'5px'}}>

								<div className="col-md-12">
									<div className="row" style={{padding:'5px 0px 10px 0px'}}>

										<div className="col-md-10">
											<span className={styles.fieldname} style={{padding:'0px 5px 0px 0px'}}>{todaysDate.diff(moment(i.Project.createdAt), 'days')} Days Ago</span> -
											<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>{i.Project.experienceLevel}</span> -
											<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>Est.Time: {i.Project.estimatedDays} Days</span> -
											<span className={styles.fieldname} style={{padding:'0px 5px 0px 5px'}}>Cost: {i.Project.price} HUR</span>
										</div>

										<div className="col-md-2 text-left">
											<span className={styles.fieldname}>No of Bids:</span><span className={styles.fieldvalue} style={{paddingLeft:'10px'}}>{i.Project.AppliedProjects.length}</span>
										</div>
									</div>
								</div>

								<div className="row" style={{padding:'5px 0px 10px 15px'}}>

									<div className="col-sm-12 text-left">
										<span className={styles.fieldvaluedesc}>{i.Project.projectAbstract}</span>
									</div>
								</div>
								<div className="row" style={{margin:'5px 0px',padding:'5px 0px 0px 0px'}}>
									<div className="col-sm-12">
										{i.Project.category.split(',').map((i) =>
													<span className={styles.tech}><a href='#'>{i}</a></span>
										)}
									</div>
								</div>
								<div className="row" style={{padding:'10px 0px 0px 15px'}}>
									<div className="col-md-12 text-left">
										<p style={{textAlign:'left', paddingLeft: '0px'}}><span className={styles.fieldname}>Project Status:</span><span style={{paddingLeft:'10px'}}>{i.Project.ProjectStatus.status}</span></p>
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
          <label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Applied Projects List</label>
        </div>
        <div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
					{projectList}

				</div>
			</div>
			)
	}
}


AppliedProjectsList.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AppliedProjectsList
