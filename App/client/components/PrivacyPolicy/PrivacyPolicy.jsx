import React from 'react'
import styles from './PrivacyPolicy.css'
import PropTypes from 'prop-types'
import UserStore from './../../stores/UserStore'
import Cookies from 'universal-cookie';
import AuthLayer from './../../network/AuthLayer'
import MainHeader from './../../components/MainHeader/MainHeader'
var crypt = require('./../../../config/crypt')


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
const cookies = new Cookies();
class PrivacyPolicy extends React.Component {
	constructor(props) {
			super(props)
				this.state = {

		}
	}
		componentWillMount() {

		}

	render() {
	return(
    <div>
      <div className="" style={{backgroundColor:'#0F6EAD',flex: '1',minHeight: '100vh'}}>
        <MainHeader />
        <div className="container-fluid" style={{paddingTop:'8%', margin:'0px 0px'}} id="startchange">
  				<div className="row" style={{backgroundColor:'#fff',paddingBottom:'40px'}}>
            <h2 style={{textAlign:'center',fontSize:'33px'}}>PRIVACY POLICY</h2>
            <div className={styles.div}>
              <p className={styles.question}>What information do we collect?</p>
              <p className={styles.answer}>Hurify (“we”, “us”) collects information from clients (“you”) when you register on our site or fill out a form. When ordering or registering on our site, as appropriate, you may be asked to enter your: name and/or e-mail address. You may, however, visit our site anonymously.</p>
            </div>
            <div className={styles.div}>
              <p className={styles.question}>What do we use your information for?</p>
              <p className={styles.answer}>Any of the information we collect from you may be used in one of the following ways:</p>
              <ul style={{listStyleType:'disc',marginLeft:'70px',fontSize:'18px'}}>
                <li>To personalize your experience (your information helps us to be responsive to your individual needs).</li>
                <li>To improve our website (we continually strive to improve our website offerings based on the information and feedback we receive from you).</li>
                <li>To improve customer service (your information helps us to more effectively respond to your customer service requests and support needs).</li>
                <li>To process transactions.</li>
              </ul>
              <p className={styles.answer}>Your information, whether public or private, will not be sold, exchanged, transferred, or given to any other company for any reason whatsoever, without your consent, other than for the express purpose of delivering the purposed product or service requested by the customer.</p>
              <ul style={{listStyleType:'disc',marginLeft:'70px',fontSize:'18px'}}>
                <li>To send periodic e-mails</li>
              </ul>
              <p className={styles.answer}>The e-mail address you provide for order processing may be used to send you information and updates pertaining to your order, in addition to receiving occasional company news, updates, related product(s) service(s) information, etc.</p>
            </div>
            <div className={styles.div}>
              <p className={styles.question}>How do we protect your information?</p>
              <p className={styles.answer}>We implement a variety of advanced security measures to maintain the safety of your personal information when you access your personal information.</p>
            </div>
            <div className={styles.div}>
              <p className={styles.question}>Do we use cookies?</p>
              <p className={styles.answer}>We do not use cookies.</p>
            </div>
            <div className={styles.div}>
              <p className={styles.question}>Do we disclose any information to outside parties?</p>
              <p className={styles.answer}>We do not sell, trade, or otherwise, transfer to outside parties your personally identifiable information. This does not include trusted third parties who assist us in operating our website, conducting our business, or servicing you, so long as those parties agree to keep this information confidential. We may also release your information when we believe release is appropriate to comply with the law, enforce our site policies, or protect ours or other users’ rights, property, or safety.</p>
            </div>
            <div className={styles.div}>
              <p className={styles.question}>Contacting Us</p>
              <p className={styles.answer}>If there are any questions regarding this privacy policy you may contact us using the following e-mail address contact@hurify.co</p>
            </div>
            <div className={styles.div}>
              <p className={styles.question}>Changes to our Privacy Policy</p>
              <p className={styles.answer}>If we decide to change our privacy policy, we will post those changes on this page.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

		)
}
}
PrivacyPolicy.contextTypes = {
    router: PropTypes.object.isRequired
}
export default PrivacyPolicy
