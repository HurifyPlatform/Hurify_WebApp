import React from 'react'
import styles from './ProductVideos.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')
const cookies = new Cookies();


class ProductVideos extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
				token:'',
				email:'',
				userId:''
  }
}
}
componentWillMount() {
	// const user = this.state.params
	// user["token"] = crypt.decrypt(cookies.get('token'))
	// user["email"] = crypt.decrypt(cookies.get('email'))
	// user['userId'] = crypt.decrypt(cookies.get('UserID'))
	// this.setState({user})
	// AuthLayer.checkKYCdata(this.state.params)
	// 		.then(response => {
	// 			if (response.data.success) {
	// 				if (response.data.data.success) {
  //
	// 				}
	// 				else {
	// 					this.context.router.push("/dashboard/kycform")
	// 				}
	// 			}
	// 			else {
  //
	// 			}
	// })
}
render(){
  return(
    <div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
			<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
				<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>DEMO VIDEOS</label>
			</div>
				<div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
          <div className="row" style={{margin:'10px',padding:'20px 15px 20px 10px',textAlign:'center'}}>

            <div className="row" style={{marginTop:'5'}}>
						<div className="col-md-4" style={{marginTop:'20px'}}>
						<p style={{textAlign:'left',fontSize:'20px',marginBottom:'20px',fontWeight:'700'}}>STEP-1:</p>
              <iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/Dy9bnmCPvZM" frameborder="0" allowfullscreen></iframe>
              <p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Installing MetaMask</p>
            </div>
            <div className="col-md-4" style={{marginTop:'20px'}}>
						<p style={{textAlign:'left',fontSize:'20px',marginBottom:'20px',fontWeight:'700'}}>STEP-2:</p>
              <iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/0NFUzgUg04Y" frameborder="0" allowfullscreen></iframe>
              <p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Getting HUR Token On Rinkeby</p>
            </div>
              <div className="col-md-4" style={{marginTop:'20px'}}>
							<p style={{textAlign:'left',fontSize:'20px',marginBottom:'20px',fontWeight:'700'}}>STEP-3:</p>
                <iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/nz95mp4_OPs" frameborder="0" allowfullscreen></iframe>
                <p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Registration & Login</p>
              </div>
            </div>
            <div className="row" style={{marginTop:'25'}}>
						<div className="col-md-4" style={{marginTop:'20px'}}>
						<p style={{textAlign:'left',fontSize:'20px',marginBottom:'20px',fontWeight:'700'}}>STEP-4:</p>
							<iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/qrakF6pLR1Y" frameborder="0" allowfullscreen></iframe>
							<p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Client Profile Creation</p>
						</div>
						<div className="col-md-4" style={{marginTop:'20px'}}>

							<iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block',marginTop:'48px'}} src="https://www.youtube-nocookie.com/embed/m_sIZ71nCK4" frameborder="0" allowfullscreen></iframe>
							<p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Developer Profile Creation</p>
						</div>

            </div>
						<div className="row" style={{marginTop:'25'}}>
						<div className="col-md-4" style={{marginTop:'20px'}}>
						<p style={{textAlign:'left',fontSize:'20px',marginBottom:'20px',fontWeight:'700'}}>STEP-5:</p>
							<iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/Gim46SLFcHU" frameborder="0" allowfullscreen></iframe>
							<p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Client Project Submission</p>
						</div>
						<div className="col-md-4" style={{marginTop:'20px'}}>
							<iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block',marginTop:'48px'}} src="https://www.youtube-nocookie.com/embed/koqyMMtM4Ts" frameborder="0" allowfullscreen></iframe>
							<p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Developer Applying to a Project</p>
						</div>
						</div>
						<div className="row" style={{marginTop:'25'}}>
						<div className="col-md-4" style={{marginTop:'20px'}}>
						<p style={{textAlign:'left',fontSize:'20px',marginBottom:'20px',fontWeight:'700'}}>STEP-6:</p>
							<iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/gOsDlinGRfw" frameborder="0" allowfullscreen></iframe>
							<p style={{fontSize:'1.4em',marginTop:'15px',width:'300px'}}>Client – Developer Negotiation and Escrow Deployment</p>
						</div>
						</div>
          </div>
        </div>
   </div>
  )
}
}
ProductVideos.contextTypes = {
  router: PropTypes.object.isRequired
}
export default ProductVideos
