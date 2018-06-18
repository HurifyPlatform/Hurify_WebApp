import React from 'react'
import styles from './SupportManagement.css'
import PropTypes from 'prop-types'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import $ from "jquery";
import moment from 'moment'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')



const cookies = new Cookies();
class SupportManagement extends React.Component{
	constructor(props){
			super(props)
			this.state = {
	      		user: {
							token: '',
							data:[]

	      		}
	    	}

  this.queryClick = this.queryClick.bind(this);
	}
	componentWillMount() {
		const user = this.state.user
    user["token"] = crypt.decrypt(cookies.get('token'))
    this.setState({user})
		if((crypt.decrypt(cookies.get('email')) == "schmouli@hurify.co") || (crypt.decrypt(cookies.get('email')) == "sridharkrishnan73@gmail.com") || (crypt.decrypt(cookies.get('email')) == "lspandana1995@gmail.com")) {
			this.getQueriesList();
		}
		else {
			this.context.router.push('/dashboard/mytoken')
		}
	}
getQueriesList() {
	AuthLayer.getUnsolvedQueries(this.state.user)
	.then(response => {
		// alert(JSON.stringify(response.data))
		if (response.data.success){
			const user = this.state.user
			user['data'] = response.data.data
			this.setState({user})
	} else {

		alert(JSON.stringify(response.data.error))
	}
		})
}
  queryClick(event) {
    cookies.set('query_id', crypt.encrypt(event), { path: '/' });
    this.context.router.push('/dashboard/supportmanagementdesc')
  }

	render(){
		const List = this.state.user.data
    var todaysDate = moment(new Date());
    var projectList = '';
    if (List == "") {
         projectList = (
            <div className="row">
              <div className="col-md-12" style={{width:'100%', textAlign:'center'}}>
                Queries are not there
              </div>
            </div>
        )
    }
    else {
       projectList = List.map((i) =>
  				<div>
              <div className="row" style={{margin:'10px',padding:'10px 15px'}}>
              							<a href='#' onClick={() => this.queryClick(i.id)}><h4>{i.email}</h4></a>
              							<div className="row" style={{margin:'10px'}}>
                              <label>Subject :</label><span>{i.subject}</span>
                            </div>
                            <div className="row" style={{margin:'10px'}}>
                              <label>Query :</label><span>{i.query}</span>
              							</div>
														<div className="row" style={{margin:'10px'}}>
                              <label>Submitted Date :</label><span>{new moment(new Date(i.createdAt)).format('MM/DD/YYYY,h:mm:ss a')}</span>
              							</div>
              						</div>
  						<hr style={{width:'96%',align:'center', marginLeft:'2%', marginTop:'0px',marginBottom:'0px'}}/>
  					</div>
  	  );
    }

		return(

          <div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
						<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
							<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Support Management</label>
						</div>
					<div className={styles.well} style={{margin:'50px 150px 50px 180px'}}>
						<h3 className={styles.h3Tag}>Open Support Cases</h3>
						{projectList}
					</div>
				</div>
			)
	}
}
SupportManagement.contextTypes = {
    router: PropTypes.object.isRequired
}
export default SupportManagement
