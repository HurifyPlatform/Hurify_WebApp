import axios from 'axios'
let config = require('./../../config')
var serverAPI = config.serverAPI;
class AuthLayer {
  attemptLogin(user) {
    return axios.post(serverAPI + '/auth/login', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  attemptSignUp(user) {
    return axios.post(serverAPI + '/auth/signup', user).then(result => {
      return result
    })
  }

  UpdateProfile(user) {
    console.log('user');
    console.log(user);

    return axios.post(serverAPI + '/apicall/addprofile', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  attemptResendVerification(user) {

    return axios.post(serverAPI + '/auth/sendconfirmationagain', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  authenticateUser(token, email) {
    localStorage.setItem('token', token)
    localStorage.setItem('email', email)
  }

  forgotPassword(user) {
    return axios.post(serverAPI + '/auth/forgotpassword', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  updateForgotPassword(user) {
    return axios.post(serverAPI + '/auth/updateforgotpassword', user, { validateStatus: () => true }).then(result => {
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
    return axios.get(serverAPI + '/auth/confirmregistration/' + user.token).then(result => {
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

    return axios.post(serverAPI + '/apicall/getuserprofile/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  editProfile(user) {

    return axios.post(serverAPI + '/apicall/edituserprofile/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }


  createProject(user) {
    return axios.post(serverAPI + '/apicall/addproject/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  HURcheck(user) {
    return axios.post(serverAPI + '/apicall/checkhurbalance/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  PostedProjectsList(user) {
    return axios.post(serverAPI + '/apicall/viewpostedprojects/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  PostedProjectDesc(user) {
    return axios.post(serverAPI + '/apicall/getsingleprojectdetails/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  FindProjects(user) {
    return axios.post(serverAPI + '/apicall/findproject/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  ApplyProject(user) {
    return axios.post(serverAPI + '/apicall/applyproject/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  AppliedProjectsList(user) {
    return axios.post(serverAPI + '/apicall/viewappliedprojects/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  EditProject(user) {
    return axios.post(serverAPI + '/apicall/editproject/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  DeleteProject(user) {
    return axios.post(serverAPI + '/apicall/deleteproject/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  UpdateProjectStatus(user) {
    return axios.post(serverAPI + '/apicall/updateprojectstatus/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  AcceptForNegociation(user) {
    return axios.post(serverAPI + '/apicall/selectdeveloperforevaluation/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  NegociationAccept(user) {
    return axios.post(serverAPI + '/apicall/sendnegotiationformtodeveloper/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  rejectSelectedDeveloper(user) {
    return axios.post(serverAPI + '/apicall/discardselecteddeveloper/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  DeveloperAceeptNegociation(user) {
    return axios.post(serverAPI + '/apicall/developeracceptsnegotiationform/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  DeveloperRejectNegociation(user) {
    return axios.post(serverAPI + '/apicall/developerrejectsnegotiationform/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  GenerateEscRowAgreementdoc(user) {
    return axios.post(serverAPI + '/apicall/generateescrowpdf/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  DeployContract(user) {
    return axios.post(serverAPI + '/apicall/deployagreement/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  DeveloperAcceptsContract(user) {
    return axios.post(serverAPI + '/apicall/developeracceptscontract/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  DeveloperInitiatePayment(user) {
    return axios.post(serverAPI + '/apicall/developerclaimsforpayment/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  ClientRejectsPayment(user) {
    return axios.post(serverAPI + '/apicall/clientrejectspayment/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  FeedbackForDeveloper(user) {
    return axios.post(serverAPI + '/apicall/addfeedback/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  Unlock(user) {
    return axios.post(serverAPI + '/apicall/unlock/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  updatePaymentAddress(user) {
    return axios.post(serverAPI + '/apicall/addpaymentaddress/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }


  // addTokensaleData(user) {
  //   return axios.post(serverAPI+'/apicall/addtokensaledata/', user, { validateStatus: () => true }).then(result => {
  //     return result
  //   })
  // }

  updateTokenlotData(user) {
    return axios.post(serverAPI + '/apicall/tokenform2/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  directPurchaseData(user) {
    return axios.post(serverAPI + '/apicall/tokenform3/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  UpdateUserAccountType(user) {
    return axios.post(serverAPI + '/apicall/updateuseraccounttype/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  GetTokensaleData(user) {
    return axios.post(serverAPI + '/apicall/gettokensaledata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  UpdateTokensaleData(user) {
    return axios.post(serverAPI + '/apicall/updatetokensaledata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getNotifications(user) {
    return axios.post(serverAPI + '/apicall/getnotifications/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getReferralCode(user) {
    return axios.post(serverAPI + '/apicall/getreferralcode/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getReferredUsers(user) {
    return axios.post(serverAPI + '/apicall/getreferreduserscount/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  addAirdropData(user) {
    return axios.post(serverAPI + '/apicall/addairdropdata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  developerDashboard(user) {
    return axios.post(serverAPI + '/apicall/developerdashboard/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  clientDashboard(user) {
    return axios.post(serverAPI + '/apicall/clientdashboard/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  CheckAirdropData(user) {
    return axios.post(serverAPI + '/apicall/checkifairdropdataexists/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  SubmitQueryAfterLogin(user) {
    return axios.post(serverAPI + '/apicall/adduserqueryafterlogin/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  SubmitQueryBeforeLogin(user) {
    return axios.post(serverAPI + '/auth/adduserquerybeforelogin/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  AddTokenWhitelistData(user) {
    return axios.post(serverAPI + '/apicall/addtokensalewhitelistdata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  checkWhitelistData(user) {
    return axios.post(serverAPI + '/apicall/checkiftokensalewhitelistdataexists/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  CheckUserData(user) {
    return axios.post(serverAPI + '/apicall/getuserdetails/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  checkTokensaleData(user) {
    return axios.post(serverAPI + '/apicall/checkiftokensaledataexists/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getCurrencyWaaletAddress(user) {
    return axios.post(serverAPI + '/apicall/gettokencurrencyandwalletaddress/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  allExistingUsers(user) {
    return axios.post(serverAPI + '/apicall/gettokensaleusers/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  purchaseConfirmationSubmit(user) {
    return axios.post(serverAPI + '/apicall/updatetokensaledatawithnooftokens/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getUnsolvedQueries(user) {
    return axios.post(serverAPI + '/apicall/getallunsolveduserqueries/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getQueryDetails(user) {
    return axios.post(serverAPI + '/apicall/getuserquerybyid/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  resolutionSubmit(user) {
    return axios.post(serverAPI + '/apicall/sendresolutionforuserquery/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  addTelegramBountyData(user) {
    return axios.post(serverAPI + '/apicall/addtelegrambountydata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getTelegramBountyData(user) {
    return axios.post(serverAPI + '/apicall/gettelegrambountydatabyemail/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getProductHuntBountyData(user) {
    return axios.post(serverAPI + '/apicall/getproducthuntbountydatabyemail/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  addProductHuntBountyData(user) {
    return axios.post(serverAPI + '/apicall/addproducthuntbountydata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getTotalStakesEarnedByUser(user) {
    return axios.post(serverAPI + '/apicall/gettotalstakesearnedbyuser/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  addKYCdata(user) {
    return axios.post(serverAPI + '/apicall/addkycdata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  checkKYCdata(user) {
    return axios.post(serverAPI + '/apicall/checkifkycdataexists/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  updateTokenSaleWithTransactionHash(user) {
    return axios.post(serverAPI + '/apicall/updatetokensalewithtransactionhash/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  updateHURTokens(user) {
    return axios.post(serverAPI + '/apicall/updatetokensalewithhurtokens/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  addAnotherTokensaleTransaction(user) {
    return axios.post(serverAPI + '/apicall/addanothertransactionintokensale/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getAllTokenData(user) {
    return axios.post(serverAPI + '/apicall/getalltokensaledata/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  validateTransactionHash(user) {
    return axios.post(serverAPI + '/apicall/gettransactionbyhash/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getCurrencyConversionValue(user) {
    return axios.post(serverAPI + '/apicall/getcurrencyconversionvalue/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  bestRatedDevelopers(user) {
    return axios.post(serverAPI + '/apicall/bestrateddeveloperslist/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  bestRatedClients(user) {
    return axios.post(serverAPI + '/apicall/bestratedclientslist/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  topProjectsBasedOnBids(user) {
    return axios.post(serverAPI + '/apicall/topprojectsbasedonbids/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  topProjectsBasedOnPrice(user) {
    return axios.post(serverAPI + '/apicall/topprojectsbasedonprice/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getAllProjectsCount(user) {
    return axios.post(serverAPI + '/apicall/getallprojectscount/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  profileCompleteness(user) {
    return axios.post(serverAPI + '/apicall/profilecompletenesspercentage/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getReferralCount(user) {
    return axios.post(serverAPI + '/apicall/getreferralcount/', user).then(result => {
      return result
    })
  }
  UpdateUserWalletAddress(user) {
    return axios.post(serverAPI + '/apicall/updateuserwalletaddress/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  totalReferralStakes(user) {
    return axios.post(serverAPI + '/apicall/getalluserstakes/', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }




  getAllProducts(user) {
    return axios.post(serverAPI + '/apicall/getallproducts', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  addProductsToCart(user) {
    return axios.post(serverAPI + '/apicall/addproductstocart', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getCartProducts(user) {
    return axios.post(serverAPI + '/apicall/getcartproducts', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  removeCartProducts(user) {
    return axios.post(serverAPI + '/apicall/removeproductsfromcart', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  addOrderDetails(user) {
    return axios.post(serverAPI + '/apicall/addorderdetails', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getProductDescription(user) {
    return axios.post(serverAPI + '/apicall/getproductdescription', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getOrderDetails(user) {
    return axios.post(serverAPI + '/apicall/getsuccessfulorderinfo', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getAllOrdersOfUser(user) {
    return axios.post(serverAPI + '/apicall/getallordersforuser', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getAllCancelledOrdersOfUser(user) {
    return axios.post(serverAPI + '/apicall/getallcancelledordersforuser', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  cancelPlacedOrder(user) {
    return axios.post(serverAPI + '/apicall/cancelplacedorder', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getProductCategoriesAndCount(user) {
    return axios.post(serverAPI + '/apicall/getproductcategoriesandcount', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getProductForAllCategories(user) {
    return axios.post(serverAPI + '/apicall/getproductsforeachcategories', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }


  getFilterProductsBasedOnCategory(user) {
    return axios.post(serverAPI + '/apicall/filterproductsbasedoncategory', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getproductsubcategoriesandcount(user) {
    return axios.post(serverAPI + '/apicall/getproductsubcategoriesandcount', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }

  getproductbasedonsubcategories(user) {
    return axios.post(serverAPI + '/apicall/getproductbasedonsubcategories', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }


  getCaptcha(user) {
    return axios.get(serverAPI + '/auth/captcha', user).then(result => {
      return result
    })
  }
  editProductsInCart(user) {
    return axios.post(serverAPI + '/apicall/editproductsincart', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  GetOrderListForAdmin(user) {
    return axios.post(serverAPI + '/apicall/getallorderslistforadmin', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getOrdersListBasedonStatus(user) {
    return axios.post(serverAPI + '/apicall/getorderslistbasedonstatusforadmin', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  updateStatusandTrackingURL(user) {
    return axios.post(serverAPI + '/apicall/updateorderstatusandtrackingdetailsbyadmin', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  getProductsBasedonId(user) {
    return axios.post(serverAPI + '/apicall/getproductsbasedonorderid', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }
  updateCookiePolicyFlag(user) {
    return axios.post(serverAPI + '/apicall/updatecookiepolicyflag', user, { validateStatus: () => true }).then(result => {
      return result
    })
  }


  //KYC Form   
  registerUser(user) {
    return axios.post('https://p4.cynopsis.co/artemis_hurify_uat/default/individual_risk', user, {
      headers: {
        "Content-Type": "application/json",
        "WEB2PY-USER-TOKEN": "df0247d3-b100-499f-8148-4b5e185abdcc"
      }
    }).then(result => {
      return result
    })
  }
}

const authLayer = new AuthLayer()
export default authLayer
