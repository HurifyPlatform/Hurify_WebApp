import React from 'react'
import YouTube from 'react-youtube'
import MainHeader from './../../components/MainHeader/MainHeader'
import styles from './../../pages/Loginpage/Loginpage.css'
import styles1 from './../../pages/RegisteredPage/RegisteredPage.css'
import $ from "jquery";
import PropTypes from 'prop-types'
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import AlertContainer from 'react-alert'
import validator from 'validator'
import Support from './../../components/Support/Support'
import ModalStore from './../../stores/ModalStore'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios'
const config = require('./../../../config/index.js')
import {Navbar, Header, Brand, Toggle, Collapse} from 'react-bootstrap'
import { browserHistory } from 'react-router'

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
$(window, document, undefined).ready(function() {

  $('input').blur(function() {
    //alert("hai");
    var $this = $(this);
    if ($this.val())
      $this.addClass('used');
    else
      $this.removeClass('used');
  });

  var $ripples = $('.ripples');

  $ripples.on('click.Ripples', function(e) {

    var $this = $(this);
    var $offset = $this.parent().offset();
    var $circle = $this.find('.ripplesCircle');

    var x = e.pageX - $offset.left;
    var y = e.pageY - $offset.top;

    $circle.css({
      top: y + 'px',
      left: x + 'px'
    });

    $this.addClass('is-active');

  });

  $ripples.on('animationend webkitAnimationEnd mozAnimationEnd oanimationend MSAnimationEnd', function(e) {
    $(this).removeClass('is-active');
  });

});

const opts = {
height: '290',
width: '550',
playerVars: { // https://developers.google.com/youtube/player_parameters
autoplay: 0
}
};
class RegisteredPage extends React.Component{
	alertOptions = {
	offset: 20,
	position: 'top right',
	theme: 'light',
	time: 5000,
	transition: 'scale'
}
	constructor(props){
			super(props)
			this.state = {
	      		user: {
		        	email: '',
			        password: '',
			        retype_password: '',
							referralCode:'',
							captcha: '',
							captchaToken:'',
							text:''
	      		},
						value:false,
						infoDisplay:'none',
	          countryBlockDisplay:'none',
						cap:''

	    	}
			this.SignupClick = this.SignupClick.bind(this);
			this.changeUser = this.changeUser.bind(this);
			this.changeCaptcha = this.changeCaptcha.bind(this);
		}
		componentWillMount() {

			AuthLayer.getCaptcha()
			.then(response => {
				//alert(response.data);
					if (response.data.success){
					//console.log(JSON.stringify(response.data.data))
					const user =  this.state.user
					user['captcha'] = response.data.data.data
					user['captchaToken'] = response.data.data.captchaToken
					this.setState({user})
					//return response.data.data.data
				 }
			})
					// console.log(this.props);
					// const user = this.state.user
					// if (this.props.params.token == "undefined") {
					// 	user['referralCode'] = ""
					// }
					// else {
					// 	user['referralCode'] = this.props.params.token
					// }
					// this.setState({user})
					// $('#referralCode').onfocus();
					axios.get("https://api.ipify.org?format=json", {
	            validateStatus: () => true
	        }).then(result => {
	            axios.get("https://ipapi.co/" + result.data.ip + "/json/", {
	                validateStatus: () => true
	            }).then(result => {
	                if (result.data.country == "Canada") {
	                  this.setState({
	                    infoDisplay:'none',
	                    countryBlockDisplay:'block'
	                  })
	                }
	                else {
	                  this.setState({
	                    infoDisplay:'block',
	                    countryBlockDisplay:'none'
	                  })
	                }
	            }).catch(err => {
	              this.setState({
	                infoDisplay:'none',
	                countryBlockDisplay:'block'
	              })
	            })
	        })


				}
				getCaptchaReload(){
					AuthLayer.getCaptcha()
					.then(response => {
						//alert(response.data);
							if (response.data.success){
							console.log(JSON.stringify(response.data.data))
							const user =  this.state.user
							user['captcha'] = response.data.data.data
							user['captchaToken'] = response.data.data.captchaToken
							this.setState({user})
							//return response.data.data.data
						 }
					})
				}
		SignupClick(event)
			{
				this.setState({
					value:true
				})
				event.preventDefault();
				if(this.state.user.email == null || this.state.user.email == ''){
					this.setState({
						value:false
					})
					alert('Please Enter Email')
					this.getCaptchaReload()
					//console.log(JSON.stringify(this.state.user))
				}
				else if (this.state.user.password == null || this.state.user.password == '') {
					this.setState({
						value:false
					})
					alert('Please Enter Password')
					this.getCaptchaReload()
				}
				else if (this.state.user.password != this.state.user.retype_password) {
					const user = this.state.user
					user['password'] = ''
					user['retype_password'] = ''
					this.setState({
						user:user,
						value:false
					})
					alert('Password mismatch')
					this.getCaptchaReload()

				}
				else if (this.state.user.text == null || this.state.user.text == '') {
					const user = this.state.user
					user['password'] = ''
					user['retype_password'] = ''
					this.setState({
						user:user,
						value:false
					})
					alert('Enter captcha')
					this.getCaptchaReload()
				}
				// else if (this.state.user.captcha.length == '') {
				// 	this.setState({
				// 		value:false
				// 	})
				// 	alert('Please validate Recaptcha')
				// }
				else {
				if (this.state.user.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
					AuthLayer.attemptSignUp(this.state.user)
					.then(response => {
						if (response.data.success){
							alert("Account created successfully, please check your email to confirm account creation!")
							this.context.router.push('/')
					} else {
						// alert(JSON.stringify(response.data.error))
						this.setState({
							value:false
						})
						this.msg.show(response.data.error, {
								time: 5000,
								type: 'error'
							})
							this.getCaptchaReload()
					}
				})
				}
				else {
					this.setState({
						value:false
					})
					this.msg.show("Email is not valid", {
							time: 5000,
							type: 'error'
						})
				}
			}
		}
			alertmsg()
				{
					this.msg.show("Account created successfully, please check your email to confirm account creation!", {
							time: 5000,
							type: 'error'

						})
				}
	changeUser(event) {
					// console.log(event.target.value)
			    	const field = event.target.name
			    	const user =  this.state.user
			    	user[field] = event.target.value
					this.setState({user})
			  	}

					changeCaptcha(key) {
							const user = this.state.user
				    	user.captcha = key
				    	this.setState({user})
					}

					// renderGetCaptcha(){
					// 	//alert("hai")
					// 	return AuthLayer.getCaptcha()
					// 	.then(response => {
					// 		//alert(response.data);
					// 			if (response.data.success){
					// 			//console.log(JSON.stringify(response.data.data.data))
					// 			this.setState({cap:response.data.data.data})
					// 			return response.data.data.data
					// 		 }
					// 	})
					// }
	render() {
		//let Captcha = (this.state.cap.data);
		//console.log(JSON.stringify(this.state.user))
  return (
		<div className="main">
    <div style={{display:this.state.countryBlockDisplay,minHeight:'100vh',color:'#fff'}}>
      <img style={{marginLeft:'40%',marginRight:'50%',marginTop:'80px'}} src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png"/>
      <p style={{textAlign:'center',fontSize:'2.0em',paddingTop:'100px'}}>Sorry, Hurify Platform is not available for your country!!</p>
    </div>
      <div style={{display:this.state.infoDisplay}}>
      <Navbar>
          <Navbar.Header>
              <Navbar.Brand>
              <a href="#home"><img src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png"/></a>
              </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>
          <Navbar.Collapse>
        </Navbar.Collapse>
     </Navbar>
        <div className="container-fluid" style={{paddingTop:'1%', margin:'0px 20px'}} id="startchange">
      			<div className={styles.landingPageDiv}>
              <div style={{margin:'0px'}}>
                <div className={styles.landingPageLogin}>
                    <form action="#" onSubmit={this.SignupClick}>
                      <div className="form-group">
                        <label for="email" style={{color:'#ccc'}}>Email</label>
                        <input type="email" value={this.state.user.email} className="form-control" id="email" name="email" onChange={this.changeUser} required/>
                      </div>
                      <div className="form-group">
                        <label for="pwd" style={{color:'#ccc'}}>Password:</label>
                        <input type="password" value={this.state.user.password} className="form-control" id="pwd" name="password" minLength='6' onChange={this.changeUser} required/>
                      </div>
											<div className="form-group">
                        <label for="pwd" style={{color:'#ccc'}}>Confirm Password:</label>
                        <input type="password" value={this.state.user.retype_password} className="form-control" id="pwd" name="retype_password" minLength='6' onChange={this.changeUser} required/>
                      </div>
											<div className={styles1.rec} style={{display:'none'}}>
												<ReCAPTCHA sitekey={config.recaptcha_siteKey} onChange={this.changeCaptcha}/>
											</div>
											<div className="row text-left">
												<div className="col-md-6" style={{margin:'0px'}}>
													<div className="form-group">
														<label for="text" style={{color:'#ccc'}}>Enter Captcha</label>
														<input type="text" value={this.state.user.text} className="form-control" id="text" name="text" onChange={this.changeUser} required/>
													</div>
												</div>
												<div className="col-md-6" style={{margin:'15px 0px 0px 0px',paddingLeft:'5px',height:'50px', backgroundColor:'#c9c1b9', width:'120px', borderRadius:'10px'}}>
													<div dangerouslySetInnerHTML={{ __html: this.state.user.captcha	}} />
												</div>
											</div>
                      <div className="row" style={{paddingTop:'5px'}}>
                        <div className="col-md-6 col-sm-6 col-xs-12 text-center" style={{padding:'5px 5px'}}><button type="submit" className="btn btn-default btn-md" id={styles.LandingButton} style={{width:'100px'}} disabled={this.state.value} onClick={this.SignupClick}>SignUp</button></div>
                        <div className="col-md-6 col-sm-6 col-xs-12 text-center" style={{padding:'5px 5px'}}><button type="submit" className="btn btn-default btn-md" id={styles.LandingButton} onClick={function(e) { e.preventDefault(); browserHistory.push('/')}}>Login</button></div>
                      </div>

                    </form>
                </div>
              </div>
            </div>
						<div className={styles1.pricacyAndTerms}>
	            <a href="#terms" onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('terms', true)}} style={{color:'#fff'}} target="_blank">Terms of Services </a><span style={{paddingLeft:'10px',paddingRight:'10px'}}> | </span>
	  					<a onClick={function(e) { e.preventDefault(); ModalStore.setDisplayed('privacy_policy', true)}} href="#privacy" style={{color:'#fff'}}> Privacy Policy</a>
	          </div>
    			</div>
        </div>
        <Support/>
        <AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
      </div>


		/*<div className="main">
    <div style={{display:this.state.countryBlockDisplay,minHeight:'100vh',color:'#fff'}}>
      <img style={{marginLeft:'40%',marginRight:'50%',marginTop:'80px'}} src="https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png"/>
      <p style={{textAlign:'center',fontSize:'2.0em',paddingTop:'100px'}}>Sorry, Hurify Platform is not available for your country!!</p>
    </div>
      <div style={{display:this.state.infoDisplay}}>
					<MainHeader />
					<div className="container-fluid" style={{paddingTop:'10%', margin:'0px 30px'}} id="startchange">
						<div className="row">
							<div className="col-md-8">
							<h4 className={styles.content}>Hurify is a platform to facilitate the development of Internet of Things (“IoT”) projects, including the matching of project owners with project managers and project development subcontractors, and hardware and software vendors within the IoT ecosystem. We combine global IoT development talent matching, smart contract-based IoT project management and e-commerce to facilitate IoT project development.</h4>
							<div className="row" style={{margin:'20px'}}>

								<div className="col-md-12 text-center" style={{backgroundColor:'rgb(255,255,255)', borderRadius:'10px', padding:'5px'}}>
									<h3 style={{color:'#000'}}>AS FEATURED ON</h3>
 	               <div className="row text-center">
 	                 <div className="col-md-4"><a href="http://www.livebitcoinnews.com/hurify-iot-projects-development/" target="_blank"><img className={styles.media} src={require("./../Loginpage/live.png")} style={{paddingTop:'30px'}}/></a></div>
 	                 <div className="col-md-4"><a href="https://btcmanager.com/hurify-decentralized-blockchain-platform-revolutionizing-iot/" target="_blank"><img className={styles.media} src={require("./../Loginpage/btc.png")}/></a></div>
 	                 <div className="col-md-4"><a href="https://www.huffingtonpost.com/entry/hurify-is-the-decentralized-blockchain-platform-that_us_5a4fe87ae4b0ee59d41c0a8e" target="_blank"><img className={styles.media} src={require("./../Loginpage/huffpost.png")} style={{paddingTop:'20px'}}/></a></div>
 	               </div>
 	               <div className="row text-center">
 	                 <div className="col-md-4"><a href="https://pressreleasejet.com/news/hurify-poised-to-disrupt-iot-with-coming-ico.html" target="_blank"><img className={styles.media} src={require("./../Loginpage/press.png")}/></a></div>
 	                 <div className="col-md-4"><a href="http://www.prweb.com/releases/2017/12/prweb14966422.htm" target="_blank"><img className={styles.media} src={require("./../Loginpage/Cision.png")}/></a></div>
 	                 <div className="col-md-4"><a href="http://canadianbusinesstribune.com/pr/ex-intel-veterans-are-launching-hurify-platform-and-ico-to-disrupt-the-usd-75-billion-iot-services-marketplace/21150" target="_blank"><img className={styles.media} src={require("./../Loginpage/canadianbusinesstribune.png")} style={{paddingTop:'20px'}}/></a></div>
 	               </div>
 	               <div className="row text-center">
 	               </div>
								 <div className="row text-center">
	                 <div className="col-md-4"><a href="https://coinpost.news/hurify-wants-to-better-the-iot-industry/" target="_blank"><img className={styles.media} src={require("./../Loginpage/coin_logo.png")} style={{paddingTop:'30px'}}/></a></div>
	                 <div className="col-md-4"><a href="http://dailytelescope.com/pr/hurify-poised-to-disrupt-iot-with-coming-ico/28543" target="_blank"><img className={styles.media} src={require("./../Loginpage/daily-telescope.png")}/></a></div>
	                 <div className="col-md-4"><a href="https://www.investinblockchain.com/what-is-hurify/" target="_blank"><img className={styles.media} src={require("./../Loginpage/Invest-in-Blockchain1.png")} style={{paddingTop:'20px'}}/></a></div>
	               </div>
 	 						</div>

								</div>
							</div>
							<div className="col-md-4">
							        	<form className={styles.form} onSubmit={this.SignupClick} style={{height:'490px'}}>
							              <div className={styles.group}>
							                <input type="email" className={styles.input} name="email" onChange={this.changeUser} required/><span className={styles.highlight}></span><span className={styles.bar}></span>
							                <label className={styles.label}>Email</label>
							              </div>
							              <div className={styles.group}>
							                <input type="password" className={styles.input} name="password" minLength='6' onChange={this.changeUser} required/><span className={styles.highlight}></span><span className={styles.bar}></span>
							                <label className={styles.label}>Password</label>
							              </div>
							              <div className={styles.group}>
							                <input type="password" className={styles.input} name="retype_password" minLength='6' onChange={this.changeUser} required/><span className={styles.highlight}></span><span className={styles.bar}></span>
							                <label className={styles.label}>Confirm Password</label>
							              </div>
														<div className={styles1.rec}>
															<ReCAPTCHA sitekey={config.recaptcha_siteKey} onChange={this.changeCaptcha}/>
														</div>
							              <input type="Submit" className="btn btn-primary btn-md" id={styles1.button} disabled={this.state.value} defaultValue="SignUp">
							              </input>
														<p className={styles1.forget}>Already have an account?<a href="/" className={styles1.link}> Login</a></p>
							            </form>
							        </div>

		  				</div>
							<Support/>
							<AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
							<p style={{textAlign:'center',color:'#fff'}}>
							<a href="https://platform.hurify.co/termsofservice" style={{color:'#fff'}} target="_blank">Terms of Services </a><span style={{paddingLeft:'10px',paddingRight:'10px'}}> | </span>
							<a href="https://platform.hurify.co/privacypolicy" style={{color:'#fff'}} target="_blank"> Privacy Policy</a></p>
					</div>
					<div className={styles.stars}></div>
					<div className={styles.stars1}></div>
					<div className={styles.stars2}></div>
					<div className={styles.shootingstars}></div>

				</div>
		</div>*/
  )
}
}
RegisteredPage.contextTypes = {
    router: PropTypes.object.isRequired
}
export default RegisteredPage
