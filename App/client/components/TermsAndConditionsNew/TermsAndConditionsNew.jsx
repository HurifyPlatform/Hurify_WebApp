import React from 'react'
import resendStyles from './../PrivacyPolicyNew/PrivacyPolicyNew.css'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'

@observer
class TermsAndConditionsNew extends React.Component {
  constructor(props){
    super(props)
    this.state = {

      }
      this.hide = this.hide.bind(this);
  }
  hide(e) {
    e.preventDefault()
    ModalStore.setDisplayed('terms', false)
  }
  render() {
  return(
    <div className={resendStyles.formContainer + (ModalStore.modalDisplayed['terms'] == false ? (' ' + resendStyles.close) : '')}>
      <form action='/' onSubmit={this.SubmitQuery}>
        <a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
        <div className={resendStyles.content}>
            <embed src="https://platform.hurify.co:1800/public/shared/platform/Online_policies/HurifyTermsAndConditions.pdf" width="100%" height="100%" />
        </div>
      </form>
    </div>
  )
}

}
export default TermsAndConditionsNew
