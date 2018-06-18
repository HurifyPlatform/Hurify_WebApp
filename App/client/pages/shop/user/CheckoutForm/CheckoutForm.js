import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import AuthLayer from './../../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import UserStore from './../../../../stores/UserStore'
import styles from './CheckoutForm.css'
import Cookies from 'universal-cookie';

var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();


class CheckoutForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user : {
        name:'',
        email:'',
        mobile:'',
        country:'',
        state:'',
        city:'',
        address:'',
        pincode:'',
        price:''
      },
      cartItems:[],
      totalAmount:0,
    	isFetching: false,
    	isAuthorized: false,
    	emailIsSent: false,
    	error: null,
      tax:0
    };
    this.submitForm = this.submitForm.bind(this);
  }

  changeUser = (event) => {
    // console.log(event.target.type);
    const field = event.target.name
  	const user = this.state.user
  	user[field] = event.target.value
		this.setState({user})
    if (event.target.name == "mobile_number") {
  					if ((event.target.value.match(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,`<>\/?]/)) || (event.target.value.match(/[a-z]/i))){
  						alert("Please enter numeric value only")
  						user[field] = event.target.value.slice(0, -1)
  						this.setState({user})
  					}
    }
    if (event.target.name == "mobile_code") {
  					if ((event.target.value.match(/[ !@#$%^&*()_\-=\[\]{};':"\\|,`<>\/?]/)) || (event.target.value.match(/[a-z]/i))){
  						alert("Please enter numeric value only")
  						user[field] = event.target.value.slice(0, -1)
  						this.setState({user})
  					}
    }

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
    // if (crypt.decrypt(cookies.get('email')) == "lakshmi.spandana@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "schmouli@hurify.co" || crypt.decrypt(cookies.get('email')) == "russell.murphy@hurify.co" || crypt.decrypt(cookies.get('email')) == "srinidhi.murthy@gmail.com" || crypt.decrypt(cookies.get('email')) == "sripriya.murthy@gmail.com" || crypt.decrypt(cookies.get('email')) == "haleygreen406@gmail.com" || crypt.decrypt(cookies.get('email')) == "ashish@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "syed.bilal.hussain@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "padmanabham.pakki@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "sridharkrishnan73@gmail.com") {
    this.getCartProducts();
    // }
    // else {
    //   alert("Coming Soon")
    //    this.context.router.push('/dashboard/mytoken')
    //
    //
    // }

  }
  getCartProducts() {
    const data = {
      token: crypt.decrypt(cookies.get('token')),
      userId: crypt.decrypt(cookies.get('UserID')),
    }
    AuthLayer.getCartProducts(data)
    .then(response => {
      // alert(JSON.stringify(response.data));
      console.log(JSON.stringify(response.data));
        if (response.data.success){
          if (response.data.data == "") {
            browserHistory.push('/shop')
          }else {
          var total = 0
          for (var i = 0; i < response.data.data.length; i++) {
            total += response.data.data[i].price * response.data.data[i].quantity
          }
          this.setState({
            cartItems:response.data.data,
            totalAmount:total,
            tax:total * 0.11
          })
        	const user = this.state.user
        	user["price"] = total
      		this.setState({user})
        }
        }
    });
  }

    submitForm(event) {
      event.preventDefault();
      const user = this.state.user
      user["mobile"] = this.state.user.mobile_code + this.state.user.mobile_number
      // user['price'] = this.state.user.price + this.state.tax
      user['price'] = this.state.user.price
      this.setState({user})
      console.log(this.state.user);
      cookies.set('checkoutData', crypt.encrypt(JSON.stringify(this.state.user)), { path: '/' });
      // localStorage.setItem('checkoutData', JSON.stringify(this.state.user))
      browserHistory.push('/dashboard/marketplace/payment')
    }
  componentDidMount() {
    // localStorage.getItem('dashboard_email')
  }
  increment(id, price, quantity, productId){
    const data = {
      token: crypt.decrypt(cookies.get('token')),
      userId: crypt.decrypt(cookies.get('UserID')),
      id:id,
      price:price,
      quantity:quantity+1,
      productId:productId
    }
    console.log("dataaaaaa ", data);
    AuthLayer.editProductsInCart(data)
    .then(response1 => {
        console.log(JSON.stringify(response1.data));
        if (response1.data.success) {
          // AuthLayer.getCartProducts(data)
          // .then(response => {
          //   // alert(JSON.stringify(response.data));
          //   console.log(JSON.stringify(response.data));
          //     if (response.data.success){
          //       if (response.data.data == "") {
          //         browserHistory.push('/shop')
          //       }else {
          //       var total = 0
          //       for (var i = 0; i < response.data.data.length; i++) {
          //         total += response.data.data[i].price * response.data.data[i].quantity
          //       }
          //       this.setState({
          //         cartItems:response.data.data,
          //         totalAmount:total
          //       })
          //     	const user = this.state.user
          //     	user["price"] = total
          //   		this.setState({user})
          //     }
          //     }
          // });
          this.getCartProducts();
        }
        else {
          alert(JSON.stringify(response.data.error))
        }
    })
    // e.preventDefault();
  };

  decrement(id, price, quantity, productId){
    // e.preventDefault();
    if(quantity <= 1){
      return quantity;
    }
    else{
      const data = {
        token: crypt.decrypt(cookies.get('token')),
        userId: crypt.decrypt(cookies.get('UserID')),
        id:id,
        price:price,
        quantity:quantity-1,
        productId:productId
      }
      AuthLayer.editProductsInCart(data)
      .then(response => {
          console.log(JSON.stringify(response.data));
          if (response.data.success) {
            this.getCartProducts();
          }
          else {
            alert(JSON.stringify(response.data.error))
          }
      })
    }
  };
logout(e) {
  e.preventDefault();
  window.location = '/logout'
}
  render() {
    var items = this.state.cartItems
    var orderAmount = this.state.totalAmount.toFixed(4)
    var taxAmount = this.state.tax.toFixed(4)
    var totalAmount = (this.state.totalAmount + this.state.tax).toFixed(4)
    var cartItems = items.map((i) =>
        <div key={i.id} style={{paddingTop:'20px'}}>
          <div className="col-md-2" style={{float:'left', width:'20%'}}>
            <img className="logo" src={i.image} style={{height:'100px',width:'70%',marginBottom:'20px'}} alt="hurify" />
          </div>
          <div className="col-md-3" style={{float:'left', width:'60%'}}>
            <div style={{width:'100%',marginTop:'10px'}}>{i.name}</div>
            <div style={{width:'100%',marginTop:'15px'}}>{i.price} HUR</div>
            <div style={{width:'100%',marginTop:'15px', color:'green',fontSize:'15px'}}>Free Shipping</div>
            <div style={{width:'100%',marginTop:'15px'}}>Manufactured by: <span style={{marginLeft:'5px', fontWeight:'600',fontSize:'18px'}}>{i.manufacturer}</span></div>
          </div>
          <div className="col-md-3" style={{float:'left',textAlign:'center', width:'20%'}}>
            <div style={{width:'100%',marginTop:'10px'}}>{i.quantity} Items</div>
            <div style={{width:'100%',marginTop:'15px',wordWrap: 'break-word'}}>{i.price * i.quantity} HUR</div>
            <div style={{width:'100%',marginTop:'15px'}}>
            <div className="stepper-input" style={{textAlign:'left'}}>
              <a href="#" className="decrement" onClick={() => this.decrement(i.id, i.price, i.quantity, i.productId)}>–</a>
              <label ref="feedQty" className="quantity">{i.quantity}</label>
              <a href="#" className="increment" onClick={() => this.increment(i.id, i.price, i.quantity, i.productId)}>+</a>
            </div>
            </div>
          </div>
          <hr style={{width:'100%'}}/>
        </div>
    )
    return (
      <div>
      <header1>
          <div className="container">
              <div style={{width:'50%', color:'#fff',marginTop:'20px'}}>
                <div className="bc-icons-2" style={{color:'#fff'}}>
                  <ol className="breadcrumb indigo lighten-4" style={{color:'#fff',backgroundColor: 'transparent'}}>
                      <li className="breadcrumb-item" style={{float:'left', color:'#fff',marginLeft:'20px'}}><a className="black-text" href="/dashboard/marketplace/" style={{color:'#fff'}}>Marketplace</a><i className="fa fa-caret-right mx-2" aria-hidden="true" style={{marginLeft:'10px',marginRight:'20px'}}></i></li>
                      <li className="breadcrumb-item active" style={{color:'#D0D3D4'}}>Checkout</li>
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
      <div className="container">
        <div className={styles.checkoutDiv}>
          <form onSubmit={this.submitForm}>

                <div className='row' style={{width:'90%'}}>
                  <h3 style={{color:'#000'}}>Contact Information</h3>
                    <div className="col-sm-4">
                      <div className={styles.group}>
                      <label className={styles.label1}>Full Name</label>
                        <input type="text" className={styles.input} name="name" style={{height:'35px'}} onChange={this.changeUser} required/>
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className={styles.group}>
                        <label className={styles.label1}>Email</label>
                        <input type="email" className={styles.input} name="email" style={{height:'35px'}} onChange={this.changeUser}  required />
                      </div>
                    </div>
                    <div className="col-sm-4">
                      <div className={styles.group}>
                        <label className={styles.label1} style={{marginLeft:'-45px'}}>Mobile Number</label>
                        <input type="text" className={styles.mobile_code_input} name="mobile_code" style={{height:'35px'}} onChange={this.changeUser} value={this.state.user.mobile_code} required/>
                        <input type="text" className={styles.mobile_number_input} name="mobile_number" style={{height:'35px'}} onChange={this.changeUser} value={this.state.user.mobile_number} required />
                      </div>
                    </div>
                  </div>
            <div className="row" style={{width:'90%'}}>
                <h3 style={{color:'#000'}}>Shipping Address</h3>
                <div className="col-md-4">
                  <div className={styles.group}>
                    <label className={styles.label1}>Street Address</label>
                    <input type="text" className={styles.input} name="address" style={{height:'35px'}} onChange={this.changeUser}  required />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={styles.group}>
                    <label className={styles.label1}>City</label>
                    <input type="text" className={styles.input} name="city" style={{height:'35px'}} onChange={this.changeUser}  required />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className={styles.group}>
                    <label className={styles.label1}>State</label>
                    <input type="text" className={styles.input} name="state" style={{height:'35px'}} onChange={this.changeUser}  required />
                  </div>
                </div>
                <div className='row' style={{marginLeft:'0px'}}>
                <div className="col-md-4">
                  <div className={styles.group}>
                    <label className={styles.label1}>Country</label>
                    <input type="text" className={styles.input} name="country" style={{height:'35px'}} onChange={this.changeUser}  required />
                  </div>
                </div>
                  <div className="col-md-4">
                      <div className={styles.group}>
                        <label className={styles.label1}>Postal Code</label>
                        <input type="text" className={styles.input} name="pincode" style={{height:'35px'}} onChange={this.changeUser}  required />
                      </div>
                  </div>
                </div>


              <form className={styles.cartForm}>
                  <h3 style={{color:'#000',fontSize:'20px',marginBottom:'20px'}}>Cart Products</h3>
                  <div>{cartItems}</div>
              </form>
              <form className={styles.checkoutProducts}>
                  <div style={{float:'left', width:'40%'}}>Total Amount</div>
                  <div style={{textAlign:'right',wordWrap: 'break-word'}}>{orderAmount} HUR</div>
              </form>
              {/*<form className={styles.checkoutProducts} style={{marginTop:'10px'}}>
                  <div style={{float:'left', width:'40%'}}>Tax (11%)</div>
                  <div style={{textAlign:'right',wordWrap: 'break-word'}}>{taxAmount} HUR</div>
              </form>
              <form className={styles.checkoutProducts} style={{marginTop:'10px'}}>
                  <div style={{float:'left', width:'40%'}}>Total Amount</div>
                  <div style={{textAlign:'right',wordWrap: 'break-word'}}>{totalAmount} HUR</div>
              </form>*/}
              <div className={styles.buttons} style={{marginTop:'25px'}}>
                  <div style={{ color:'#fff',fontSize:'16px', backgroundColor:'#0268a6', borderColor:'#0268a6',marginLeft:'-100px',padding:'5px 10px'}}><Link to="/dashboard/marketplace/" style={{color:'#fff'}} >Continue Shopping</Link></div>
                  <div style={{marginLeft:'60%'}}><input type="Submit" defaultValue="Next" style={{ color:'#fff',fontSize:'16px', backgroundColor:'#0268a6', borderColor:'#0268a6',padding:'5px 10px'}}/></div>
              </div>
            </div>
          </form>
        </div>
      </div>
        </div>
    );
  }
}
CheckoutForm.contextTypes = {
    router: PropTypes.object.isRequired
}
export default CheckoutForm
