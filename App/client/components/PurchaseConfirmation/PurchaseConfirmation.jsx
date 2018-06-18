import React from 'react'
import styles from './PurchaseConfirmation.css'
import AuthLayer from './../../network/AuthLayer'
import ModalStore from './../../stores/ModalStore'
import axios from 'axios'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import Cookies from 'universal-cookie'
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class PurchaseConfirmation extends React.Component {
  constructor(props) {
        super(props);
        this.state={
          tokenCustomers:[],
          user:{
            token:'',
            customerId:'',
            noOfTokens:'',
	    HURTransactionHash : ''
            }
        }
        this.changeUser = this.changeUser.bind(this);
        this.HURTokenSubmit = this.HURTokenSubmit.bind(this);
      }

    componentWillMount() {
      if((crypt.decrypt(cookies.get('email')) =="schmouli@hurify.co") || (crypt.decrypt(cookies.get('email')) =="timgalvin@hurify.co") || (crypt.decrypt(cookies.get('email')) =="lspandana1995@gmail.com")){
        var user = {};
        user["token"] = crypt.decrypt(cookies.get('token'))
      AuthLayer.allExistingUsers(user).then(response => {
          //alert(JSON.stringify(response.data))
          if (response.data.success) {
            this.setState({
              tokenCustomers :response.data.data.rows
            })
          }
        }).catch(err => {console.log(err)})
  		}
      else {
        this.context.router.push('/dashboard/mytoken')
      }

    }

    changeUser(event) {
        const field = event.target.name
        const user = this.state.user
        user[field] = event.target.value
        this.setState({
            user
        })
        //alert(JSON.stringify(user))
    }

    HURTokenSubmit(event){
      event.preventDefault();

       this.state.user.token = crypt.decrypt(cookies.get('token'))
      if(this.state.user.customerId == "0"){
        alert("please select user");
      }
      else if(this.state.user.customerId == ""){
        alert("please select user");
      }

      else if(this.state.user.noOfTokens == ""){
        alert("please enter the HUR");
      }

      else if(this.state.user.HURTransactionHash == ""){
        alert("please enter the Transaction Hash.");
      }
      //alert(JSON.stringify(this.state.user))
      else{
      AuthLayer.purchaseConfirmationSubmit(this.state.user).then(response => {
          //alert(JSON.stringify(response.data))
            if (response.data.success) {
              alert("Email sent Successfully")
               window.location.reload(true)
            }
            else{
              alert("Email sent Failed");
            }
        })
      }
    }



    render() {
      //alert(JSON.stringify(this.state.tokenCustomers))
    let optionTemplate = this.state.tokenCustomers.map(v => (
      <option value={v.id}>{v.email}</option>
    ));
      return(
        <div className="row" style={{padding:'100px 50px 50px 80px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'90vh'}}>
          <div className={styles.well}>
            <div className="row" style={{margin:'10px 50px',padding:'20px 25px'}}>
              <h3 className="text-center" style={{color:'#000'}}>Purchase Confirmation Form </h3>
              <div className="row">
                <div className="col-md-12">
                  <div id ="formGroupcountry" className="form-group" style={{ border:'1px solid #ccc', borderRadius:'4px', padding:'10px'}}>
                    <label for="sel1" className={styles.fieldname}>Select Email<span className="kv-reqd">*</span></label>
                    <select className="form-control" id="tokenCustomers" name="customerId" onChange={this.changeUser} requried>
                      <option value="0">Select Email</option>
                      {optionTemplate}
                    </select>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group" style={{ border:'1px solid #ccc', borderRadius:'4px', padding:'10px'}}>
                    <label for="noOfTokens" className={styles.fieldname}>HUR tokens transferred<span className="kv-reqd">*</span></label>
                    <input type="text" className="form-control" name="noOfTokens" onChange={this.changeUser} required/>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="form-group" style={{ border:'1px solid #ccc', borderRadius:'4px', padding:'10px'}}>
                    <label for="TransactionHash" className={styles.fieldname}>Transaction Hash<span className="kv-reqd">*</span></label>
                    <input type="text" className="form-control" name="HURTransactionHash" onChange={this.changeUser} required/>
                  </div>
                </div>
              </div>
              <div className="row" style={{padding:'15px 15px'}}>
                <div className="text-center">
                  <button type="button" className="btn btn-primary btn-md" onClick={this.HURTokenSubmit} style={{color:'#ffffff',backgroundColor: '#4FC3F7'}}>Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
}
PurchaseConfirmation.contextTypes = {
    router: PropTypes.object.isRequired
}
export default PurchaseConfirmation
