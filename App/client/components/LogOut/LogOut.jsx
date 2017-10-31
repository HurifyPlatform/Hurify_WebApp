import React from 'react'
import PropTypes from 'prop-types'
import AuthLayer from './../../network/AuthLayer'

class LogOut extends React.Component {
    componentWillMount() {
        localStorage.removeItem('token')
        localStorage.removeItem('name')
      //  this.context.router.push('/')
        window.location = "/"
    }

    render() {

    }
}

LogOut.contextTypes = {
    router: PropTypes.object.isRequired
}

export default LogOut
