import React from 'react'
import styles from './Notifications.css'



class Notifications extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token:'',
				userId:''
		}

	}

	}
	componentWillMount() {
		this.state.params.token = crypt.decrypt(cookies.get('token'))
		this.state.params.userId = crypt.decrypt(cookies.get('UserID'))
		AuthLayer.attemptLogin(this.state.user)
		.then(response => {
			 // alert(JSON.stringify(response.data))
				if (response.data.success){

				} else {

				 }
		})
	}
	NotificationsList() {

	}

	render(){
		return(

			<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
				<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
					<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 30px'}}>Notifications</label>
				</div>
				<div className={styles.well} style={{margin:'0px 50px 50px 50px'}}>

					<div style={{margin:'10px',padding:'0px 5px 0px 5px', borderRadius: '2px'}}>
							<div className="row">
								<div className="col-md-12">

								</div>
								<div className="table-responsive" style={{border:'2px solid #18384b'}}>

								<table class="table table-striped" className={styles.table1}>
								    <thead>
								    <tr>
								        <th className={styles.th} style={{width:'5%', float:'left'}}>S.No</th>
								        <th className={styles.th} style={{width:'25%', float:'left'}}>Project Name</th>
								        <th className={styles.th} style={{width:'15%', float:'left'}}>From</th>
								        <th className={styles.th} style={{width:'40%', float:'left'}}>Notifications</th>
								        <th className={styles.th} style={{width:'10%', float:'left'}}>Date</th>
								        <th className={styles.th} style={{width:'5%', float:'left'}}>Delete</th>
								    </tr>
								    </thead>
								    <tbody className={styles.tbody}>
								    <tr>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}>1</td>
								        <td className="filterable-cell" style={{width:'25%', float:'left'}}>Solidity4y54etyrr tytytytry yrty tyrty tytry ICO/Token Sale Audit needed</td>
								        <td className="filterable-cell" style={{width:'15%', float:'left'}}>Padmanabham Pakki</td>
								        <td className="filterable-cell" style={{width:'40%', float:'left'}}>The .table-hover class enables a hover state on table rows:</td>
								        <td className="filterable-cell" style={{width:'10%', float:'left'}}>1 day ago</td>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}}><span className="glyphicon glyphicon-trash"></span> </button></td>
								    </tr>
								    <tr>
								      	<td className="filterable-cell" style={{width:'5%', float:'left'}}>2</td>
								        <td className="filterable-cell" style={{width:'25%', float:'left'}}>Solidity ICO/Token Sale Audit needed</td>
								        <td className="filterable-cell" style={{width:'15%', float:'left'}}>Padmanabham Pakki</td>
								        <td className="filterable-cell" style={{width:'40%', float:'left'}}>The .table-hover class enables a hover state on table rows:</td>
								        <td className="filterable-cell" style={{width:'10%', float:'left'}}>1 day ago</td>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}}><span className="glyphicon glyphicon-trash"></span> </button></td>
								    </tr>
								    <tr>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}>3</td>
								        <td className="filterable-cell" style={{width:'25%', float:'left'}}>Solidity ICO/Token Sale Audit needed</td>
								        <td className="filterable-cell" style={{width:'15%', float:'left'}}>Padmanabham Pakki</td>
								        <td className="filterable-cell" style={{width:'40%', float:'left'}}>The .table-hover class enables a hover state on table rows:</td>
								        <td className="filterable-cell" style={{width:'10%', float:'left'}}>1 day ago</td>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}}><span className="glyphicon glyphicon-trash"></span> </button></td>
								    </tr>
								     <tr>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}>4</td>
								        <td className="filterable-cell" style={{width:'25%', float:'left'}}>Solidity ICO/Token Sale Audit needed</td>
								        <td className="filterable-cell" style={{width:'15%', float:'left'}}>Padmanabham Pakki</td>
								        <td className="filterable-cell" style={{width:'40%', float:'left'}}>The .table-hover class enables a hover state on table rows:</td>
								        <td className="filterable-cell" style={{width:'10%', float:'left'}}>1 day ago</td>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}}><span className="glyphicon glyphicon-trash"></span> </button></td>
								    </tr>
								    <tr>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}>5</td>
								        <td className="filterable-cell" style={{width:'25%', float:'left'}}>Solidity ICO/Token Sale Audit needed</td>
								        <td className="filterable-cell" style={{width:'15%', float:'left'}}>Padmanabham Pakki</td>
								        <td className="filterable-cell" style={{width:'40%', float:'left'}}>The .table-hover class enables a hover state on table rows:</td>
								        <td className="filterable-cell" style={{width:'10%', float:'left'}}>1 day ago</td>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}}><span className="glyphicon glyphicon-trash"></span> </button></td>
								    </tr>
								    <tr>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}>6</td>
								        <td className="filterable-cell" style={{width:'25%', float:'left'}}>Solidity ICO/Token Sale Audit needed</td>
								        <td className="filterable-cell" style={{width:'15%', float:'left'}}>Padmanabham Pakki</td>
								        <td className="filterable-cell" style={{width:'40%', float:'left'}}>The .table-hover class enables a hover state on table rows:</td>
								        <td className="filterable-cell" style={{width:'10%', float:'left'}}>1 day ago</td>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}}><span className="glyphicon glyphicon-trash"></span> </button></td>
								    </tr>
								    <tr>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}>7</td>
								        <td className="filterable-cell" style={{width:'25%', float:'left'}}>Solidity ICO/Token Sale Audit needed</td>
								        <td className="filterable-cell" style={{width:'15%', float:'left'}}>Padmanabham Pakki</td>
								        <td className="filterable-cell" style={{width:'40%', float:'left'}}>The .table-hover class enables a hover state on table rows:</td>
								        <td className="filterable-cell" style={{width:'10%', float:'left'}}>1 day ago</td>
								        <td className="filterable-cell" style={{width:'5%', float:'left'}}><button type="button" className="btn btn-primary btn-xs" style={{color:'#14317f',backgroundColor: '#ffffff',marginLeft:'10px'}}><span className="glyphicon glyphicon-trash"></span> </button></td>
								    </tr>

								    </tbody>
    							</table>

								</div>
							</div>
					</div>
				</div>
			</div>
		)
	}
}

export default Notifications
