import React from 'react'
import styles from './AppliedComingsoon.css'

//var deadline = 'November 14 2017 23:59:59 GMT+0200';
var timing = ''
class AppliedComingsoon extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			timings: {
				days:'',
				hours: '',
				minutes:'',
				seconds:''
			}
		}
		this.getTimeRemaining = this.getTimeRemaining.bind(this);
		//this.initializeClock = this.initializeClock.bind(this);
		this.updateClock = this.updateClock.bind(this);
	}
	getTimeRemaining(endtime){
	  var t = Date.parse(endtime) - Date.parse(new Date());
	  var seconds = Math.floor( (t/1000) % 60 );
	  var minutes = Math.floor( (t/1000/60) % 60 );
	  var hours = Math.floor( (t/(1000*60*60)) % 24 );
	  var days = Math.floor( t/(1000*60*60*24) );
		//alert(days);
	  return {
	    'total': t,
	    'days': days,
	    'hours': hours,
	    'minutes': minutes,
	    'seconds': seconds
	  };
	}

	updateClock(endtime) {
		var t = this.getTimeRemaining(endtime);

		const stateParams = this.state.timings
		stateParams["days"] = t.days
		stateParams["hours"] = ('0' + t.hours).slice(-2);
		stateParams["minutes"] = ('0' + t.minutes).slice(-2);
		stateParams["seconds"] = ('0' + t.seconds).slice(-2);
		this.setState({stateParams})

		console.log(t);
	}
componentDidMount() {

 setInterval( () => {
	 this.updateClock('November 14 2017 23:59:59 GMT+0200')
	// alert('asdfghjk')
}, 1000);



	// var deadline = 'November 14 2017 23:59:59 GMT+0200';
	// this.initializeClock(deadline);
	//  //setTimeout(this.initializeClock(deadline), 3000);
}

	render(){
		return(
			<div className="row" style={{padding:'100px 50px 50px 50px', backgroundColor:'#e2e2e2', flex:'1', minHeight:'91vh',overFlowY:'scroll'}}>
				<div className={styles.well}>
					<div className="row" style={{margin:'10px',padding:'20px 25px'}}>
						<img className="center-block" style={{display:'block',marginLeft: 'auto', marginRight: 'auto', width:'150px',marginTop:'10px'}}src='https://ico.hurify.co/wp-content/uploads/2017/09/hur_horizontal_logo_256.png' />
						<h3 className="text-center">Feature Available In</h3>
						<div className="row">
							<div className={styles.clockdiv}>
				         <div className="col-md-3">
				           <div className={styles.circle}><span className={styles.days}>{this.state.timings.days}</span></div>
				           <div className={styles.smalltext}>Days</div>
				         </div>
				         <div className="col-md-3">
				           <div className={styles.circle}><span className={styles.hours}>{this.state.timings.hours}</span></div>
				           <div className={styles.smalltext}>Hours</div>
				         </div>
				         <div className="col-md-3">
				            <div className={styles.circle}><span className={styles.minutes}>{this.state.timings.minutes}</span></div>
				            <div className={styles.smalltext}>Minutes</div>
				         </div>
				         <div className="col-md-3">
				            <div className={styles.circle}><span className={styles.seconds}>{this.state.timings.seconds}</span></div>
				            <div className={styles.smalltext}>Seconds</div>
				         </div>
	      		</div>
						<div>
							<p className={styles.text}>The feature set for MVP is in testing phase and shall be available at the earliest.</p>
							<img className="center-block" style={{display:'block',marginLeft: 'auto', marginRight: 'auto', width:'150px',marginTop:'10px'}}src={require('./Coming_soon.png')} />
						</div>
					</div>
					</div>
				</div>
			</div>
		)
	}
}


export default AppliedComingsoon
