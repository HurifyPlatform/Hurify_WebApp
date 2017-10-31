import React from 'react'
import YouTube from 'react-youtube'
import MainHeader from './../../components/MainHeader/MainHeader'
import styles from './../../pages/Loginpage/Loginpage.css'
import styles1 from './../../pages/RegisteredPage/RegisteredPage.css'
import $ from "jquery";
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'

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
class RegisteredPage extends React.Component{
	constructor(props){
			super(props)
			this.state = {
	      		user: {
		        	email: '',
			        password: '',
			        retype_password: '',
							captcha: ''
	      		}

	    	}
			this.SignupClick = this.SignupClick.bind(this);
			this.changeUser = this.changeUser.bind(this);
			this.changeCaptcha = this.changeCaptcha.bind(this);
		}

		SignupClick(event)
			{
				event.preventDefault();
				if ((!this.state.user.email.length) || (!this.state.user.password.length) || (!this.state.user.retype_password.length)) {
					alert('All fields are manditory, Please enter')
				}
				else if (this.state.user.password.length <= 5) {
					alert('Minimum password length should be 6 characters.')
				}
				else if (this.state.user.password != this.state.user.retype_password) {
					alert('Password and retype-password are not matched')
				}

				// else if (!this.state.user.captcha.length) {
				// 	alert('Please validate Recaptcha')
				// }
				else {
					console.log(this.state.user);
			    	AuthLayer.attemptSignUp(this.state.user)
			    	.then(response => {
							//alert(JSON.stringify(response))
			      	if (response.data.success){
			      		alert("Account created successfully, please check your email to confirm account creation!")
			        	this.setState({
			          	status: response.status,
			          	message: response.data.message,
			          	errors: response.data.errors
			        })
							this.context.router.push('/')
			      } else {
							alert(JSON.stringify(response.data.error))

			      }
			    })
			  	}

			}
			changeUser(event) {
					console.log(event.target.value)
			    	const field = event.target.name
			    	const user =  this.state.user
			    	user[field] = event.target.value
					this.setState({user})
			  	}

					changeCaptcha(key) {
							console.log(key);
							const user = this.state.user
				    	user.captcha = key
				    	this.setState({user})
					}
	render() {
  return (
  		<div className="main">
  			<MainHeader />
  			<div className="container-fluid" style={{paddingTop:'8%', margin:'0px 30px'}} id="startchange">
  				<div className="row">
  					<div className="col-sm-8">
              <h4 className={styles.content}>Hurify Inc. Head-Quartered in Halifax, Canada, is founded by Ex-Intel veterans. Hurify is an Ethereum based decentralized platform that facilitates IoT Developers to monetize their IoT hardware resources and services via Smart Contracts. Hurify is powered by Ethereum ERC20 standard HUR Tokens. This is Hurify Beta, MVP of the platform that can be used for testing and available for product demo on the Ethereum test network.</h4>
              <div className="row">
              <div className="col-sm-2"></div>
              <div className="col-sm-8"style={{margin:'20px'}}><iframe className="embed-responsive-item" style={{width:'460px', height:'260px', border:'none', display:'block'}} src="https://www.youtube-nocookie.com/embed/9606CJmMYHA" frameBorder="0" allowFullScreen></iframe></div>
              <div className="col-sm-2"></div>

              </div>
            </div>
						<div className="col-sm-4" style={{marginTop:'32px'}}>
							<form onSubmit={this.SignupClick}>
				        	<div className={styles1.loginMain}>
				            	<input type="email" placeholder="Email Address" name="email" className={styles1.box1} onChange={this.changeUser} />
				            	<input type="password" placeholder="Password" name="password" className={styles1.box2} onChange={this.changeUser} />
				            	<input type="password" placeholder="Conform Password" name="retype_password" className={styles1.box2} onChange={this.changeUser} />
				            	<input type="submit" className={styles1.send} value="SignUp" />
				                <p className={styles1.forget}>Already have an account?<a href="/" className={styles1.link}> Login</a></p>
				        	</div>
						 </form>
    			</div>
  				</div>
			</div>
			<div className={styles.stars}></div>
			<div className={styles.stars1}></div>
			<div className={styles.stars2}></div>
			<div className={styles.shootingstars}></div>
		</div>
  )
}
}
RegisteredPage.contextTypes = {
    router: PropTypes.object.isRequired
}
export default RegisteredPage
