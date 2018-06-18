import React from 'react'
import styles from './SupportManagementDesc.css'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import moment from 'moment'
import DatePicker from 'react-bootstrap-date-picker'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class SupportManagementDesc extends React.Component {
        constructor(props) {
            super(props)
            this.state = {
                params: {
                    token: '',
                    queryId: '',
                    email:'',
                    subject:'',
                    query:'',
                    resolution:''

                }
            }
            this.ResolutionSubmit = this.ResolutionSubmit.bind(this);
            this.changesUser = this.changesUser.bind(this);
        }
        componentWillMount() {
          const user = this.state.params
      		user['token'] = crypt.decrypt(cookies.get('token'))
          user['queryId'] = crypt.decrypt(cookies.get('query_id'))
      		this.setState({user})
      		if((crypt.decrypt(cookies.get('email')) == "schmouli@hurify.co") || (crypt.decrypt(cookies.get('email')) == "sridharkrishnan73@gmail.com") || (crypt.decrypt(cookies.get('email')) == "lspandana1995@gmail.com")) {
      			this.getQueryDetails();
      		}
      		else {
      			this.context.router.push('/dashboard/mytoken')
      		}

        }
        getQueryDetails() {
          AuthLayer.getQueryDetails(this.state.params)
      		.then(response => {
            // alert(JSON.stringify(response.data))
      			if (response.data.success){
              const user = this.state.params
              user['email'] = response.data.data.email
              user['subject'] = response.data.data.subject
              user['query'] = response.data.data.query
              this.setState({user})
      		} else {

            alert(JSON.stringify(response.data.error))
      		}
      		})
        }
        ResolutionSubmit(event) {
          event.preventDefault();
          // console.log(this.state.params);
          AuthLayer.resolutionSubmit(this.state.params)
          .then(response => {
            // alert(JSON.stringify(response.data))
            if (response.data.success){
              this.context.router.push('/dashboard/supportmanagement')
          } else {

            alert(JSON.stringify(response.data))
          }
          })
        }
        changesUser(event) {
      			const field = event.target.name
      			const user = this.state.params
      			user[field] = event.target.value
      			this.setState({user})
      		}
	render(){

		return(
			<div className="row" style={{padding:'2px 0px 0px 0px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
        <div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
          <label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Support Management</label>
        </div>
                <div className={styles.well} style={{margin:'50px 150px 220px 180px'}}>
									<div className="row" style={{margin:'10px',padding:'15px 15px'}}>
										<h4 style={{textAlign:'center'}}>{this.state.params.email}</h4>
                    <div className="row" style={{margin:'10px',marginLeft:'20px',marginTop:'30px'}}>
                      <label>Subject :</label><span>{this.state.params.subject}</span>
                    </div>
                    <div className="row" style={{margin:'10px',marginLeft:'20px'}}>
                      <label>Query :</label><span>{this.state.params.query}</span>
                    </div>
                    <form onSubmit={this.ResolutionSubmit}>
                    <div className="row" style={{margin:'10px',marginLeft:'20px'}}>
                      <label>Resolution</label>
                      <textarea className="form-control" rows="5" id="comment" name="resolution" placeholder="Resolution" value={this.state.params.resolution} onChange={this.changesUser} required></textarea>
                    </div>
                    <input type="submit" className="btn btn-primary btn-md" style={{margin:'10px',marginLeft:'20px'}} disabled={this.state.value} value="Submit"/>
                    </form>
						</div>
					</div>


			</div>




			)
	}
}
SupportManagementDesc.contextTypes = {
    router: PropTypes.object.isRequired
}
export default SupportManagementDesc
