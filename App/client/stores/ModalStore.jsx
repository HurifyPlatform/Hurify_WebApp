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
      'project_success' : false
    }
  }

  @action setDisplayed(page, value) {
    Object.keys(this.modalDisplayed).forEach((key) => {
      this.modalDisplayed[key] = false
    })
    this.modalDisplayed[page] = value
  }
}

const modalStore = new ModalStore()
export default modalStore
