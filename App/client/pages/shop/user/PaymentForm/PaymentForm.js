import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { RingLoader } from 'react-spinners';
import AuthLayer from './../../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import UserStore from './../../../../stores/UserStore'
import styles from './PaymentForm.css'
import Hurify from './../../../../components/DApp/build/contracts/Hurify.json'
import getWeb3 from './../../../../components/DApp/utils/getWeb3'
import Cookies from 'universal-cookie';

var txHash = "";
var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();
class PaymentForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        email: '',
        password:''
      },
    	isFetching: false,
    	isAuthorized: false,
    	emailIsSent: false,
    	error: null,
      indicatorDisplay:'none'
    };
    this.tokenBalance = this.tokenBalance.bind(this);
    this.logout = this.logout.bind(this);
  }

  handleChange = (event) => {
    // console.log(event.target.type);
    const field = event.target.type
  	const user = this.state.user
  	user[field] = event.target.value
		this.setState({user})
    // console.log(this.state.user);
    // this.setState({
    //   [event.target.label]: event.target.value
    // });
  };

  handleKeyPress = (e) => {
    if (e.keyCode === 13 || e.which === 13) {
      this.handleSubmit();
    }
  }

  handleSubmit = () => {
    this.setState({
      isFetching: true,
      isAuthorized: false,
      emailIsSent: false,
      error: null
    });
    this.UserLogin();
  }

  componentWillMount() {
    // this.payment("0x652fc91102c8355ac2a15aff2013dea37c6efd2d962064dbcd31569cdc1de83d", "Payment Confirmation Pending");
    getWeb3
		.then(results => {
			this.setState({
				web3: results.web3
			})
      console.log(results.web3);
		})
		.catch((err) => {
			console.log(err)
			// alert("Please install Meta mask to proceed further")
		})
    // console.log(this.props.checkoutData);
    console.log("aaaaaaaaaaaa ", JSON.parse(localStorage.getItem('checkoutData')));
    if (JSON.parse(crypt.decrypt(cookies.get('checkoutData'))) == null) {
      browserHistory.push('/dashboard/marketplace')
    }
    // auth.checkTokenFromUrl();
  }
  tokenBalance(e) {
    // alert("entered")
    e.preventDefault();
    this.setState({
      indicatorDisplay:'block'
    })
		var self = this;
		    const contract = require('truffle-contract')
		    const hurify = contract(Hurify)
        // console.log(this.state.web3);
				if ((this.state.web3 == "undefined") || (this.state.web3 == null)) {
          alert("Please install Meta mask to proceed furthur")
          this.setState({
            indicatorDisplay:'none'
          })
        }
        else {
          this.state.web3.version.getNetwork((err, netId) => {
            if (netId != 1) {
              alert("Please choose Main Etherium Network.")
              this.setState({
                indicatorDisplay:'none'
              })
              window.stop();
            }
            else {
              hurify.setProvider(this.state.web3.currentProvider)
             var hurifyInstance;
             this.state.web3.eth.getAccounts((error, accounts) => {
                console.log("accounts of 0"+accounts[0]);
               if ((accounts[0] == "undefined") || (accounts[0] == null)) {
                 alert("Please unlock Metamask, and create Metamask account to proceed further")
                  this.setState({
                    indicatorDisplay:'none'
                  })
                }
               else {


                  var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"tokensup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"},{"name":"_type","type":"uint256"}],"name":"hurifymint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"}],"name":"hurmint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hurclan","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';

                 var myContract = new web3.eth.Contract(JSON.parse(abi), '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47', {
                   //from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706', // default from address
                   from: accounts[0],
                   gasPrice: '2000000000'
                 });
                 web3.eth.getBalance(accounts[0]).then(function(result) {
									 console.log("eth balance isssss: ", result/1000000000000000000);
									 if (result/1000000000000000000 < 0.00005) {
                     self.setState({
                       indicatorDisplay:'none'
                     })
                    alert("You have insufficient ETH balance. Your ETH balance is " + result/1000000000000000000)
                   }
                   else {
                     myContract.methods.balanceOf(accounts[0]).call({
                       from: accounts[0]
                       //from: '0xbf3b79a27a91a8dc12d66eb1785c37b73c597706'
                     }).then(function(result) {
                       var balanceAmount = result / 1000000000000000000;
                       console.log("BalanceAmount", balanceAmount);
                        if (balanceAmount >= 1) {
                           // cookies.set('balance', crypt.encrypt(balance.div(1e18)), { path: '/' });
                           self.tokenTransfer();
                         }
                         else {
                            self.setState({
                              indicatorDisplay:'none'
                            })
                           alert("You have insufficient balance. Your balance is " + balanceAmount)
                         }
                       //return resolve({success : "true" , balanceAmount : balanceAmount});
                     }).catch(function(err) {
                       console.log("Err: ", err);
                        self.setState({
                            indicatorDisplay:'none'
                          })
                         alert("Please create an account in Metamask to proceed further")

                     });
                   }
                 })

             }
             })
            }
          })

			}
  }

		tokenTransfer() {
			var self = this;
      const checkoutData = JSON.parse(crypt.decrypt(cookies.get('checkoutData')))


      var strNoOfHUR = checkoutData.price.toString().split(".");
		  var finalValue = "";

  		if (strNoOfHUR.length == 2) {
  			var beforeDot = strNoOfHUR[0];
  			var afterDot = strNoOfHUR[1];
  			var afterDotLength = strNoOfHUR[1].length;
  			for(var i=0; i<(18-afterDotLength); i++) {
  				afterDot += "0"
  			}
  			finalValue = beforeDot + afterDot;
  		} else {
  			finalValue = strNoOfHUR[0] + "000000000000000000"
  		}
      console.log("finalValue ",finalValue);


	    const contract = require('truffle-contract')
	  	const hurify = contract(Hurify)
	    hurify.setProvider(this.state.web3.currentProvider)
	    var hurifyInstance
	    this.state.web3.eth.getAccounts((error, accounts) => {


        var abi = '[{"constant":false,"inputs":[],"name":"pauseable","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"Supply","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"tokensup","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"hault","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"unpause","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_value","type":"uint256"}],"name":"burn","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"},{"name":"_type","type":"uint256"}],"name":"hurifymint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_from","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_client","type":"address"},{"name":"_value","type":"uint256"}],"name":"hurmint","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_hurclan","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"_from","type":"address"},{"indexed":false,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}]';


				const contract = new web3.eth.Contract(JSON.parse(abi), '0xCDB7eCFd3403Eef3882c65B761ef9B5054890a47', { from: accounts[0], gas: 60000});

				contract.methods.transfer("0x99F47Ccb940a2E6096F0fFaaaE5f5D4A5e581235", finalValue).send()
        .on('transactionHash', function(hash){
                                          console.log('transactionHash',hash);
                                          txHash = hash
                                        })
                                        .on('receipt', function(receipt){
                                          console.log('receipt',receipt);
                                          console.log(receipt.status);
                                          if (receipt.status == "0x1") {
                                            self.payment(txHash, 'Order Placed');
                                          }
                                          else {
                                            self.setState({
                                              indicatorDisplay:'none'
                                            })
                                            alert("Payment failed")
                                            self.payment(txHash, 'Payment Failed');
                                          }
                                        })
                                        .on('confirmation', function(confirmationNumber, receipt){
                                          console.log('confirmatiom',confirmationNumber);
                                        })
                                        .on('error', function(err){
                                          console.log('errors',err);
                                          console.log("type off ", typeof(err));
                                          if (err.message.includes("User denied transaction signature")) {
                                            self.setState({
                                              indicatorDisplay:'none'
                                            })
                                            alert("Please proceed with payment again.")
                                          }
                                          else {
                                            self.payment(txHash, 'Payment Confirmation Pending');
                                          }

                                        //  return reject(err);
                                        });
        // .then(result => {
				// 	if(result.status == "0x1"){
        //
				// 		console.log("success payment");
        //     self.payment(result.tx);
				// 	}
				// 	else{
				// 		console.log("fails");
        //     self.setState({
        //       indicatorDisplay:'none'
        //     })
				// 		alert("failed to transfer but your project was saved in Posted projects")
				// 	}
        //   return result
				// })
	    })

	  }
  componentDidMount() {
    // localStorage.getItem('dashboard_email')
  }
payment(transactionHash, paymentStatus) {
  console.log("calling");
  // event.preventDefault();
  const checkoutData = JSON.parse(crypt.decrypt(cookies.get('checkoutData')))
  const data = {
    token: crypt.decrypt(cookies.get('token')),
    userId: crypt.decrypt(cookies.get('UserID')),
    name: checkoutData.name,
    email: checkoutData.email,
    mobile: checkoutData.mobile,
    country: checkoutData.country,
    state: checkoutData.state,
    city: checkoutData.city,
    address: checkoutData.address,
    pincode: checkoutData.pincode,
    price: checkoutData.price,
    transactionHash:transactionHash,
    status:paymentStatus
  }
  AuthLayer.addOrderDetails(data)
  .then(response => {
    // alert(JSON.stringify(response.data));
    // console.log(JSON.stringify(response.data));
      if (response.data.success){
        this.setState({
          indicatorDisplay:'none'
        })
        cookies.remove('checkoutData')
        // localStorage.removeItem('checkoutData');
        cookies.set('orderId', crypt.encrypt(response.data.data), { path: '/' });
        // localStorage.setItem('orderId', response.data.data);
        // alert("Successfully placed your order.")
        window.location = '/dashboard/marketplace/placeorder'
        // browserHistory.push('/dashboard/marketplace/placeorder')
      }
      else {
        this.setState({
          indicatorDisplay:'none'
        })
      }
  })
}
logout(e) {
  e.preventDefault();
  window.location = '/logout'
}
  render() {


    return (
      <div>
      <header1>
          <div className="container">
              <div style={{width:'50%', color:'#fff',marginTop:'20px'}}>
                <div className="bc-icons-2" style={{color:'#fff'}}>
                  <ol className="breadcrumb indigo lighten-4" style={{color:'#fff',backgroundColor: 'transparent'}}>
                      <li className="breadcrumb-item" style={{float:'left', color:'#fff',marginLeft:'20px'}}><a className="black-text" href="/dashboard/marketplace/" style={{color:'#fff'}}>Martket Place</a><i className="fa fa-caret-right mx-2" aria-hidden="true" style={{marginLeft:'10px',marginRight:'20px'}}></i></li>
                      <li className="breadcrumb-item active" style={{color:'#D0D3D4',marginLeft:'20px'}}>Payment</li>
                  </ol>
                </div>
              </div>
              <div className="flex-container1">
              <div className="logout" style={{marginTop:'-15px',marginRight:'50px'}}>
                <Link to="/dashboard/chooseprofile"><img className="profile_image_css" src={crypt.decrypt(cookies.get('ProfilePhoto'))} alt="hurify" /></Link>
              </div>
              <div className="logout" style={{marginTop:'-5px'}}>
                <Link to="/dashboard/marketplace/myorders" style={{color:'#fff',fontWeight:'600',fontSize:'16px'}}>My Orders</Link>
              </div>
              <div className="logout" >
              <button style={{width:'40px',height:'40px',background:'transparent',border:'transparent', color:'#fff', marginTop:'-20px'}} onClick={this.logout} ><span className="glyphicon glyphicon-log-out"><br/><span style={{fontSize:'16px',fontWeight:'600'}}>Logout</span></span></button>
              </div>
              </div>
          </div>
      </header1>

      <div className="row" style={{paddingTop:'80px'}}>
        <form className={styles.paymentform} onSubmit={this.tokenBalance}>
          <div style={{textAlign:'center'}}>
          <img className={styles.paymentLogo} src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_fav_icon.png" alt="HURIFY"/>
          <div style={{marginBottom:'30px',fontSize:'22px'}}>Payment will be done through HUR tokens</div>
            <label style={{fontSize:'25px'}}><input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" checked/> <span style={{paddingLeft:'10px'}}>HUR</span> </label>
            <div style={{marginTop:'30px'}}><input type="Submit" style={{width:'150px', backgroundColor:'#0268a6', color:'#FFFFFF',borderColor:'#0268a6', padding:'5px 10px', fontSize:'18px', fontWeight:'600'}} defaultValue="Pay">
            </input></div>
          </div>
        </form>
        <div className={styles.indicator} style={{display:this.state.indicatorDisplay}}>
    				<div className={styles.RingLoader}>
    				<div style={{paddingLeft:'40%', textAlign:'center'}}>
    					<RingLoader
    						color={'#fff'}
    						loading= {this.state.loading}
    					/>
    				</div>
    					<p style={{color:'#fff', marginTop:'30px',fontSize: '20px', textAlign: 'center',marginBottom: '0px'}}>Please click submit on Metamask and wait for few seconds</p>
    				</div>
    			</div>
      </div>
    </div>
    );
  }
}

PaymentForm.contextTypes = {
    router: PropTypes.object.isRequired
}
export default PaymentForm
