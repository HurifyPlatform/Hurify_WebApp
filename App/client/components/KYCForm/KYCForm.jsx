import React from 'react';
import ReactDOM from 'react-dom';
import styles from './KYCForm.css'
import classNames from 'classnames';
import AuthLayer from './../../network/AuthLayer'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt');
const cookies = new Cookies();
var docOption = ["PASSPORT", "NRIC", "FIN", "EMPLOYMENT PASS", "S PASS", "WORK PERMIT", "DEPENDANT PASS",
    "UTILITY/TELEPHONE BILL", "FOREIGN IDENTITY CARD",
    "CERTIFICATE OF INCORPORATION", "BANK STATEMENT", "ARTICLES AND M&A", "BIZFILE",
    "SOURCE OF FUNDS PROOF", "CUSTOMER ACCEPTANCE FORM", 'SELFIE', 'NATIONAL ID', 'DRIVING LICENSE',
    "SCREENING RESULTS", "INVOICE", "CHEQUE", "BOARD RESOLUTIONS", "OTHERS"];
var userData = {
    "domain_name": "HURIFY_UAT",
    "rfrID": "test_001",
    "first_name": "",
    "last_name": "",
    "nationality": "",
    "country_of_residence": "",
    "gender": "MALE",
    "identification_type": "",
    "identification_number": "",
    "issue_date": "",
    "expiry_date": "",
    "ssic_code": "62019 - DEVELOPMENT OF OTHER SOFTWARE AND PROGRAMMING ACTIVITIES N.E.C.",
    "ssoc_code": "25190 - SOFTWARE AND APPLICATIONS DEVELOPER AND ANALYST N.E.C.",
    "onboarding_mode": "UNKNOWN",
    "payment_mode": "UNKNOWN",
    "product_service_complexity": "UNKNOWN",
    "emails": []
}
class BasicDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gender: 'MALE'
        }
        this.handleValueUpdate = this.handleValueUpdate.bind(this);
    }
    handleValueUpdate(event) {
        console.log("In handle value update");
        var property = event.target.name;
        var value = event.target.value;
        if (property === 'gender') {
            console.log("In property");
            var temp = {};
            temp[property] = value;
            this.setState({
                gender: value
            }, () => {
                console.log(" state is " + JSON.stringify(this.state));
                userData[property] = value;
                console.log("In handle value update" + JSON.stringify(userData));
            })
        }
        else if (property === 'emails') {
            userData[property] = [value];
        }
        else {
            userData[property] = value;
        }
        console.log("In handle value update" + JSON.stringify(userData));
    }
    render() {
        return (
            <div style={{ display: 'flex' }}>
                <div style={{ width: '45%' }}>
                    <h2> Basic Details </h2>
                    <hr />
                    <div>
                        <label> First Name: </label>
                        <input type="text"
                            name="first_name"
                            onChange={this.handleValueUpdate} />
                    </div>
                    <div>
                        <label> Last Name: </label>
                        <input type="text"
                            name="last_name"
                            onChange={this.handleValueUpdate} />
                    </div>
                    <div>
                        <label> Email: </label>
                        <input type="text"
                            name="emails"
                            onChange={this.handleValueUpdate} />
                    </div>
                    <div>
                        <label> Nationality: </label>
                        <input type="text"
                            name="nationality"
                            onChange={this.handleValueUpdate} />
                    </div>
                    <div>
                        <label> Country: </label>
                        <select name="country_of_residence"
                            onChange={this.handleValueUpdate}>
                            <option key="India" value="India"> India </option>
                            <option key="USA" value="USA"> USA </option>
                            <option key="Ireland" value="Ireland"> Ireland </option>
                        </select>
                    </div>
                    <div>
                        <label> Gender: </label>
                        <input type="radio"
                            name="gender"
                            value='MALE'
                            checked={this.state.gender === 'MALE' ? true : false}
                            onChange={this.handleValueUpdate} /> Male
                        <input type="radio"
                            name="gender"
                            value='FEMALE'
                            checked={this.state.gender === 'FEMALE' ? true : false}
                            onChange={this.handleValueUpdate} /> Female
                    </div>
                </div>
                <div style={{ width: '45%', marginRight: '0', marginLeft: 'auto' }}>
                    <h2> Document Details </h2>
                    <hr />
                    <div>
                        <label> Identification Document: </label>
                        <select name="identification_type"
                            onChange={this.handleValueUpdate} >
                            {docOption.map((option) => {
                                return <option key={option} value={option}> {option} </option>
                            })}
                        </select>
                    </div>
                    <div>
                        <label> Issue Date: </label>
                        <input type="text"
                            name="issue_date"
                            placeholder="dd/mm/yyyy"
                            onChange={this.handleValueUpdate} />
                    </div>
                    <div>
                        <label> Expiry Date: </label>
                        <input type="text"
                            name="expiry_date"
                            placeholder="dd/mm/yyyy"
                            onChange={this.handleValueUpdate} />
                    </div>
                </div>
            </div>
        )
    }
}
class UploadDocument extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h2> Upload Identification Document </h2>
                <hr />
                <div>
                    <div>
                        <label> Document Type: </label>
                        <select>
                            {docOption.map((option) => {
                                return <option key={option} value={option}> {option} </option>
                            })}
                        </select>
                    </div>
                    <div>
                        <button> Upload Document </button>
                    </div>
                </div>
            </div>
        )
    }
}
class UploadPhoto extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div>
                <h2> Upload Image </h2>
                <hr />
                <div>
                    <button> Upload Image </button>
                </div>
            </div>
        )
    }
}
class KYCForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            display: "1"
        }
        this.updateState = this.updateState.bind(this);
        this.submitUserDetail = this.submitUserDetail.bind(this);
    }
    updateState(event) {
        console.log("Value is " + event.target.value);
        this.setState({
            display: event.target.value
        })
    }
    submitUserDetail(event) {
        switch (this.state.display) {
            case "1": {
                console.log("In level 1");
                AuthLayer.registerUser(userData).then(response => {
                    console.log("In response " + JSON.stringify(response.data));
                })
                break;
            }
            case "2": {
                AuthLayer.registerUser(userData).then(response => {
                })
                break;
            }
            case "3": {
                AuthLayer.registerUser(userData).then(response => {
                })
                break;
            }
        }
    }
    render() {
        return (
            <div className={styles.mainLayout}>
                <div style={{ position: 'relative', left: '50%' }}>
                    <button value="1"
                        onClick={this.updateState}> 1 </button>
                    <button value="2"
                        onClick={this.updateState}> 2 </button>
                    <button value="3"
                        onClick={this.updateState}> 3 </button>
                </div>
                <div>
                    {this.state.display === "1" ? <BasicDetails /> : ''}
                    {this.state.display === "2" ? <UploadDocument /> : ''}
                    {this.state.display === "3" ? <UploadPhoto /> : ''}
                </div>
                <div>
                    <button onClick={this.submitUserDetail}> Submit </button>
                </div>
            </div>
        )
    }
}
module.exports = KYCForm;