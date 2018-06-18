import React from 'react'
import styles from './Blogs.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')
const cookies = new Cookies();


class Blogs extends React.Component {
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
    <div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb',flex:'1', minHeight:'92vh',overFlowY:'scroll'}}>
			<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
				<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Blogs</label>
			</div>
        <div className="row" style={{marginTop:'40px',marginLeft:'30px',marginRight:'20px'}}>
        <div className="col-md-6">
          <div className={styles.blogCard}>
            <div id={styles.photo} className={styles.photo4}></div>
            <ul className={styles.details}></ul>
            <div className={styles.description} style={{textAlign:'center'}}>
              <h1>Ex-Intel Veterans are Launching Hurify Platform and ICO to Disrupt the USD 75 Billion IOT Services Marketplace</h1>
              <p className={styles.summary}>Hurify Inc., incorporated in Halifax, Canada has launched</p>
              <a href="https://medium.com/@Hurify/what-drawbacks-does-hurify-address-in-iot-marketplace-723fd0b0a2c" target="_blank">...</a>
            </div>
        </div>
        </div>
        <div className="col-md-6">
            <div className={styles.blogCard}>
                <div id={styles.photo} className={styles.photo1}></div>
                <ul className={styles.details}></ul>
                <div className={styles.description} style={{textAlign:'center',color:'#000000'}}>
                  <h1>Hurify Platform Development Status Updates</h1>
                  <p className={styles.summary}>Hurify — A Decentralized smart contract platform that aims to connect clients and developers to build innovative IoT products/solutions. </p>
                  <a href="https://medium.com/@Hurify/what-drawbacks-does-hurify-address-in-iot-marketplace-723fd0b0a2c" target="_blank">...</a>
                </div>
            </div>
        </div>

        </div>

        <div className="row" style={{marginTop:'20px',marginLeft:'30px',marginRight:'20px'}}>
        <div className="col-md-6">
          <div className={styles.blogCard}>
            <div id={styles.photo} className={styles.photo2}></div>
            <ul className={styles.details}></ul>
            <div className={styles.description} style={{textAlign:'center'}}>
              <h1>Hurify Platform Overview: A Decentralized Smart Contract driven platform for IoT Solution Development</h1>
              <p className={styles.summary}>IoT is one of the major industrial revolutions  </p>
              <a href="https://medium.com/@Hurify/hurify-platform-overview-a-decentralized-smart-contract-driven-platform-for-iot-solution-89ff636354b4" target="_blank">...</a>
            </div>
        </div>
        </div>
            <div className="col-md-6">
                <div className={styles.blogCard}>
                    <div id={styles.photo} className={styles.photo4}></div>
                    <ul className={styles.details}></ul>
                    <div className={styles.description} style={{textAlign:'center'}}>
                      <h1>What Drawbacks does Hurify address in IoT Marketplace</h1>
                      <p className={styles.summary}>IoT is still a nascent technology domain, and many companies have yet to start their IoT journey to drive smarter business operations,</p>
                      <a href="https://medium.com/@Hurify/what-drawbacks-does-hurify-address-in-iot-marketplace-723fd0b0a2c" target="_blank">...</a>
                    </div>
                </div>
            </div>
        </div>

   </div>
 );
}
}
Blogs.contextTypes = {
  router: PropTypes.object.isRequired
}
export default Blogs
