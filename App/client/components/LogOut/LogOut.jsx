import React from 'react'
import PropTypes from 'prop-types'
import AuthLayer from './../../network/AuthLayer'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


const cookies = new Cookies();
class LogOut extends React.Component {
    componentWillMount() {
        cookies.remove('token')
        cookies.remove('name')
        cookies.remove('ProfilePhoto')
        cookies.remove('account_type')
        cookies.remove('email')
        cookies.remove('UserID')
        cookies.remove('client_id')
        cookies.remove('devid')
        cookies.remove('project_id')
        cookies.remove('balance')
        cookies.remove('tokensale_status')
        cookies.remove('profileupdate_status')
        cookies.remove('jobTitle')

        localStorage.removeItem('token')
        localStorage.removeItem('name')
        localStorage.removeItem('ProfilePhoto')
        localStorage.removeItem('email')
        localStorage.removeItem('UserID')
        localStorage.removeItem('client_id')
        localStorage.removeItem('devid')
        localStorage.removeItem('account_type')
        localStorage.removeItem('balance')
        localStorage.removeItem('project_id')
        window.location = "/"
        this.context.router.push('/logout')
    }

    render() {
      return (
        <div>Logging out</div>
      )
    }
}

LogOut.contextTypes = {
    router: PropTypes.object.isRequired
}

export default LogOut
