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

var checkoutData = {}
class CheckoutFormDemo extends React.Component {
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
      totalAmount:'',
    	isFetching: false,
    	isAuthorized: false,
    	emailIsSent: false,
    	error: null
    };
    this.submitForm = this.submitForm.bind(this);
  }

  changeUser = (event) => {
    // console.log(event.target.type);
    const field = event.target.name
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
    this.getCartProducts();
  }
  getCartProducts() {
    const data = {
      token: crypt.decrypt(cookies.get('token')),
      userId: crypt.decrypt(cookies.get('UserID')),
    }
    AuthLayer.getCartProducts(data)
    .then(response => {
      // alert(JSON.stringify(response.data));
        if (response.data.success){
          if (response.data.data == "") {
            browserHistory.push('/shop')
          }else {
          var total = 0
          for (var i = 0; i < response.data.data.length; i++) {
            total += response.data.data[i].price
          }
          this.setState({
            cartItems:response.data.data,
            totalAmount:total
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
      checkoutData = this.state.user
      cookies.set('checkoutData', crypt.encrypt(JSON.stringify(this.state.user)), { path: '/' });
      // localStorage.setItem('checkoutData', JSON.stringify(this.state.user))
      browserHistory.push('/dashboard/marketplace/payment')
    }
  componentDidMount() {
    // localStorage.getItem('dashboard_email')
  }


  render() {
    var items = this.state.cartItems
    var cartItems = items.map((i) =>
        <div key={i.id} style={{paddingTop:'20px'}}>
          <div className="col-md-2" style={{float:'left', width:'20%'}}>
            <img className="logo" src={i.image} style={{height:'100px',width:'70%',marginBottom:'20px'}} alt="hurify" />
          </div>
          <div className="col-md-3" style={{float:'left', width:'60%'}}>
            <div style={{width:'100%',marginTop:'10px'}}>{i.name}</div>
            <div style={{width:'100%',marginTop:'15px'}}>{i.price / i.quantity} HUR</div>
            <div style={{width:'100%',marginTop:'15px', color:'green',fontSize:'15px'}}>Free Shipping</div>
          </div>
          <div className="col-md-3" style={{float:'left',textAlign:'center', width:'20%'}}>
            <div style={{width:'100%',marginTop:'10px'}}>{i.quantity} Items</div>
            <div style={{width:'100%',marginTop:'25px',wordWrap: 'break-word'}}>{i.price} HUR</div>
          </div>
          <hr style={{width:'100%'}}/>
        </div>
    )
    return (
      <div>
      <header1>
          <div className="container" style={{width:'80%'}}>
              <div className="brand" style={{paddingLeft:'20px', display:'none'}}>
                  <img className="basicHeaderLogo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" alt="HURIFY"/>
              </div>
              <div style={{width:'50%', color:'#fff',marginTop:'20px'}}>
                <div className="bc-icons-2" style={{color:'#fff'}}>
                  <ol className="breadcrumb indigo lighten-4" style={{color:'#fff',backgroundColor: 'transparent'}}>
                      <li className="breadcrumb-item" style={{float:'left', color:'#fff',marginLeft:'20px'}}><a className="black-text" href="/dashboard/marketplace/" style={{color:'#fff'}}>Marketplace</a><i className="fa fa-caret-right mx-2" aria-hidden="true" style={{marginLeft:'10px',marginRight:'20px'}}></i></li>
                      <li className="breadcrumb-item active" style={{color:'#D0D3D4'}}>Checkout</li>
                  </ol>
                </div>
              </div>
              <div className="flex-container1">
                  <div className="logout" style={{display:'none'}}>
                    <Link to="/shop" style={{color:'#fff'}}>Home</Link>
                  </div>
              </div>
          </div>
      </header1>
      <div className="container">
        <div className={styles.checkoutDiv}>
            <div className="row">
              <div className="col-md-4">
                <h3 style={{color:'#000'}}>Contact Address</h3>
                    <div className={styles.group}>
                    <label className={styles.label1}>Full Name</label>
                      <input type="text" className={styles.input} name="name" style={{height:'35px'}} onChange={this.changeUser} required/>
                    </div>
                    <div className={styles.group}>
                      <label className={styles.label1}>Email</label>
                      <input type="email" className={styles.input} name="email" style={{height:'35px'}} onChange={this.changeUser}  required />
                    </div>
                    <div className={styles.group}>
                      <label className={styles.label1}>Mobile Number</label>
                      <input type="text" className={styles.input} name="mobile" style={{height:'35px'}} onChange={this.changeUser}  required />
                    </div>
                </div>
              <div className="col-md-6">
                <h3 style={{color:'#000'}}>Shipping Address</h3>
                <div className='row'>
                  <div className="col-md-6">
                    <div className={styles.group}>
                      <label className={styles.label1}>Country</label>
                      <input type="text" className={styles.input} name="country" style={{height:'35px'}} onChange={this.changeUser}  required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.group}>
                      <label className={styles.label1}>State</label>
                      <input type="text" className={styles.input} name="state" style={{height:'35px'}} onChange={this.changeUser}  required />
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className="col-md-6">
                    <div className={styles.group}>
                      <label className={styles.label1}>City</label>
                      <input type="text" className={styles.input} name="city" style={{height:'35px'}} onChange={this.changeUser}  required />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className={styles.group}>
                      <label className={styles.label1}>Street Address</label>
                      <input type="text" className={styles.input} name="address" style={{height:'35px'}} onChange={this.changeUser}  required />
                    </div>
                  </div>
                </div>
                <div className='row'>
                  <div className="col-md-6">
                      <div className={styles.group}>
                        <label className={styles.label1}>Pincode</label>
                        <input type="text" className={styles.input} name="pincode" style={{height:'35px'}} onChange={this.changeUser}  required />
                      </div>
                  </div>
                  <div className="col-md-6"></div>
                </div>
              </div>
              <form className={styles.cartForm}>
                  <h3 style={{color:'#000',fontSize:'20px',marginBottom:'20px'}}>Cart Products</h3>
                  <div>{cartItems}</div>
              </form>
              <form className={styles.checkoutProducts}>
                  <div style={{float:'left', width:'40%'}}>Total Amount</div>
                  <div style={{textAlign:'right',wordWrap: 'break-word'}}>{this.state.totalAmount} HUR</div>
              </form>
              <div style={{textAlign:'right', marginRight:'225px', marginTop:'25px'}}><input type="Submit" defaultValue="Next" style={{width:'120px', color:'#fff',fontSize:'16px',padding:'10px 20px', backgroundColor:'#0268a6', borderColor:'#0268a6'}}/>
              </div>
            </div>
        </div>
      </div>
      <div className="row" style={{paddingBottom:'100px'}} style={{margin:'0px'}}>
        	<form onSubmit={this.submitForm} className={styles.form} style={{background:'transparent'}}>
            <h3 style={{marginBottom:'25px',color:'#000',fontSize:'20px'}}>Contact Information</h3>
              <div className={styles.group}>
              <label className={styles.label1}>Full Name</label>
                <input type="text" className={styles.input} name="name" style={{height:'35px'}} onChange={this.changeUser} required/>
              </div>
              <div className={styles.group}>
                <label className={styles.label1}>Email</label>
                <input type="email" className={styles.input} name="email" style={{height:'35px'}} onChange={this.changeUser}  required />
              </div>
              <div className={styles.group}>
                <label className={styles.label1}>Mobile Number</label>
                <input type="text" className={styles.input} name="mobile" style={{height:'35px'}} onChange={this.changeUser}  required />
              </div>
              <h3 style={{marginBottom:'25px',color:'#000',fontSize:'20px'}}>Shipping Address</h3>
              <div className={styles.group}>
                <label className={styles.label1}>Country</label>
                <input type="text" className={styles.input} name="country" style={{height:'35px'}} onChange={this.changeUser}  required />
              </div>
              <div className={styles.group}>
                <label className={styles.label1}>State</label>
                <input type="text" className={styles.input} name="state" style={{height:'35px'}} onChange={this.changeUser}  required />
              </div>
              <div className={styles.group}>
                <label className={styles.label1}>City</label>
                <input type="text" className={styles.input} name="city" style={{height:'35px'}} onChange={this.changeUser}  required />
              </div>
              <div className={styles.group}>
                <label className={styles.label1}>Street Address</label>
                <input type="text" className={styles.input} name="address" style={{height:'35px'}} onChange={this.changeUser}  required />
              </div>
              <div className={styles.group}>
                <label className={styles.label1}>Pincode</label>
                <input type="text" className={styles.input} name="pincode" style={{height:'35px'}} onChange={this.changeUser}  required />
              </div>
              <div style={{textAlign:'right'}}><input type="Submit" defaultValue="Next" style={{width:'120px', color:'#fff',fontSize:'16px',padding:'10px 20px', backgroundColor:'#0268a6', borderColor:'#0268a6'}}/>
              </div>
            </form>

            <form className={styles.cartForm}>
                <h2 style={{textAlign:'center',fontSize:'20px',marginBottom:'20px'}}>Cart Products</h2>
                <div>{cartItems}</div>
            </form>
            <form className={styles.checkoutProducts}>
                <div style={{float:'left', width:'40%'}}>Total Amount</div>
                <div style={{textAlign:'right',wordWrap: 'break-word'}}>{this.state.totalAmount} HUR</div>
            </form>
         </div>
        </div>
    );
  }
}
CheckoutFormDemo.contextTypes = {
    router: PropTypes.object.isRequired
}
export default CheckoutFormDemo
