import React from 'react'
import { Dashboard, Header, Sidebar } from 'react-adminlte-dash'
import $ from "jquery";
import PropTypes from 'prop-types'
import { Link } from 'react-router'
import style from './Dashboardpage.css'

var userName = (localStorage.getItem('name'))
var profilePhoto = (localStorage.getItem('ProfilePhoto'))
const nav = () => ([
  <Header.UserMenu
    name={userName}
    image={profilePhoto}
    profileAction={() =>
       window.location = '/dashboard'
       //this.context.router.push('/dashboard')
    }
    signOutAction={() =>
    //  alert('Sign out')
     window.location = '/logout'
    }
    key="2"
  />
]);

const sb = () => {
  console.log(localStorage.getItem('account_type'));
  if (localStorage.getItem('account_type') == "developer") {
    return(
  <Sidebar.UserPanel
    name="Alexander Pierce"
    image="https://avatars1.githubusercontent.com/u/1086876?v=4&s=88"
    online
    key="1"
  />,

  <Sidebar.Menu key="2">

    <Sidebar.Menu.Item title="Find Projects" href="/dashboard/findprojects" icon={{className:'fa-search'}}/>
    <Sidebar.Menu.Item title="Applied Jobs" href="/dashboard/appliedprojects" icon={{className:'fa fa-hand-pointer-o'}}/>

  </Sidebar.Menu>
);
}

else if (localStorage.getItem('account_type') == "client"){
  return(
  <Sidebar.UserPanel
    name="Alexander Pierce"
    image="https://avatars1.githubusercontent.com/u/1086876?v=4&s=88"
    online
    key="1"
  />,
  <Sidebar.Menu key="2">

    <Sidebar.Menu.Item title="Submit Project" href="/dashboard/submitproject" icon={{className:'fa fa-hand-pointer-o'}}/>
    <Sidebar.Menu.Item title="Projects Status" href="/dashboard/projectsstatus" icon={{className:'fa-random'}}/>

  </Sidebar.Menu>
);
}
else {
//   return(
//   <Sidebar.UserPanel
//     name="Alexander Pierce"
//     image="https://avatars1.githubusercontent.com/u/1086876?v=4&s=88"
//     online
//     key="1"
//   />,
//   <Sidebar.Menu key="2">
//     <Sidebar.Menu.Item title="Profile" href="/dashboard" icon={{className:'fa-user'}}/>
//     <Sidebar.Menu.Item title="Logout" href="/logout" icon={{className:'fa fa-sign-out'}}/>
//   </Sidebar.Menu>
// );
}
};

const footer = () => ([
  <strong>
    <span>Copyright © 2017 </span>

    <span>. </span>
  </strong>,
  <span> All rights reserved.</span>,
  <div style={{ float: 'right' }}>
    <b></b>
    <span> </span>
  </div>,
]);
const Dashboardpage = (props) => {
	return (
		<Dashboard
        navbarChildren={nav()}
    		sidebarChildren={sb()}
        footerChildren={footer()}
    		theme="skin-blue"
    		logoLg = {<span><b>Hurify</b></span>}
    		sidebarMini
    		logoSm = {<span><b>H</b>UR</span>}
  		>
      {props.children}
  		</Dashboard>
	)
}
Dashboardpage.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Dashboardpage
