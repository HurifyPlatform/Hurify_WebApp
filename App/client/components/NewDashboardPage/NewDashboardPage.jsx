import React from 'react'
import styles from './NewDashboardPage.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
import ProgressArc from 'progress-arc-component'
var crypt = require('./../../../config/crypt')



const cookies = new Cookies();
class NewDashboardPage extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token:'',
        userId:'',
				dropdownSelect:'topDevelopers',
				topDevelopers:[],
				topClients:[],
				topProjectsBasedOnPrice:[],
				topProjectsBasedOnBids:[],
				totalProjects:'',
				appliedProjects:'',
				approvedProjects:'',
				submittedProjects:'',
				developerSelectedProjects:''

		},
		developerProjectsDisplay:'none',
		clientsProjectsDisplay:'none',
		userProjectsDisplay:'none',
		projectsProgressPercentage:0,
		profilePercentage:0

  }
	this.changeUser = this.changeUser.bind(this);
}
componentWillMount() {
	const user = this.state.params
	user['token'] = crypt.decrypt(cookies.get('token'))
	user['userId'] = crypt.decrypt(cookies.get('UserID'))
	user['userId'] = crypt.decrypt(cookies.get('UserID'))
	this.setState({user})

	AuthLayer.bestRatedDevelopers(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
			user["topDevelopers"] = response.data.data
			this.setState({user})
		}

	})

	AuthLayer.bestRatedClients(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
			user["topClients"] = response.data.data
			this.setState({user})
		}

	})

	AuthLayer.topProjectsBasedOnBids(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
			user["topProjectsBasedOnBids"] = response.data.data
			this.setState({user})
		}

	})

	AuthLayer.topProjectsBasedOnPrice(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
			user["topProjectsBasedOnPrice"] = response.data.data
			this.setState({user})
		}

	})

	AuthLayer.profileCompleteness(this.state.params)
	.then(response => {
		if (response.data.success) {
			alert(JSON.stringify(response.data))
			this.setState({
				profilePercentage:response.data.data.profilePercentage
			})
		}
	})

	if (crypt.decrypt(cookies.get('account_type')) == "developer") {
		this.setState({
			developerProjectsDisplay:'block',
			clientsProjectsDisplay:'none',
			userProjectsDisplay:'none'
		})
		this.DeveloperDashboard();
	}
	else if (crypt.decrypt(cookies.get('account_type')) == "client") {
		this.setState({
			developerProjectsDisplay:'none',
			clientsProjectsDisplay:'block',
			userProjectsDisplay:'none'
		})
		this.ClientDashboard();
	}
	else {
		this.setState({
			developerProjectsDisplay:'none',
			clientsProjectsDisplay:'none',
			userProjectsDisplay:'block'
		})
		this.UserDashboard();
	}
}
DeveloperDashboard() {
	AuthLayer.developerDashboard(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
			const user = this.state.params
			user["totalProjects"] = response.data.data.totalProjects
			user["approvedProjects"] = response.data.data.clientsAcceptedDeveloper
			user["appliedProjects"] = response.data.data.appliedProjects
			this.setState({user})
			if ((response.data.data.clientsAcceptedDeveloper == 0) || (response.data.data.clientsAcceptedDeveloper == false)){
				this.setState({
					projectsProgressPercentage:0
				})
			}
			else {
				this.setState({
					projectsProgressPercentage:(response.data.data.projectsCompleted/response.data.data.clientsAcceptedDeveloper)*100
				})
			}


		}
	})
}
ClientDashboard() {
	AuthLayer.clientDashboard(this.state.params)
	.then(response => {
		if (response.data.success) {
			// alert(JSON.stringify(response.data))
			const user = this.state.params
			user["totalProjects"] = response.data.data.totalProjects
			user["submittedProjects"] = response.data.data.postedProjects
			user["developerSelectedProjects"] = response.data.data.developerSelectedForProjects
			this.setState({user})
			if ((response.data.data.developerSelectedForProjects == 0) || (response.data.data.developerSelectedForProjects == false)){
				this.setState({
					projectsProgressPercentage:0
				})
			}
			else {
				this.setState({
					projectsProgressPercentage:(response.data.data.projectsCompleted/response.data.data.developerSelectedForProjects)*100
				})
			}

		}
	})
}
UserDashboard() {
	AuthLayer.getAllProjectsCount(this.state.params)
	.then(response => {
		// alert(JSON.stringify(response.data))
		if (response.data.success) {
			const user = this.state.params
			user["totalProjects"] = response.data.data
			this.setState({user})
			this.setState({
				projectsProgressPercentage:0
			})
		}
	})
}
changeUser(event) {
	event.preventDefault();
	const field = event.target.name
	const user = this.state.params
	user[field] = event.target.value
	this.setState({user})
}
render(){
	var topList = '';
	var List = '';
	var profile = [];
	if (this.state.params.dropdownSelect == "topDevelopers") {
		List = this.state.params.topDevelopers
		for (var i = 0; i < List.length; i++) {
			if ((i.path == null) || (i.path == "")) {
				profile.push("https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png")
			}
			else {
				profile.push(i.path)
			}
		}
		topList =  List.map((i, index) =>
		<div className="row" style={{height:'15%',marginLeft:'0px'}}>
			<div className="col-md-3">
				<img className="logo" src={profile[index]} style={{height:'80%',borderRadius:'50%'}} alt="hurify" />
			</div>
			<label style={{paddingTop:'5px'}}>{i.name}</label>
			<p>{i.jobTitle}</p>
			<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
		</div>
		);
	}
	else if (this.state.params.dropdownSelect == "topClients") {
		List = this.state.params.topClients
		for (var i = 0; i < List.length; i++) {
			if ((i.path == null) || (i.path == "")) {
				profile.push("https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png")
			}
			else {
				profile.push(i.path)
			}
		}
		topList =  List.map((i, index) =>
		<div className="row" style={{height:'15%',marginLeft:'0px'}}>
			<div className="col-md-3">
				<img className="logo" src={profile[index]} style={{height:'80%',borderRadius:'50%'}} alt="hurify" />
			</div>
			<label style={{paddingTop:'5px'}}>{i.name}</label>
			<p>{i.jobTitle}</p>
			<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
		</div>
		);
	}
	else if (this.state.params.dropdownSelect == "topProjectsBasedOnBids") {
		List = this.state.params.topProjectsBasedOnBids
		topList =  List.map((i) =>
		<div className="row" style={{height:'15%',marginLeft:'0px'}}>
			<div className="col-md-3">
				<img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" style={{height:'80%',borderRadius:'50%'}} alt="hurify" />
			</div>
			<label style={{paddingTop:'5px'}}>{i.projectName}</label>
			<p>{i.technology}</p>
			<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
		</div>
		);
	}
	else if (this.state.params.dropdownSelect == "topProjectsBasedOnPrice") {
		List = this.state.params.topProjectsBasedOnPrice
		topList =  List.map((i) =>
		<div className="row" style={{height:'15%',marginLeft:'0px'}}>
			<div className="col-md-3">
				<img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" style={{height:'80%',borderRadius:'50%'}} alt="hurify" />
			</div>
			<label style={{paddingTop:'5px'}}>{i.projectName}</label>
			<p>{i.technology}</p>
			<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
		</div>
		);
	}

	// topList =  List.map((i, index) =>
	// <div className="row" style={{height:'15%',marginLeft:'0px'}}>
	// 	<div className="col-md-3">
	// 		<img className="logo" src={profile[index]} style={{height:'80%',borderRadius:'50%'}} alt="hurify" />
	// 	</div>
	// 	<label style={{paddingTop:'5px'}}>{i.name}</label>
	// 	<p>{i.jobTitle}</p>
	// 	<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
	// </div>
	// );
  return(
    <div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#eaeef1',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
      <div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
					<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Dashboard</label>
				</div>
			<div className="row" style={{margin:'0px 0px 120px 0px'}}>
				<div className="col-md-8" style={{padding:'0px'}}>
		      <div className="row">
		        <div className={styles.ProfileView}>
		          <label style={{margin:'10px 10px'}}>Profile completeness</label>
		          <hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
							<div style={{width:'100%',marginTop:'0px',paddingTop:'10px',textAlign:'center'}}>
								<ProgressArc value={this.state.profilePercentage} arcBackgroundColor="#eeb212" arcColor="#6f5827"/>
							</div>
		        </div>
		        {/*<div className={styles.BalanceView}>
		        <label style={{margin:'10px 10px'}}>Wallet Status</label>
		        <hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
						<p style={{marginLeft:'25px',marginTop:'30px'}}>Earnings :<span style={{marginLeft:'10px'}}>20 HUR</span></p>
						<p style={{marginLeft:'25px',marginTop:'30px'}}>Wallet Balance :<span style={{marginLeft:'10px'}}>2000 HUR</span></p>
		        </div>*/}
						<div className={styles.BalanceView} style={{display:'block'}}>
							<label style={{margin:'10px 10px'}}>Wallet Status</label>
							<hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
							<div className="row" style={{textAlign:'center',marginTop:'50px',marginBottom:'50px',marginLeft:'15px',marginRight:'15px'}}>
								<div className="col-md-6">
									<label style={{fontSize:'22px'}}>34</label>
									<p>Earnings in HUR</p>
								</div>
								<div className="col-md-6">
									<label style={{fontSize:'22px'}}>56</label>
									<p>Wallet Balance in HUR</p>
								</div>
							</div>
						</div>
		      </div>
					<div className="row" style={{paddingTop:'0px'}}>
						<div className={styles.ProjectView} style={{display:this.state.developerProjectsDisplay}}>
							<label style={{margin:'10px 10px'}}>Project Status</label>
							<hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
							<div className="row" style={{textAlign:'center',marginTop:'50px',marginBottom:'50px',marginLeft:'15px',marginRight:'15px'}}>
								<div className="col-md-4">
									<label style={{fontSize:'22px'}}>{this.state.params.totalProjects}</label>
									<p>Projects</p>
								</div>
								<div className="col-md-4">
									<label style={{fontSize:'22px'}}>{this.state.params.appliedProjects}</label>
									<p>Applied</p>
								</div>
								<div className="col-md-4">
									<label style={{fontSize:'22px'}}>{this.state.params.approvedProjects}</label>
									<p>Approved</p>
								</div>
							</div>
						</div>
						<div className={styles.ProjectView} style={{display:this.state.clientsProjectsDisplay}}>
							<label style={{margin:'10px 10px'}}>Project Status</label>
							<hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
							<div className="row" style={{textAlign:'center',marginTop:'50px',marginBottom:'50px',marginLeft:'15px',marginRight:'15px'}}>
								<div className="col-md-4">
									<label style={{fontSize:'22px'}}>{this.state.params.totalProjects}</label>
									<p>Projects</p>
								</div>
								<div className="col-md-4">
									<label style={{fontSize:'22px'}}>{this.state.params.submittedProjects}</label>
									<p>Submitted</p>
								</div>
								<div className="col-md-4">
									<label style={{fontSize:'22px'}}>{this.state.params.developerSelectedProjects}</label>
									<p>Approved</p>
								</div>
							</div>
						</div>
						<div className={styles.ProjectView} style={{display:this.state.userProjectsDisplay}}>
							<label style={{margin:'10px 10px'}}>Project Status</label>
							<hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
							<div className="row" style={{textAlign:'center',marginTop:'50px',marginBottom:'50px',marginLeft:'15px',marginRight:'15px'}}>
								<div className="col-md-12">
									<label style={{fontSize:'22px'}}>{this.state.params.totalProjects}</label>
									<p>Projects</p>
								</div>
							</div>
						</div>
						<div className={styles.CurrentProjectsView}>
						<label style={{margin:'10px 10px'}}>Current Projects</label>
						<hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
						<div style={{width:'100%',marginTop:'0px',paddingTop:'10px',textAlign:'center'}}>
							<ProgressArc value={this.state.projectsProgressPercentage} arcBackgroundColor="#12ee8e" arcColor="#257351"/>
						</div>
						</div>
					</div>
				</div>
				<div className="col-md-4" style={{padding:'0px'}}>
					<div className={styles.ListView}>
					<select className="form-control" id="sel1" name="dropdownSelect" placeholder="select country" onChange={this.changeUser} required>
						<option value="topDevelopers">Top Developers</option>
						<option value="topClients">Top Clients</option>
						<option value="topProjectsBasedOnBids">Top Projects based on Bid</option>
						<option value="topProjectsBasedOnPrice">Top Projects based on Price</option>
					</select>
					<hr style={{width:'100%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
					{/*{topList}*/}
					<div className="row" style={{height:'15%',marginLeft:'0px'}}>
						<div className="col-md-3">
							<img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" style={{height:'80%'}} alt="hurify" />
						</div>
						<label>Testing</label>
						<p>developer</p>
						<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
					</div>
					<div className="row" style={{height:'15%',marginLeft:'0px'}}>
						<div className="col-md-3" >
							<img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" style={{height:'80%'}} alt="hurify" />
						</div>
						<label>testing1</label>
						<p>developer</p>
						<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
					</div>
					<div className="row" style={{height:'15%',marginLeft:'0px'}}>
						<div className="col-md-3" >
							<img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" style={{height:'80%'}} alt="hurify" />
						</div>
						<label>testing2</label>
						<p>developer</p>
						<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
					</div>
					<div className="row" style={{height:'15%',marginLeft:'0px'}}>
						<div className="col-md-3" >
							<img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" style={{height:'80%'}} alt="hurify" />
						</div>
						<label>testing3</label>
						<p>developer</p>
						<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
					</div>
					<div className="row" style={{height:'15%',marginLeft:'0px'}}>
						<div className="col-md-3" >
							<img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" style={{height:'80%'}} alt="hurify" />
						</div>
						<label>testing4</label>
						<p>developer</p>
						<hr style={{width:'95%',align:'center', marginTop:'0px',marginBottom:'0px'}}/>
					</div>
					</div>
				</div>
			</div>
   </div>


  )
}
}

NewDashboardPage.contextTypes = {
  router: PropTypes.object.isRequired
}

export default NewDashboardPage
