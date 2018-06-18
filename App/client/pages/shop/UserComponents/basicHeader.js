import React, {Component} from 'react';
import PropTypes from 'prop-types'
import {Link, browserHistory} from 'react-router';


class basicHeader extends Component{
    constructor(props){
        super(props);
        
    }

    render(){

        return(
            <header>
                <div className="container">
                    <div className="brand">
                        <img className="logo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" alt="HURIFY"/>
                    </div>
                </div>
            </header>
        )
    }
}
basicHeader.contextTypes = {
    router: PropTypes.object.isRequired
}
export default basicHeader;
