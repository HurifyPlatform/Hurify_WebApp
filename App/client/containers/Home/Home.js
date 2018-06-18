// import React from 'react'
// import styles from './../App/App.css'
//
// const Home = (props) => {
//     return (
//         <div className={styles.wrapper}>
//             {props.children}
//         </div>
//     )
// }
// export default Home



import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'


class Home extends Component{
	constructor(props){
		super(props);
		this.state = {

		};
	}
	render(){
		return(
			<div className="container-fluid" style={{padding:'0px'}}>

				{this.props.children}

			</div>
		)
	}
}
Home.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Home
// ReactDOM.render(
// 	<App />,
//   	document.getElementById('root')
// );
