import React from 'react'
import {Field, reduxForm} from 'redux-form'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import AuthLayer from './../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import styles from './PlaceOrder.css'


var checkoutData = {}
class PlaceOrder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      shippingDetails : {
        name:'',
        email:'',
        mobile:'',
        address:'',
        city:'',
        state:'',
        country:''
      },
      products:[],
      quantity:[],
      cartItems:[],
      totalAmount:''
    };
    this.nextClick = this.nextClick.bind(this);
  }

  componentWillMount() {
    this.getOrderDetails();
  }

getOrderDetails() {
  const data = {
    token:localStorage.getItem('token'),
    orderId:localStorage.getItem('orderId')
  }
  AuthLayer.getOrderDetails(data)
  .then(response => {
    // alert(JSON.stringify(response.data));
    console.log(JSON.stringify(response.data));
      if (response.data.success){
        console.log(JSON.stringify(response.data));
        const shippingDetails = this.state.shippingDetails
        shippingDetails['name'] = response.data.data[0].name
        shippingDetails['email'] = response.data.data[0].email
        shippingDetails['mobile'] = response.data.data[0].mobile
        shippingDetails['address'] = response.data.data[0].address
        shippingDetails['county'] = response.data.data[0].county
        shippingDetails['state'] = response.data.data[0].state
        shippingDetails['city'] = response.data.data[0].city
        this.setState({shippingDetails})
        var products = []
        var quantity = []
        var amount = 0
        for (var i = 0; i < response.data.data.length; i++) {
          for (var j = 0; j < response.data.data[i].OrderInfos.length; j++) {
            products.push(response.data.data[i].OrderInfos[j].Product)
            quantity.push(response.data.data[i].OrderInfos[j].quantity)
            amount += response.data.data[i].OrderInfos[j].price
          }
          // products.push(response.data.data[i].OrderInfos.Product)
          // quantity.push(response.data.data[i].OrderInfos.quantity)
          // amount += response.data.data[i].OrderInfos.price
        }
        this.setState({
          products: products,
          quantity: quantity,
          totalAmount: amount
        })

      }
  })
}
nextClick(e) {
  e.preventDefault();
  localStorage.removeItem("orderId");
  browserHistory.push('/home')
}
  render() {
    // console.log(this.state.cartItems);
    var items = this.state.products
    var cartItems = items.map((i, index) =>

          <tr><td>{i.name}</td><td>{this.state.quantity[index]}</td><td>{i.price}</td></tr>
        
    )
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
                      <li className="breadcrumb-item active" style={{color:'#D0D3D4',marginLeft:'20px'}}>PlaceOrder</li>
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
      <div className="row" style={{textAlign:'center'}}>
        	<form className="placeorderform">

            <div className="placeorderdiv">
              <div className="oderdetailsDiv" style={{flexGrow: '4'}}>
                  <img src={require("./success.png")} style={{width:'100px', height:'100px',marginTop:'36px'}} alt="Success"/>
                  <h3 style={{marginBottom:'36px'}}>Successfully placed your order</h3>
                <table className="oderdetailstable">
                  <tr><td>Mobile Number:</td><td>{this.state.shippingDetails.mobile}</td></tr>
                  <tr><td>Email:</td><td>{this.state.shippingDetails.email}</td></tr>
                  <tr><td>Address:</td><td>{this.state.shippingDetails.address}</td></tr>
                </table>
              </div>
            </div>
            <div className="cartItems">
                <h3 style={{fontSize:'20px', textAlign:'left'}}>List of Products</h3>
                <table className="listofProducts">
                  <tr><th>Name</th><th>Quntity</th><th>Price</th></tr>
                  {cartItems}
                </table>
            </div>
              <div style={{textAlign:'right'}}>
                <p style={{marginTop:'25px', fontSize:'23px',fontWeight:'700'}}>Total : {this.state.totalAmount} HUR</p>
                <button style={{textAlign:'right'}} onClick={this.nextClick} style={{marginTop:'30px'}}>Continue Shopping</button>
              </div>

            </form>
         </div>
        </div>
    );
  }
}
PlaceOrder.contextTypes = {
    router: PropTypes.object.isRequired
}
export default PlaceOrder
