import React from 'react'
import {Field, reduxForm} from 'redux-form'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import AuthLayer from './../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import '../scss/style.scss';
import moment from 'moment'
import ReasonOfCancellation from './../ReasonOfCancellation/ReasonOfCancellation'
import ModalStore from './../../../stores/ModalStore'

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
    this.getAllCancelledOrdersOfUser();
    // this.setState({
    //   List:this.state.ordersList,
    //   total:this.state.totalOrders
    // })
  }

getAllOrdersOfUser() {
  const data = {
    token:localStorage.getItem('token'),
    userId:localStorage.getItem('userId')
  }
  AuthLayer.getAllOrdersOfUser(data)
  .then(response => {
    // alert(JSON.stringify(response.data));
    console.log(JSON.stringify(response.data));
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
    token:localStorage.getItem('token'),
    userId:localStorage.getItem('userId')
  }
  AuthLayer.getAllCancelledOrdersOfUser(data)
  .then(response => {
    // alert(JSON.stringify(response.data));
    console.log(JSON.stringify(response.data));
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
  localStorage.setItem('cancelOrderId', id)
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
    var btnArr = [];
    var items = this.state.List
    var sampleArray = items.map((i, index) => {
		 if (i.status == "Cancelled"){
				 btnArr.push("")
		 }
		 else {
			 btnArr.push(<button onClick={() => this.cancelPlacedOrder(i.id)}>Cancel Order</button>)
		 }
   })

    const ordersList = items.map((i, index) =>
      <div className="orders-list">
        <div style={{width:'100%', borderBottom:'1px solid #ccc',height:'60px',padding:'10px'}}>
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
      <header>
          <div className="container">
              <div className="brand" style={{paddingLeft:'20px'}}>
                  <img className="basicHeaderLogo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" alt="HURIFY"/>
              </div>
              <div style={{width:'50%', color:'#fff',marginTop:'20px'}}>
                <div className="bc-icons-2" style={{color:'#fff'}}>
                  <ol className="breadcrumb indigo lighten-4" style={{color:'#fff'}}>
                      <li className="breadcrumb-item" style={{float:'left', color:'#fff',marginLeft:'20px'}}><a className="black-text" href="/home" style={{color:'#fff'}}>Home</a><i className="fa fa-caret-right mx-2" aria-hidden="true" style={{marginLeft:'20px',marginRight:'20px'}}></i></li>
                      <li className="breadcrumb-item active" style={{color:'#D0D3D4',marginLeft:'20px'}}>MyOrders</li>
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
        <div className='myorders'>
          <h1>Your Orders</h1>
          <div style={{marginTop:'30px', marginBottom:'10px',width:'900px'}}>
            <a href="#totalOrders" onClick={this.ordersClick}>Orders</a>
            <a href="#cancelledOrders" onClick={this.cancelledOrdersClick} style={{marginLeft:'60px'}}>Cancelled Orders</a>
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
