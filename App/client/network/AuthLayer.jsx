import axios from 'axios'
let config = require('./../../config')
var serverAPI = config.serverAPI;

class AuthLayer {
    attemptLogin(user) {
        return axios.post(serverAPI+'/auth/login', user, { validateStatus: () => true }).then(result => {
            return result
        })
    }

    attemptSignUp(user) {
        return axios.post(serverAPI+'/auth/signup', user).then(result => {
            return result
        })
    }

    UpdateProfile(user) {
      console.log('user');
      console.log(user);

      return axios.post(serverAPI+'/apicall/updateuserandaddprofile', user, { validateStatus: () => true }).then(result => {
          return result
      })
    }



    attemptResendVerification(user) {

        return axios.post(serverAPI+'/auth/sendconfirmationagain', user, { validateStatus: () => true }).then(result => {
            return result
        })
    }
    authenticateUser(token, email) {
        localStorage.setItem('token', token)
        localStorage.setItem('email', email)
    }

    forgotPassword(user) {
      return axios.post(serverAPI+'/auth/forgotpassword', user, { validateStatus: () => true }).then(result => {
          return result
      })
    }
    updateForgotPassword(user) {
      return axios.post(serverAPI+'/auth/updateforgotpassword', user, { validateStatus: () => true }).then(result => {
          return result
      })
    }

    checkResetToken(user) {
        return axios.post(
            '/auth/checktoken/',
	    user,
            {
                validateStatus: (status) => {
                    return status < 500
                }
            }
        ).then(result => {
            return result
        })
    }

    resetPassword(user) {
        return axios.post(
            '/auth/reset/',
            user,
            {
                validateStatus: (status) => {
                    return status < 500
                }
            }
        ).then(result => {
            return result
        })
    }

    confirmEmail(user) {
        return axios.get(serverAPI+'/auth/confirmregistration/' + user.token).then(result => {
            return result
        });
    }

    ProfileType(user) {
      return axios.post(
          '/auth/profiletype/',
          user,
          {
              validateStatus: (status) => {
                  return status < 500
              }
          }
      ).then(result => {
          return result
      })
    }


    getProfileDetails(user) {

      return axios.post(serverAPI+'/apicall/getuserprofile/', user, { validateStatus: () => true }).then(result => {
          return result
      })
    }

    editProfile(user) {

      return axios.post(serverAPI+'/apicall/edituserprofile/', user, { validateStatus: () => true }).then(result => {
          return result
      })
    }


    createProject(user) {
        return axios.post(serverAPI+'/apicall/addproject/', user, { validateStatus: () => true }).then(result => {
          return result
      })
    }
    HURcheck(user) {
      return axios.post(serverAPI+'/apicall/checkhurbalance/', user, { validateStatus: () => true }).then(result => {
        return result
    })
    }










    checkAccount(user) {
      return axios.post(
          '/auth/checkacc/',
          user,
          {
              validateStatus: (status) => {
                  return status < 500
              }
          }
      ).then(result => {
          return result
      })
    }







findProject(user) {

      return axios.post(

          '/project/findproject/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }





    projectDetails(user) {

      return axios.post(

          '/project/getprojectdetails/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }

projectStatus(user) {

      return axios.post(

          '/project/viewproject/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }


StatusProjectDesc(user) {

      return axios.post(

          '/project/getprojectdetails/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }


applyProject(user) {

      return axios.post(

          '/project/apply/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }

appliedProjects(user) {

      return axios.post(

          '/project/applied/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }

appliedUsers(user) {

      return axios.post(

          '/project/getappliedusers/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }

appliedUserProfile(user) {

      return axios.post(

          '/auth/getfreelancerprofile/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })
}

  checkIfAccountExist(user) {

      return axios.post(

          '/auth/checkprofile/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

    }

appliedProjectDetails(user) {
	return axios.post(

          '/project/getprojectdetails/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

}

accept(user) {
        return axios.post(

          '/project/approve/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

}

reject(user) {
        return axios.post(

          '/project/reject/',

          user,

          {

              validateStatus: (status) => {

                  return status < 500

              }

          }

      ).then(result => {

          return result

      })

}


    isUserAuthenticated() {
        return localStorage.getItem('token') !== null
    }

    deauthenticateUser() {
        localStorage.removeItem('token')
    }

    getToken() {
        return localStorage.getItem('token')
    }
}

const authLayer = new AuthLayer()
export default authLayer
