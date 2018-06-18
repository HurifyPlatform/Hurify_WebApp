import React from 'react'
import resendStyles from './UpdateStatus.css'
import PropTypes from 'prop-types'
import {Link} from 'react-router'
import { observer } from 'mobx-react'
import ModalStore from './../../../../stores/ModalStore'
import Cookies from 'universal-cookie';
import AuthLayer from './../../../../network/AuthLayer'
var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();
import moment from 'moment'
class UpdateStatus extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      values: {
        status:'',
        trackingURL:''
      },
      ordersList:[],
      totalOrders:0,
      List:[],
      total:0
      }
      this.hide = this.hide.bind(this);
      this.changeValue = this.changeValue.bind(this);
      this.SubmitForm = this.SubmitForm.bind(this);
  }
  componentWillMount() {
    this.getProductsBasedonId();
  }
  getProductsBasedonId() {
    let data = {
      token: crypt.decrypt(cookies.get('token')),
      orderId:crypt.decrypt(cookies.get('editOrder_id'))
    }
    AuthLayer.getProductsBasedonId(data).then(response => {
      if (response.data.success){
        this.setState({
          ordersList:response.data.data,
          totalOrders:response.data.data.length,
          List:response.data.data,
          total:response.data.data.length
        })
          console.log("sending data", this.state.List);
      }
      else {

      }

    })
  }
  hide(e) {
    e.preventDefault()
    ModalStore.setDisplayed('edit_status', false)
  }
  changeValue(event) {
    event.preventDefault();
    console.log(event.target.name);
    const field = event.target.name
    const user = this.state.values
    user[field] = event.target.value
    this.setState({user})
  }
  SubmitForm(e) {
    e.preventDefault();
    let data = {
      token: crypt.decrypt(cookies.get('token')),
      status: this.state.values.status,
      trackingURL: this.state.values.trackingURL,
      id:crypt.decrypt(cookies.get('editOrder_id')),
      orderNo: this.state.List[0].orderNo
    }
    console.log("sending data", this.state.List);
    AuthLayer.updateStatusandTrackingURL(data).then(response => {
        if (response.data.success){
          console.log("third");
          console.log(JSON.stringify(response.data));
          this.getProductsBasedonId();
          // this.setState({
          //   OrdersList:response.data.data
          // })
        }
        else {

        }
    })
  }
  render() {
    var btnArr = [];
    var items = this.state.List
    var sampleArray = items.map((i, index) => {
     if (i.status == "Cancelled"){
         btnArr.push("")
     }
     else {
       btnArr.push(<div style={{textAlign:'center'}}><div className={this.totalContent}><select name='status' className={resendStyles.select} onChange={this.changeValue}><option>Select Status</option><option>Order Placed</option><option>Payment Confirmation Pending</option><option>Delivered</option></select></div><div className={this.totalContent}><input name='trackingURL' className={resendStyles.select} type="text" placeholder="Enter tracking URL" onChange={this.changeValue} required/></div><button className={resendStyles.button} onClick={this.SubmitForm}>Submit</button></div>)
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
        <div className='myorders' style={{padding:'105px 100px 25px 100px'}}>


            {ordersList}
          </div>

      </div>

    );
  }
}
//   return(
//     <div className={resendStyles.formContainer + (ModalStore.modalDisplayed['edit_status'] == false ? (' ' + resendStyles.close) : '')}>
//       <form action='/' onSubmit={this.SubmitForm}>
//         <a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
//         <div className={resendStyles.content}>
//             <div className={this.totalContent}><select name='status' className={resendStyles.select} onChange={this.onselect}><option>Select Status</option><option>Order Placed</option><option>Payment Confirmation Pending</option><option>Payment Failed</option><option>Delivered</option></select></div>
//             <div className={this.totalContent}><input name='trackingURL' className={resendStyles.select} type="text" placeholder="Enter tracking URL" onChange={this.changeValue} required/></div>
//             <button className={resendStyles.button}>Submit</button>
//         </div>
//       </form>
//     </div>
//   )
// }
//
// }
export default UpdateStatus
