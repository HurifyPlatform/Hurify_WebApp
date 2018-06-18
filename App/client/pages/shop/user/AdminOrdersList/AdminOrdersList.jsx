import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import AuthLayer from './../../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import UserStore from './../../../../stores/UserStore'
import styles from './AdminOrdersList.css'
import Cookies from 'universal-cookie';
import ModalStore from './../../../../stores/ModalStore'
import moment from 'moment'

var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();


class AdminOrdersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      OrdersList:[]
    }
this.editClick = this.editClick.bind(this);
this.onselect = this.onselect.bind(this);
  }
  componentWillMount() {
    if (crypt.decrypt(cookies.get('token')) != '' && crypt.decrypt(cookies.get('token')) != null) {
      if (crypt.decrypt(cookies.get('email')) == "lakshmi.spandana@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "schmouli@hurify.co" || crypt.decrypt(cookies.get('email')) == "russell.murphy@hurify.co" || crypt.decrypt(cookies.get('email')) == "srinidhi.murthy@gmail.com" || crypt.decrypt(cookies.get('email')) == "sripriya.murthy@gmail.com" || crypt.decrypt(cookies.get('email')) == "haleygreen406@gmail.com" || crypt.decrypt(cookies.get('email')) == "ashish@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "syed.bilal.hussain@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "padmanabham.pakki@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "sridharkrishnan73@gmail.com") {
        this.getOrdersListForAdmin();
      }
      else {
        // alert("Coming Soon")
         this.context.router.push('/dashboard/mytoken')


      }
    }
      else {
        browserHistory.push('/')
      }

  }
  getOrdersListForAdmin() {
    let data = {
      token: crypt.decrypt(cookies.get('token'))
    }
    AuthLayer.GetOrderListForAdmin(data).then(response => {
        if (response.data.success){
          console.log("third");
          // console.log(JSON.stringify(response.data.data));
          this.setState({
            OrdersList:response.data.data
          })
        }
        else {

        }
    })
  }
editClick(id) {
  // e.preventDefault();
  cookies.set('editOrder_id', crypt.encrypt(id), { path: '/' });
  browserHistory.push('/dashboard/marketplace/changestatus')
  // ModalStore.setDisplayed('edit_status', true)
}
onselect(e) {
  e.preventDefault();
  if (e.target.value == "Select Option") {
    this.getOrdersListForAdmin();
  }
  else {
    console.log(e.target.value);
    let data = {
      token: crypt.decrypt(cookies.get('token')),
      status: e.target.value
    }
    AuthLayer.getOrdersListBasedonStatus(data).then(response => {
        if (response.data.success){
          console.log("third");
          console.log(JSON.stringify(response.data));
          this.setState({
            OrdersList:response.data.data
          })
        }
        else {

        }
    })
  }
}

  render() {
    var data = this.state.OrdersList
    console.log("first");
    console.log("order iddd ", data);
    var List = data.map((content, index) =>
      <a key={content.id} href="#edit" onClick={() => this.editClick(content.id)}><tr>
          <td>{index + 1}</td>
          <td>{content.OrderInfos[0].orderId}</td>
          <td>{content.email}</td>
          <td>{new moment(new Date(content.createdAt)).format('MM/D/YY')}</td>
          <td>{content.status}</td>
          <td>Edit</td>
      </tr></a>

    );
  return (
      <div className="container" style={{paddingTop:'60px',margin:'0px 110px 20px 20px'}} id="startchange1">
         <div className={styles.orderListDiv}>
             <div className={styles.orderListInnerDiv}>
               <div><h2>Order List</h2></div>
               <div><p className={styles.orderFilter}><span>Filter</span><select onChange={this.onselect}><option>Select Option</option><option>Order Placed</option><option>Payment Confirmation Pending</option><option>Payment Failed</option><option>Delivered</option></select></p></div>
             </div>
             <div style={{width:'100%', margin:'0px auto'}}>
               <table style={{width:'80%',margin:'50px 0px 0px 30px'}} className={styles.orderListTable}>
                 <thead className={styles.thead}>
                 <tr>
                     <th>S.No</th>
                     <th>Order Id</th>
                     <th>Email</th>
                     <th>Date</th>
                     <th>Order Status</th>
                     <th>Edit Status</th>
                 </tr>
                 </thead>
                 <tbody>
                 {List}
               </tbody>
              </table>
            </div>
          </div>

        </div>

    )
  }
}
AdminOrdersList.contextTypes = {
    router: PropTypes.object.isRequired
}
export default AdminOrdersList
