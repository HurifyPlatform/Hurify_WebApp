import React from 'react'
import styles from './TermsofService.css'
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
class TermsofService extends React.Component {
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
            <h2 style={{textAlign:'center',fontSize:'33px'}}>TERMS OF SERVICES</h2>
						<div className={styles.div}>
              <p className={styles.answer}>The following are terms of a legal agreement between you and Hurify. By accessing, browsing and/or using this website, you acknowledge that you have read, understood, and agree, to be bound by these terms and to comply with all applicable laws and regulations. If you do not agree to these terms, do not use this website.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>This Website may contain other proprietary notices and copyright information, the terms of which must be observed and followed. Information on this Website may contain technical inaccuracies or typographical errors.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>Information may be changed or updated without notice. Hurify may also make improvements and/or changes in the products and/or the programs described in this information at any time without notice.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>Hurify assumes no responsibility regarding the accuracy of the information that is provided by Hurify and use of such information is at the recipient’s own risk. Hurify provides no assurances that any reported problems may be resolved with the use of any information that Hurify provides. By furnishing information, Hurify does not grant any licenses to any copyrights, patents or any other intellectual property rights.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>Hurify does not want to receive confidential or proprietary information from you through our Web site. Please note that any information or material sent to Hurify will be deemed NOT to be confidential. By sending Hurify any information or material, you grant Hurify an unrestricted, irrevocable license to use, reproduce, display, perform, modify, transmit and distribute those materials or information, and you also agree that Hurify is free to use any ideas, concepts, know-how or techniques that you send us for any purpose.</p>
            </div>
						<h3 style={{fontSize:'24',color:'#000',marginLeft:'8%',marginTop:'30px'}}>Global Availability</h3>
						<div className={styles.div}>
              <p className={styles.answer}>Information Hurify publishes on the World Wide Web may contain references or cross references to Hurify products, programs, and services that are not announced or available in your country. Such references do not imply that Hurify intends to announce such products, programs or services in your country. Consult with Hurify business contact for information regarding the products, programs, and services which may be available to you.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>Hurify’s obligations with respect to its products and services are governed solely by the agreements under which they are provided. If you obtain a product or service from Hurify off this web site that is provided without an agreement, that product or service is provided “AS-IS” with no warranties whatsoever, express or implied, and your use of that product or service is at your own risk.</p>
            </div>
						<h3 style={{fontSize:'24',color:'#000',marginLeft:'8%',marginTop:'30px'}}>Business Relationships</h3>
						<div className={styles.div}>
              <p className={styles.answer}>Hurify makes no representations whatsoever about any other Web site which you may access through this one. When you access a non-Hurify Web site, even one that may contain the Hurify logo, please understand that it is independent from Hurify, and that Hurify has no control over the content on that Web site. In addition, a link to a non-Hurify Web site does not mean that Hurify endorses or accepts any responsibility for the content, or the use, of such Web site. It is up to you to take precautions to ensure that whatever you select for your use is free of such items as viruses, worms, trojan horses and other items of a destructive nature.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>IN NO EVENT WILL HURIFY BE LIABLE TO ANY PARTY FOR ANY DIRECT, INDIRECT, SPECIAL OR OTHER CONSEQUENTIAL DAMAGES FOR ANY USE OF THIS WEB SITE, OR ON ANY OTHER HYPER LINKED WEB SITE, INCLUDING, WITHOUT LIMITATION, ANY LOST PROFITS, BUSINESS INTERRUPTION, LOSS OF PROGRAMS OR OTHER DATA ON YOUR INFORMATION HANDLING SYSTEM OR OTHERWISE, EVEN IF WE ARE EXPRESSLY ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>ALL INFORMATION IS PROVIDED BY HURIFY ON AN “AS IS” BASIS ONLY. HURIFY PROVIDES NO REPRESENTATIONS AND WARRANTIES, EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, AND NONINFRINGEMENT.</p>
            </div>
						<div className={styles.div}>
              <p className={styles.answer}>Hurify may at any time revise these terms by updating this posting. By using this website, you agree to be bound by any such revisions and should therefore periodically visit this page to determine the then current terms to which you are bound.</p>
            </div>
						<h3 style={{fontSize:'24',color:'#000',marginLeft:'8%',marginTop:'30px'}}>Copyright Notice</h3>
						<div className={styles.div}>
              <p className={styles.answer}>No portion of this service may be reproduced in any form, or by any means, without prior written permission from Hurify. The logos and content displayed on as part of the Website are the property of Hurify or other third parties. Users are not permitted to use these copyrighted works without our prior written consent or the consent of such third party which may own the content. Unless otherwise specified in these Terms, all information and screens appearing on the Website, including documents, services, site design, text, graphics, logos, images, and icons, as well as the arrangement thereof, are the sole property of Hurify. Copyright © 2017. All rights reserved. All rights not expressly granted herein are reserved. Except as otherwise required or limited by applicable law, any reproduction, distribution, modification, retransmission, or publication of any copyrighted material is strictly prohibited without the express written consent of the copyright owner or authorized licensor.</p>
            </div>
						<h3 style={{fontSize:'24',color:'#000',marginLeft:'8%',marginTop:'30px'}}>Copyright Notice</h3>
						<div className={styles.div}>
							<a href="mailto:contact@hurify.co">contact@hurify.co</a>
							<p className={styles.answer}>This page, the entire Hurify site, images/documents are Copyright © 2017 by Hurify. All Rights Reserved.</p>
						</div>
					</div>
        </div>
      </div>
    </div>

		)
}
}
TermsofService.contextTypes = {
    router: PropTypes.object.isRequired
}
export default TermsofService
