import React from 'react'


export default class dummy1 extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timeLineTop: 75, }; }
      render() {
        this.state.timeLineTop = setInterval(function () {
          // let d = new Date();
          // let result = d.getHours() + d.getMinutes() / MINUTES_IN_HOUR;
          // return result;
          alert('hai')
        }, 3000);
        <div style={[ { top: this.state.timeLineTop }, ]}>hello</div>
        }
      }
