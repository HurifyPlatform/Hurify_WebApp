import React from 'react'
import resendStyles from './../PrivacyPolicyNew_Dashboard/PrivacyPolicyNew.css'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'

@observer
class DataRetensionPolicy extends React.Component {
  constructor(props){
    super(props)
    this.state = {

      }
      this.hide = this.hide.bind(this);
  }
  hide(e) {
    e.preventDefault()
    ModalStore.setDisplayed('retension_policy', false)
  }
  render() {
  return(
    <div className={resendStyles.formContainer + (ModalStore.modalDisplayed['retension_policy'] == false ? (' ' + resendStyles.close) : '')}>
      <form action='/' onSubmit={this.SubmitQuery}>
        <a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
        <div className={resendStyles.content}>
            <embed src="https://hurify.co/wp-content/uploads/2018/05/02.6_Data_Retention_Policy_EN.pdf" width="100%" height="100%" />
        </div>
      </form>
    </div>
  )
}

}
export default DataRetensionPolicy
