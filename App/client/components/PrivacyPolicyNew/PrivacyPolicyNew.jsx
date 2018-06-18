import React from 'react'
import resendStyles from './PrivacyPolicyNew.css'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import ModalStore from './../../stores/ModalStore'

@observer
class PrivacyPolicyNew extends React.Component {
  constructor(props){
    super(props)
    this.state = {

      }
      this.hide = this.hide.bind(this);
  }
  hide(e) {
    e.preventDefault()
    ModalStore.setDisplayed('privacy_policy', false)
  }
  render() {
  return(
    <div className={resendStyles.formContainer + (ModalStore.modalDisplayed['privacy_policy'] == false ? (' ' + resendStyles.close) : '')}>
      <form action='/' onSubmit={this.SubmitQuery}>
        <a onClick={this.hide} href="#close" title="Close" className={resendStyles.closeButton}>X</a>
        <div className={resendStyles.content}>
            <embed src="https://platform.hurify.co:1800/public/shared/platform/Online_policies/Hurify_PRIVACY.pdf" width="100%" height="100%" />
        </div>
      </form>
    </div>
  )
}

}
export default PrivacyPolicyNew
