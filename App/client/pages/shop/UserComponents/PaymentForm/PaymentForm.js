import React from 'react'
import {Field, reduxForm} from 'redux-form'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import { RingLoader } from 'react-spinners';
import AuthLayer from './../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import UserStore from './../../../stores/UserStore'
import styles from './PaymentForm.css'
import Hurify from './../DApp/build/contracts/Hurify.json'
import getWeb3 from './../DApp/utils/getWeb3'

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
    console.log(JSON.parse(localStorage.getItem('checkoutData')));
    if (JSON.parse(localStorage.getItem('checkoutData')) == null) {
      browserHistory.push('/home')
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
		    hurify.setProvider(this.state.web3.currentProvider)
		    var hurifyInstance;
		    this.state.web3.eth.getAccounts((error, accounts) => {
					// console.log("accounts of 0"+accounts[0]);
					if ((accounts[0] == "undefined") || (accounts[0] == null)) {
						alert("Please unlock Metamask, and create Metamask account to proceed further")
            this.setState({
              indicatorDisplay:'none'
            })
          }
					else {
		      hurify.deployed().then(function(instance) {
		        hurifyInstance = instance;
            // self.state.web3.eth.getBalance(accounts[0], (err, balance) => {
            //   console.log("eth balance", balance);
            // })
		        return hurifyInstance.balanceOf(accounts[0], {from: accounts[0]})
		      }).then(function(balance) {
						console.log("balance isssss"+balance);
						if (balance.div(1e18) >= 1) {
							// cookies.set('balance', crypt.encrypt(balance.div(1e18)), { path: '/' });
							self.tokenTransfer();
						}
						else {
              self.setState({
                indicatorDisplay:'none'
              })
							alert("You have unsufficient balance, Please get some HUR. Your balance is " + balance.div(1e18))
						}
		      }).catch(err => {
						console.log("err"+err);
            self.setState({
              indicatorDisplay:'none'
            })
						alert("Please create an account in Metamask to proceed further")
					})
				}
		    })
			}
  }

		tokenTransfer() {
			var self = this;
      const checkoutData = JSON.parse(localStorage.getItem('checkoutData'))


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
	      hurify.deployed().then((instance) => {
	        hurifyInstance = instance
	        return hurifyInstance.transfer("0xbF3b79a27a91a8DC12D66Eb1785C37B73c597706", finalValue, {from: accounts[0]})
	      }).then((result) => {
          console.log("resulttttttt ", result);
					if (result.receipt.status == "0x1"){
            console.log(result.tx);

            self.payment(result.tx);
          }
					else {
            console.log();
            self.setState({
              indicatorDisplay:'none'
            })
						alert("failed to transfer but your project was saved in Posted projects")
					}
	        return result
	      }).catch(err => {
          self.setState({
            indicatorDisplay:'none'
          })
          console.log("err " + err);
        })
	    })

	  }
  componentDidMount() {
    // localStorage.getItem('dashboard_email')
  }
payment(transactionHash) {
  // event.preventDefault();
  const checkoutData = JSON.parse(localStorage.getItem('checkoutData'))
  const data = {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    name: checkoutData.name,
    email: checkoutData.email,
    mobile: parseInt(checkoutData.mobile),
    country: checkoutData.country,
    state: checkoutData.state,
    city: checkoutData.city,
    address: checkoutData.address,
    pincode: "34343",
    price: checkoutData.price,
    transactionHash:transactionHash
  }
  AuthLayer.addOrderDetails(data)
  .then(response => {
    // alert(JSON.stringify(response.data));
    // console.log(JSON.stringify(response.data));
      if (response.data.success){
        this.setState({
          indicatorDisplay:'none'
        })
        localStorage.removeItem('checkoutData');
        localStorage.setItem('orderId', response.data.data);
        // alert("Successfully placed your order.")
        browserHistory.push('/home/placeorder')
      }
      else {
        this.setState({
          indicatorDisplay:'none'
        })
      }
  })
}
  render() {


    return (
      <div>
      <header>
          <div className="container">
              <div className="brand" style={{paddingLeft:'20px'}}>
                  <img className="basicHeaderLogo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" alt="HURIFY"/>
              </div>
              <div style={{width:'50%', color:'#fff',marginTop:'20px'}}>
                <div className="bc-icons-2" style={{color:'#fff'}}>
                  <ol className="breadcrumb indigo lighten-4" style={{color:'#fff'}}>
                      <li className="breadcrumb-item" style={{float:'left', color:'#fff',marginLeft:'20px'}}><a className="black-text" href="/home" style={{color:'#fff'}}>Home</a><i className="fa fa-caret-right mx-2" aria-hidden="true" style={{marginLeft:'20px',marginRight:'20px'}}></i></li>
                      <li className="breadcrumb-item active" style={{color:'#D0D3D4',marginLeft:'20px'}}>Payment</li>
                  </ol>
                </div>
              </div>
              <div className="flex-container1">
                  <div className="logout">
                    <Link to="/home" style={{color:'#fff'}}>Home</Link>
                  </div>
              </div>
          </div>
      </header>
      <div className="row" style={{paddingTop:'80px'}}>
        <form className="paymentform" onSubmit={this.tokenBalance}>
          <div style={{textAlign:'center'}}>
          <img className="paymentLogo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_fav_icon.png" alt="HURIFY"/>
          <div style={{marginBottom:'30px',fontSize:'22px'}}>Payment will be done through HUR tokens</div>
            <label><input type="radio" name="optionsRadios" id="optionsRadios1" value="option1" required/> <span style={{paddingLeft:'10px'}}>HUR</span> </label>
            <div style={{marginTop:'30px'}}><input type="Submit" style={{width:'150px'}} defaultValue="Pay">
            </input></div>
          </div>
        </form>
        <div className="indicator" style={{display:this.state.indicatorDisplay}}>
    				<div className="RingLoader">
    				<div style={{paddingLeft:'40%', textAlign:'center'}}>
    					<RingLoader
    						color={'#fff'}
    						loading= {this.state.loading}
    					/>
    				</div>
    					<p style={{color:'#fff', marginTop:'30px',fontSize: '20px', textAlign: 'center',marginBottom: '0px'}}>Please wait for few seconds</p>
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
