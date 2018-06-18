import { observable, action } from 'mobx'

class ModalStore {
  @observable modalDisplayed = {}

  constructor() {
    this.modalDisplayed = {
      'confirm' : false,
      'forgot' : false,
      'newpass' : false,
      'apply' : false,
      'successPop' : false,
      'HUR' : false,
      'HUR_amount' : false,
      'project_success' : false,
      'support' : false,
      'reason' : false,
      'privacy_policy' : false,
      'terms' : false,
      'edit_status' : false,
      'cookies_popup' : false,
      'cookie_policy' : false,
      'gdpr_policy' : false,
      'privacy_policy_dashboard' : false,
      'cookie_policy_dashboard' : false,
      'retension_policy' : false
    }
  }

  @action setDisplayed(page, value) {
    //console.log(page)
    //console.log(value)
    //console.log("displayed");
    Object.keys(this.modalDisplayed).forEach((key) => {
      this.modalDisplayed[key] = false
    })
    this.modalDisplayed[page] = value
  }
}

const modalStore = new ModalStore()
export default modalStore
