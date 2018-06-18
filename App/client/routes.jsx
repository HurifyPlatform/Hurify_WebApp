import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './containers/App/App'
import Dashboardpage from './pages/Dashboardpage/Dashboardpage'
import Loginpage from './pages/Loginpage/Loginpage'
import RegisteredPage from './pages/RegisteredPage/RegisteredPage'
import DeveloperViewProfile from './components/DeveloperViewProfile/DeveloperViewProfile'
import DeveloperProfileUpdate from './components/DeveloperProfileUpdate/DeveloperProfileUpdate'
import ChooseProfile from './components/ChooseProfile/ChooseProfile'
import LogOut from './components/LogOut/LogOut'
import ConfirmPage from './pages/ConfirmPage/ConfirmPage'
import DeveloperEditProfile from './components/DeveloperEditProfile/DeveloperEditProfile'
import ClientProfileUpdate from './components/ClientProfileUpdate/ClientProfileUpdate'
import ClientViewProfile from './components/ClientViewProfile/ClientViewProfile'
import ClientEditProfile from './components/ClientEditProfile/ClientEditProfile'
import SubmitProjectPage from './components/SubmitProjectPage/SubmitProjectpage'
import HURsuccess from './components/HURamount/SubmitSuccessPopup'
import PostedProjects from './components/PostedProjects/PostedProjects'
import PostedProjectsDesc from './components/postedprojectsDesc/PostedProjectsDesc'
import FindProjects from './components/FindProjects/FindProjects'
import ApplyProject from './components/ApplyProject/ApplyProject'
import AppliedProjectsList from './components/AppliedProjectsList/AppliedProjectsList'
import AppliedProjectDesc from './components/AppliedProjectDesc/AppliedProjectDesc'
import AppliedDeveloperProfile from './components/AppliedDeveloperProfile/AppliedDeveloperProfile'
import EditProject from './components/EditProject/EditProject'
import SuccessPopup from './components/ApplyProject/SuccessPopup'
import Notifications from './components/Notifications/Notifications'
import WatchVideo from './components/WatchVideo/WatchVideo'
import ProductVideos from './components/ProductVideos/ProductVideos'
import Blogs from './components/Blogs/Blogs'
import SupportForm from './components/SupportForm/SupportForm'
import PrivacyPolicy from './components/PrivacyPolicy/PrivacyPolicy'
import TermsofService from './components/TermsofService/TermsofService'
import PurchaseConfirmation from './components/PurchaseConfirmation/PurchaseConfirmation'
import SupportManagement from './components/SupportManagement/SupportManagement'
import SupportManagementDesc from './components/SupportManagementDesc/SupportManagementDesc'
import ClientProfileUpdate1 from './components/ClientProfileUpdate1/ClientProfileUpdate1'
import TokensaleStatus from './components/TokensaleStatus/TokensaleStatus'
import NewDashboard from './components/NewDashboardPage/NewDashboardPage'
import HomePage from './pages/shop/user/HomePage/HomePage'
import Home from './containers/Home/Home'
import Product from './pages/shop/user/Product/Product'
import Categories from './pages/shop/user/CategoriesProducts/Categories'
import SubCategories from './pages/shop/user/CategoriesProducts/SubCategory'
import CheckoutForm from './pages/shop/user/CheckoutForm/CheckoutForm'
import CheckoutFormDemo from './pages/shop/user/CheckoutForm/CheckoutFormDemo'
import PaymentForm from './pages/shop/user/PaymentForm/PaymentForm'
import PlaceOrder from './pages/shop/user/PlaceOrder/PlaceOrder'
import MyOrders from './pages/shop/user/MyOrders/MyOrders'
import MyTokenPage2 from './components/MyTokenPage/MyTokenPage'
import MyTokenPage from './components/MyTokenPage2/MyTokenPage2'
import PrivacyPolicyNew from './components/PrivacyPolicyNew/PrivacyPolicyNew'
import AdminOrdersList from './pages/shop/user/AdminOrdersList/AdminOrdersList'
import UpdateStatus from './pages/shop/user/UpdateStatus/UpdateStatus'
import KYCForm from './components/KYCForm/KYCForm'

module.exports = (
    <Route path='/' component={App}>
         <IndexRoute component={Loginpage}/>
     <Route path="register" component={RegisteredPage}/>
     <Route path="logout" component={LogOut}/>
     <Route path="confirm/:token" component={ConfirmPage}/>
     <Route path="privacypolicy" component={PrivacyPolicy}/>
     <Route path="termsofservice" component={TermsofService}/>
     <Route path="privacypolicynew" component={PrivacyPolicyNew}/>
     <Route path="dashboard" component={Dashboardpage}>
         <Route path="marketplace" component={Home}>
           <IndexRoute component={HomePage}/>
           <Route path="productdetails" component={Product}/>
           <Route path="category" component={Categories}/>
           <Route path="subcategory" component={SubCategories}/>
           <Route path="checkout" component={CheckoutForm}/>
            <Route path="checkoutdemo" component={CheckoutFormDemo}/>
           <Route path='payment' component={PaymentForm}/>
           <Route path='placeorder' component={PlaceOrder}/>
           <Route path='myorders' component={MyOrders}/>
           <Route path='admin_orders' component={AdminOrdersList}/>
           <Route path='changestatus' component={UpdateStatus}/>
         </Route>
       <Route path="chooseprofile" component={ChooseProfile}/>
    	 <Route path="developerprofileupdate" component={DeveloperProfileUpdate}/>
       <Route path="developerviewprofile" component={DeveloperViewProfile}/>
       <Route path="developereditprofile" component={DeveloperEditProfile}/>
       <Route path="clientprofileupdate" component={ClientProfileUpdate}/>
       <Route path="clientviewprofile" component={ClientViewProfile}/>
       <Route path="clienteditprofile" component={ClientEditProfile}/>
       <Route path="submitproject" component={SubmitProjectPage}/>
       <Route path="postedprojects" component={PostedProjects}/>
       <Route path="postedprojectsdesc" component={PostedProjectsDesc}/>
       <Route path="findprojects" component={FindProjects}/>
       <Route path="applyproject" component={ApplyProject}/>
       <Route path="appliedprojects" component={AppliedProjectsList}/>
       <Route path="appliedprojectdesc" component={AppliedProjectDesc}/>
       <Route path="applieddeveloperprofile" component={AppliedDeveloperProfile}/>
       <Route path="editproject" component={EditProject}/>
       <Route path="notifications" component={Notifications}/>
       <Route path="hursuccess" component={HURsuccess}/>
       <Route path="success" component={SuccessPopup}/>
       <Route path="relatedvideos" component={WatchVideo}/>
       <Route path="productvideos" component={ProductVideos}/>
       <Route path="blogs" component={Blogs}/>
       <Route path="support" component={SupportForm}/>
       <Route path="purchaseconfirmation" component={PurchaseConfirmation}/>
       <Route path="supportmanagement" component={SupportManagement}/>
       <Route path="supportmanagementdesc" component={SupportManagementDesc}/>
       <Route path="clientprofileupdate1" component={ClientProfileUpdate1}/>
       <Route path="tokensalestatus" component={TokensaleStatus}/>
       <Route path="mytoken" component={MyTokenPage}/>
       <Route path="mytoken2" component={MyTokenPage2}/>
       <Route path="KYCForm" component={KYCForm}/>

       <Redirect path='*' to='/dashboard/mytoken'/>
     </Route>

     <Redirect path='*' to='/'/>
    </Route>
)
