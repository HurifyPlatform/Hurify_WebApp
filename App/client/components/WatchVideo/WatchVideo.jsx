import React from 'react'
import styles from './WatchVideo.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')
const cookies = new Cookies();


class WatchVideo extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			params: {
  }
}
}
componentWillMount() {

}
render(){
  return(
    <div className="row" style={{padding:'100px 50px 50px 50px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
        <div className={styles.well}>
          <div className="row" style={{margin:'10px',padding:'20px 15px 20px 10px',textAlign:'center'}}>
            <h5 style={{fontSize:'2em'}}>PLATFORM VIDEO DEMO</h5>
            <div className="row" style={{marginTop:'35'}}>
            <div className="col-md-4" style={{marginTop:'20px'}}>
              <iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/Dy9bnmCPvZM" frameborder="0" allowfullscreen></iframe>
              <p style={{fontSize:'1.4em',marginTop:'15px'}}>Installing MetaMask</p>
            </div>
            <div className="col-md-4" style={{marginTop:'20px'}}>
              <iframe className="embed-responsive-item" style={{width:'300px', height:'200px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/0NFUzgUg04Y" frameborder="0" allowfullscreen></iframe>
              <p style={{fontSize:'1.4em',marginTop:'15px'}}>Getting HUR Token On Rinkeby</p>
            </div>
            </div>
          </div>
        </div>
   </div>
  )
}
}
WatchVideo.contextTypes = {
  router: PropTypes.object.isRequired
}
export default WatchVideo
