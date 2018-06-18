import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import AuthLayer from './../../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import styles from './PlaceOrder.css'
import Cookies from 'universal-cookie';

var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();

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
        country:'',
        orderStatus:''
      },
      products:[],
      quantity:[],
      cartItems:[],
      totalAmount:'',
      orderImage:''

    };
    this.nextClick = this.nextClick.bind(this);
  }

  componentWillMount() {
    this.getOrderDetails();
  }

getOrderDetails() {
  const data = {
    token:crypt.decrypt(cookies.get('token')),
    orderId:crypt.decrypt(cookies.get('orderId'))
  }
  AuthLayer.getOrderDetails(data)
  .then(response => {
    // alert(JSON.stringify(response.data));
    console.log(JSON.stringify(response.data));
      if (response.data.success){
        //console.log(JSON.stringify(response.data));
        const shippingDetails = this.state.shippingDetails
        shippingDetails['name'] = response.data.data[0].name
        shippingDetails['email'] = response.data.data[0].email
        shippingDetails['mobile'] = response.data.data[0].mobile
        shippingDetails['address'] = response.data.data[0].address
        shippingDetails['county'] = response.data.data[0].county
        shippingDetails['state'] = response.data.data[0].state
        shippingDetails['city'] = response.data.data[0].city
        shippingDetails['orderStatus'] = response.data.data[0].status
        this.setState({shippingDetails})
        console.log(this.state.shippingDetails.orderStatus);
        var products = []
        var quantity = []
        var amount = 0
        for (var i = 0; i < response.data.data.length; i++) {
          for (var j = 0; j < response.data.data[i].OrderInfos.length; j++) {
            products.push(response.data.data[i].OrderInfos[j].Product)
            quantity.push(response.data.data[i].OrderInfos[j].quantity)
            amount += response.data.data[i].OrderInfos[j].price * response.data.data[i].OrderInfos[j].quantity
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
        if (response.data.data[0].status == 'Payment Confirmation Pending') {
          this.setState({
            orderImage:'https://thumbs.dreamstime.com/b/pending-red-stamp-text-white-51923368.jpg'
          })
        }
        else if (response.data.data[0].status == 'Order Placed') {
          this.setState({
            orderImage:'https://cdn4.iconfinder.com/data/icons/customicondesignoffice2/256/success.png'
          })
        }
        else if (response.data.data[0].status == 'Payment Failed') {
          this.setState({
            orderImage:'https://oncheckin.com/assets/blogassets/blog-d888cc31-b202-4676-bdbe-e01432534be7.png'
          })
        }

      }
  })
}
nextClick(e) {
  e.preventDefault();
    cookies.remove('orderId')
  // localStorage.removeItem("orderId");
  browserHistory.push('/dashboard/marketplace')
}
  render() {
    // console.log(this.state.cartItems);
    var items = this.state.products
    var cartItems = items.map((i, index) =>

          <tr><td>{i.name}</td><td>{this.state.quantity[index]}</td><td>{i.price * this.state.quantity[index]}</td></tr>

    )
    return (
      <div>

      <div className="row" style={{textAlign:'center', marginLeft:'30px'}}>
        	<form className={styles.placeorderform}>

            <div className={styles.placeorderdiv}>
              <div className={styles.oderdetailsDiv} style={{flexGrow: '4'}}>
                  <img src={this.state.orderImage} style={{width:'100px', height:'100px',marginTop:'36px'}} alt="Success"/>
                  <h3 style={{marginBottom:'36px',color:'#000'}}>{this.state.shippingDetails.orderStatus}</h3>
                <table className={styles.oderdetailstable}>
                  <tr><td>Mobile Number:</td><td>{this.state.shippingDetails.mobile}</td></tr>
                  <tr><td>Email:</td><td>{this.state.shippingDetails.email}</td></tr>
                  <tr><td>Address:</td><td>{this.state.shippingDetails.address}</td></tr>
                </table>
              </div>
            </div>
            <div className={styles.cartItems}>
                <h3 style={{fontSize:'20px', textAlign:'left'}}>List of Products</h3>
                <table className={styles.listofProducts}>
                  <tr><th>Name</th><th>Quantity</th><th>Price</th></tr>
                  {cartItems}
                </table>
            </div>
              <div style={{textAlign:'right'}}>
                <p style={{marginTop:'25px', fontSize:'23px',fontWeight:'700'}}>Total : {this.state.totalAmount} HUR</p>
                <button style={{textAlign:'right'}} onClick={this.nextClick} style={{marginTop:'30px',padding:'5px 10px', backgroundColor:'#0268a6', color:'#FFFFFF', borderColor:'#0268a6'}}>Continue Shopping</button>
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
