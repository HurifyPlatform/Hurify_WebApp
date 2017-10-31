import { observable, action } from 'mobx'

class UserStore {
    constructor() {
      let lsEmail = localStorage.getItem('email')
      if (lsEmail !== null) {
          this.setEmail(lsEmail)
      }
      let lsName = localStorage.getItem('name')
      if (lsName !== null) {
          this.setName(lsName)
      }
        let lsAccount = localStorage.getItem('account_type')
        if (lsAccount !== null) {
            this.setAccount(lsAccount)
        }
        let lsUserID = localStorage.getItem('UserID')
        if (lsUserID !== null) {
            this.setUserID(lsUserID)
        }
        let lstoken = localStorage.getItem('token')
                  if (lstoken !== null) {
                      this.setToken(lstoken)
        }
        let lsClientid = localStorage.getItem('client_id')
                  if (lsClientid !== null) {
                      this.setClientid(lsClientid)
        }
        let lsProjectId = localStorage.getItem('project_id')
                  if (lsProjectId !== null) {
                      this.setClientid(lsProjectId)
        }
        let lsDevid = localStorage.getItem('devid')
                  if (lsDevid !== null) {
                      this.setDevid(lsDevid)
        }
        let lsProfilePhoto = localStorage.getItem('ProfilePhoto')
                  if (lsProfilePhoto !== null) {
                      this.setProfilePhoto(lsProfilePhoto)
        }

    }
    @observable UserID = null
    @observable token = null
    @observable account_type = null
    @observable email = null
    @observable name = null
    @observable client_id = null
    @observable project_id = null
    @observable devid = null
    @observable ProfilePhoto = null

    @action setToken(token) {
        this.token = token
    }
    @action setUserID(UserID) {
        this.UserID = UserID
    }
    @action setAccount(account_type) {
        this.account_type = account_type
    }
    @action setEmail(email) {
        this.email = email
    }
    @action setName(name) {
        this.name = name
    }
    @action setClientid(client_id) {
        this.client_id = client_id
    }
    @action setProjectId(project_id) {
        this.project_id = project_id
    }
    @action setDevid(devid) {
        this.devid = devid
    }
    @action setProfilePhoto(ProfilePhoto) {
        this.ProfilePhoto = ProfilePhoto
    }
}

const userStore = new UserStore()

export default userStore
