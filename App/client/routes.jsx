import React from 'react'
import { Route, IndexRoute, Redirect } from 'react-router'

import App from './containers/App/App'
import Dashboardpage from './pages/Dashboardpage/Dashboardpage'
import Loginpage from './pages/Loginpage/Loginpage'
import RegisteredPage from './pages/RegisteredPage/RegisteredPage'
import ProfilePage from './pages/ProfilePage/ProfilePage'
import ProfileUpdate from './components/ProfileUpdate/ProfileUpdate'
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
import SubmitComingsoon from './components/SubmitComingsoon/SubmitComingsoon'
import ProjectsStatusComingsoon from './components/ProjectsStatusComingsoon/ProjectsStatusComingsoon'
import FindProjectsComingsoon from './components/FindProjectsComingsoon/FindProjectsComingsoon'
import AppliedComingsoon from './components/AppliedComingsoon/AppliedComingsoon'


module.exports = (
    <Route path='/' component={App}>
         <IndexRoute component={Loginpage}/>
     <Route path="register" component={RegisteredPage}/>
     <Route path="logout" component={LogOut}/>
     <Route path="confirm/:token" component={ConfirmPage}/>
     <Route path="dashboard" component={Dashboardpage}>
       <IndexRoute component={ChooseProfile}/>
       <Route path="profile" component={ProfilePage}/>
    	 <Route path="developerprofileupdate" component={DeveloperProfileUpdate}/>
       <Route path="developerviewprofile" component={DeveloperViewProfile}/>
       <Route path="developereditprofile" component={DeveloperEditProfile}/>
       <Route path="clientprofileupdate" component={ClientProfileUpdate}/>
       <Route path="clientviewprofile" component={ClientViewProfile}/>
       <Route path="clienteditprofile" component={ClientEditProfile}/>

       <Route path="hursuccess" component={HURsuccess}/>
       <Route path="submitproject" component={SubmitComingsoon}/>
       <Route path="projectsstatus" component={ProjectsStatusComingsoon}/>
       <Route path="findprojects" component={FindProjectsComingsoon}/>
       <Route path="appliedprojects" component={AppliedComingsoon}/>
     </Route>
    </Route>
)
