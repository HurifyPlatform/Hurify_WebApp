import React from 'react'
import styles from './MainHeader.css'
import ModalStore from './../../stores/ModalStore'
import Support from './../Support/Support'

const MainHeader = (props) => {
  return (
   <nav className="navbar navbar-inverse navbar-fixed-top" style={{backgroundColor:'transparent',borderColor:'transparent', color:'#fff'}}>
    <div className="container-fluid" style={{paddingLeft:'30px',paddingRight:'30px',marginTop:'15px'}}>
      <div className="navbar-header">
        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar2">
          <span className="sr-only">Toggle navigation</span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
          <span className="icon-bar"></span>
        </button>
        <a className="navbar-brand" href="#"><img className="logo" src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png" alt="hurify" /></a>
      </div>
      <div id="navbar2" className="navbar-collapse collapse">
        <ul className="nav navbar-nav navbar-right">
            <li><a href="" onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('support', true)}} style={{color:'#ffffff'}}><span className="glyphicon glyphicon-share" style={{color:'#ffffff'}}></span> Support</a></li>
            <li><a href="https://ico.hurify.co/" style={{color:'#ffffff'}}><span className="glyphicon glyphicon-link" style={{color:'#ffffff'}}></span> HUR Crowdsale</a></li>
          	<li><a href="/register" style={{color:'#ffffff'}}><span className="glyphicon glyphicon-user" style={{color:'#ffffff'}}></span> Sign Up</a></li>
        	  <li><a href="/" style={{color:'#ffffff'}}><span className="glyphicon glyphicon-log-in" style={{color:'#ffffff'}}></span> Login</a></li>
        </ul>
      </div>
      <Support/>
    </div>

  </nav>
  )
}
export default MainHeader
