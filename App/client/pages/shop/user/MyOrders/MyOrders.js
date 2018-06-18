import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import AuthLayer from './../../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import moment from 'moment'
import ReasonOfCancellation from './../ReasonOfCancellation/ReasonOfCancellation'
import Header from '../../UserComponents/Header';
import ModalStore from './../../../../stores/ModalStore'
import Cookies from 'universal-cookie';

var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();
class MyOrders extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      List:[],
      total:0,
      ordersList: [],
      cancelledOrdersList:[],
      totalOrders:0,
      totalCancelledOrders:0

    };
    this.ordersClick = this.ordersClick.bind(this);
    this.cancelledOrdersClick = this.cancelledOrdersClick.bind(this);
    this.cancelPlacedOrder = this.cancelPlacedOrder.bind(this);
  }

  componentWillMount() {
    this.getAllOrdersOfUser();
    //this.getAllCancelledOrdersOfUser();
    // this.setState({
    //   List:this.state.ordersList,
    //   total:this.state.totalOrders
    // })
  }

getAllOrdersOfUser() {
  //alert(crypt.decrypt(cookies.get('UserID')))
  const data = {
    token:crypt.decrypt(cookies.get('token')),
    userId:crypt.decrypt(cookies.get('UserID'))
  }
  AuthLayer.getAllOrdersOfUser(data)
  .then(response => {
    //alert(JSON.stringify(response.data));
    //console.log(JSON.stringify(response.data));
      if (response.data.success){
        this.setState({
          ordersList:response.data.data,
          totalOrders:response.data.data.length,
          List:response.data.data,
          total:response.data.data.length
        })
      }
  })
}
getAllCancelledOrdersOfUser() {
  const data = {
    token:crypt.decrypt(cookies.get('token')),
    userId:crypt.decrypt(cookies.get('UserID'))
  }
  AuthLayer.getAllCancelledOrdersOfUser(data)
  .then(response => {
    // alert(JSON.stringify(response.data));
    //console.log(JSON.stringify(response.data));
      if (response.data.success){
        this.setState({
          cancelledOrdersList:response.data.data,
          totalCancelledOrders:response.data.data.length
        })
      }
  })
}
ordersClick() {
  this.setState({
    List:this.state.ordersList,
    total:this.state.totalOrders
  })
}
cancelledOrdersClick() {
  this.setState({
    List:this.state.cancelledOrdersList,
    total:this.state.totalCancelledOrders
  })
}
cancelPlacedOrder(id) {
  cookies.set('cancelOrderId', crypt.encrypt(id), { path: '/' });
  // localStorage.setItem('cancelOrderId', id)
  ModalStore.setDisplayed('reason', true)

  // const data = {
  //   token:localStorage.getItem('token'),
  //   orderId:id,
  //   reason:"Wrong product ordered",
  //   walletAddress:"0x50E516526Cc792698faE29fcf4444084668C4Aa8"
  // }
  // console.log("data", data);
  // AuthLayer.cancelPlacedOrder(data)
  // .then(response => {
  //   // alert(JSON.stringify(response.data));
  //   console.log(JSON.stringify(response.data));
  //     if (response.data.success){
  //
  //     }
  // })
}
  render() {
    //console.log("hello",JSON.stringify(this.state.List))
    var btnArr = [];
    var items = this.state.List
    var sampleArray = items.map((i, index) => {
		 if (i.status == "Cancelled"){
				 btnArr.push("")
		 }
		 else {
			 btnArr.push(<button onClick={() => this.cancelPlacedOrder(i.id)} style={{display:'none'}}>Cancel Order</button>)
		 }
   })

    const ordersList = items.map((i, index) =>
      <div className="orders-list">
        <div style={{width:'100%', borderBottom:'1px solid #ccc',height:'80px',padding:'10px'}}>
          <div style={{width:'20%',float:'left'}}>
            <p>Order Placed</p>
            <p style={{paddingTop:'8px'}}>{new moment(new Date(i.createdAt)).format('MM/D/YY')}</p>
          </div>
          <div style={{float:'left', width:'20%'}}>
            <p>Total</p>
            <p style={{paddingTop:'8px'}}>{i.price} HUR</p>
          </div>
          <div style={{float:'left',width:'20%'}}>
            <p>Ship to</p>
            <p style={{paddingTop:'8px'}}>{i.name}</p>
          </div>
          <div>
            <p>Order No</p>
            <p style={{paddingTop:'8px'}}>{i.orderNo}</p>
          </div>
        </div>


        <div className="productDetails" style={{paddingBottom:'10px',paddingLeft:'10px'}}>
          <h2 style={{paddingTop:'10px'}}>{i.status}</h2>
          <div className="ProductOderlist">
            <div className="Oderproductslist" style={{flexGrow: '8'}}>
            {i.OrderInfos.map((i) =>
              <div className="Oders">
                <div>
                  <img src={i.Product.image} style={{width:'120px', height:'120px',padding:'20px 10px 10px 10px'}} alt="hurify" />
                </div>
                <div style={{padding:'30px 10px 10px 10px'}}>
                  <div style={{paddingLeft:'15px'}}>{i.Product.name}</div>
                  <div style={{paddingTop:'10px',paddingLeft:'15px'}}>Sold by: Hurify</div>
                  <div style={{paddingTop:'10px',paddingLeft:'15px'}}>{i.Product.price} HUR</div>
                  <div style={{paddingTop:'10px',paddingLeft:'15px'}}>Manufactured by: <span style={{marginLeft:'5px', fontWeight:'600', fontSize:'18px'}}>{i.Product.manufacturer}</span></div>
                </div>
              </div>
            )}

            </div>
            <div style={{flexGrow: '2',alignSelf: 'center',display:i.status != "Cancelled"}}>
              {btnArr[index]}
            </div>
          </div>
        </div>
      </div>
    )
    return (
      <div>
        <div className='myorders' style={{padding:'25px 100px 25px 100px'}}>

          <div style={{marginTop:'100px', marginBottom:'10px',width:'900px'}}>
            <a href="#totalOrders" onClick={this.ordersClick}>Orders</a>
            <a href="#cancelledOrders" onClick={this.cancelledOrdersClick} style={{marginLeft:'60px', display:'none'}}>Cancelled Orders</a>
          </div>
          <hr />
          <div className="normaltext">{this.state.total} Orders placed</div>
            {ordersList}
        </div>
        <ReasonOfCancellation/>
      </div>

    );
  }
}
MyOrders.contextTypes = {
    router: PropTypes.object.isRequired
}
export default MyOrders
