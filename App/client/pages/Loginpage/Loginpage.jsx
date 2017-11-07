import React from 'react'
import YouTube from 'react-youtube'
import MainHeader from './../../components/MainHeader/MainHeader'
import styles from './Loginpage.css'
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import ForgotPassword from './../../components/ForgotPassword/ForgotPassword'
import ModalStore from './../../stores/ModalStore'
import NewPassword from './../../components/ForgotPassword/NewPassword'
import ResendEmailConfirmation from './../../components/ResendEmailConfirmation/ResendEmailConfirmation'


$(document).ready(function(){
	$('.navbar-inverse').css('background-color', 'transparent');
   var scroll_start = 0;
   var startchange = $('#startchange');
   var offset = startchange.offset();
    if (startchange.length){
   $(document).scroll(function() {
      scroll_start = $(this).scrollTop();
      if(scroll_start > offset.top) {
          $(".navbar-inverse").css('background-color', '#0F6EAD');
					$(".logo").css('width', '100px');
       } else {
          $('.navbar-inverse').css('background-color', 'transparent');
					$(".logo").css('width', '125px');
       }
   });
    }
});

const opts = {
height: '290',
width: '550',
playerVars: { // https://developers.google.com/youtube/player_parameters
autoplay: 0
}
};

	class Loginpage extends React.Component{
		constructor(props){
		super(props)
		this.state = {

						user: {
	        	email: '',
		        password: '',
						captcha: '',
      		}
    	}
		this.LoginClick = this.LoginClick.bind(this);
		this.changeUser = this.changeUser.bind(this);
		this.changeCaptcha = this.changeCaptcha.bind(this);
	}
  componentWillMount() {
        if (localStorage.getItem('token') !== null) {
					if (localStorage.getItem('account_type') == "client") {
						this.context.router.push('/dashboard/clientviewprofile')
					}
					else if (localStorage.getItem('account_type') == "developer") {
						this.context.router.push('/dashboard/developerviewprofile')
					}
					else {
						this.context.router.push('/dashboard')
					}

  			}
				else {

				}

  }
  LoginClick(event)
  	{
  		event.preventDefault();
  		console.log(this.state.user)
  		if (this.state.user.email.length == 0) {
  			alert('Please enter your email')
  		}
  		else if (this.state.user.password.length == 0) {
  			alert('Please enter password')
  		}
  		// else if (this.state.user.captcha.length == '') {
  		// 	alert('Please validate Recaptcha')
  		// }
  		else {
  	    	AuthLayer.attemptLogin(this.state.user)
  	    	.then(response => {
  	    		// (JSON.stringify(response.data))
  	      		if (response.data.success){
  	        		this.setState({
  	          			status: response.status,
  	          			message: response.data.message,
  	          			errors: response.data.errors
  	        		})
  							UserStore.setToken(response.data.data.token)
  							localStorage.setItem('token', response.data.data.token)
								UserStore.setEmail(response.data.data.user.email)
  							localStorage.setItem('email', response.data.data.user.email)
  							UserStore.setUserID(response.data.data.user.id)
  							localStorage.setItem('UserID', response.data.data.user.id)
  							console.log(localStorage.getItem('UserID'));
								UserStore.setUserID(response.data.data.user.userAccountType)
  							localStorage.setItem('account_type', response.data.data.user.userAccountType)
								console.log(localStorage.getItem('account_type'));
  							if (response.data.data.user.userAccountType == null) {
  								this.context.router.push('/dashboard')
  							}
								else if (response.data.data.user.userAccountType == "client") {
									this.context.router.push('/dashboard/clientviewprofile')
								}
  							else if (response.data.data.user.userAccountType == "developer") {
  								this.context.router.push('/dashboard/developerviewprofile')
  							}

  	      		} else {
  	      			alert(JSON.stringify(response.data))
                alert('Failed to Login, Please contact Hurify Support!')
              }
  	    	})
  		}
  	}
  	changeUser(event) {
  		console.log(event.target.value)
      	const field = event.target.name
      	const user = this.state.user
      	user[field] = event.target.value
  			this.setState({user})
    	}
  	changeCaptcha(key) {
  			console.log(key);
  			const user = this.state.user
      	user.captcha = key
      	this.setState({user})
  			console.log(user);
  	}

		render() {
  return (
  		<div className="main">
  			<MainHeader />
  			<div className="container-fluid" style={{paddingTop:'8%', margin:'0px 30px'}} id="startchange">
  				<div className="row">
  					<div className="col-sm-8">
              <h4 className={styles.content}>Hurify Inc. founded by Ex-Intel veterans, is an Ethereum based decentralized platform that facilitates IoT Developers to monetize their IoT hardware resources and services via Smart Contracts. Hurify is powered by Ethereum ERC20 standard HUR Tokens. This is Hurify Beta, MVP of the platform that can be used for testing and available for product demo on the Ethereum test network.</h4>
              <div className="row">
              <div className="col-sm-2"></div>
              <div className="col-sm-8"style={{margin:'20px'}}>
                <iframe className="embed-responsive-item" style={{width:'460px', height:'260px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/9606CJmMYHA" frameborder="0" allowfullscreen></iframe></div>
              <div className="col-sm-2"></div>

              </div>
            </div>
						<div className="col-sm-4" style={{marginTop:'32px'}}>
				      <form onSubmit={this.LoginClick}>
				        <div className={styles.loginMain}>
				            <input type="email" placeholder="Username" name="email" className={styles.box1} onChange={this.changeUser} />
				            <input type="password" placeholder="Password" name="password" className={styles.box2} onChange={this.changeUser} />
				            <input type="submit" className={styles.send} value="Login" />
				            <p className={styles.forget}>Forgot Your Password?<a href="#forgot" onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('forgot', true)}} className={styles.link}> click here</a></p>
										<p className={styles.forget}>Resend Email Confirmation?<a href="#confirm" onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('confirm', true)}} className={styles.link}> click here</a></p>
				            <p className={styles.forget}>Not Registered?<a href="/register" className={styles.link}> Create an Account</a></p>
				        </div>
				     </form>
    	 		</div>
					<ForgotPassword/>
					<NewPassword/>
					<ResendEmailConfirmation/>
  				</div>
			</div>
			<div className={styles.stars}></div>
			<div className={styles.stars1}></div>
			<div className={styles.stars2}></div>
			<div className={styles.shootingstars}></div>
		</div>
  )}
}
Loginpage.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Loginpage
