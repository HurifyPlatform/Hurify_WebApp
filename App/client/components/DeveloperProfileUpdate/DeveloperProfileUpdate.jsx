import React from 'react'
import Imageupload from './../../components/Imageupload/Imageupload'
import styles from './DeveloperProfileUpdate.css'
import $ from "jquery";
import AuthLayer from './../../network/AuthLayer'
import UserStore from './../../stores/UserStore'
import PropTypes from 'prop-types'
import axios from 'axios'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')


var catArr = [];
var catStr = "";

const cookies = new Cookies();
class DeveloperProfileUpdate extends React.Component{
	constructor(props) {
		super(props);
		 this.state = {
			 pictures: [],
			 params: {
            firstName:'',
						lastName:'',
						email:'',
            user: {
							email: '',
              name: '',
              country: 'United States',
              languages: '',
              userDesc: '',
              userId: '',
              skills: '',
              jobTitle: '',
              categories:'',
              salaryPerHour: ''
            }
          }
		 };
		 this.changeUser = this.changeUser.bind(this);
			this.updatingProfile = this.updatingProfile.bind(this);
			this.handleChange = this.handleChange.bind(this);
			this.changesName = this.changesName.bind(this);
	}
	componentWillMount() {
    $(document).ready(function()
    {
        $('input[type="checkbox"]').click(function(){
    			if($(this).is(":checked")){
    				  catArr.push($(this).attr("value"))
    					catStr = catArr.join(",")
    			}
    	   else if($(this).is(":not(:checked)")){
    			 var i = catArr.indexOf($(this).attr("value"));
    			 catArr.splice(i, 1);
    			 catStr = catArr.join(",")
    		}
    });
    });
		if (crypt.decrypt(cookies.get('account_type')) == "developer") {
		if ((crypt.decrypt(cookies.get('profileupdate_status')) == "true") || (crypt.decrypt(cookies.get('profileupdate_status')) == "1")) {
			this.context.router.push('/dashboard/developerviewprofile');
		}
		else {
			const user = this.state.params
			user['email'] = crypt.decrypt(cookies.get('email'))
			this.setState({
					user
			})
	    // this.state.params.token = crypt.decrypt(cookies.get('token'))
	    // this.state.params.email = crypt.decrypt(cookies.get('email'))
	    // AuthLayer.GetTransactionHash(this.state.params)
	    // .then(response => {
	    //   if (response.data.success){
	    //     const user = this.state.params.user
	    //     user['name'] = response.data.data.firstName + " " + response.data.data.lastName
	    //     user['email'] = response.data.data.email
			// 		user['country'] = response.data.data.country
	    //     this.setState({
	    //         user
	    //     })
	    // } else {
	    //   alert("not registered for tokensale")
	    // }
	    // })
		}
	}
	else {
		this.context.router.push('/dashboard/chooseprofile');
	}
	}
	updatingProfile(event) {
		event.preventDefault();
		let userDetails = this.state.params.user;
		if (userDetails.categories == "" || userDetails.categories == null) {
			return alert("Please select interested categories!");
		}
		const userIdAdding = this.state.params.user
		  userIdAdding['userId'] = crypt.decrypt(cookies.get('UserID'))
			userIdAdding['name'] = this.state.params.firstName + " " + this.state.params.lastName
		this.setState({userIdAdding})
        const request = new FormData();
     		var ProjectData = JSON.stringify(this.state.params.user);
     		request.append('file', this.state.params.file);
     		request.append('token', crypt.decrypt(cookies.get('token')));
        request.append('userAccountType', "developer");
     		request.append('project', ProjectData)
     		axios.post(require('./../../../config').serverAPI + '/apicall/addprofile', request).then(result => {
     			if(result.data.success) {
     				alert("Profile Submitted Successfully!")
            cookies.set('account_type', crypt.encrypt('developer'), { path: '/' });
            cookies.set('name', crypt.encrypt(this.state.params.user.name), { path: '/' });
            cookies.set('profileupdate_status', crypt.encrypt(true), { path: '/' });
        		this.context.router.push('/dashboard/developerviewprofile')
     			}
     			else {
          alert(result.data.error)
     			}
     		});

			}

	changeUser(event) {

		    	const field = event.target.name
		    	const user = this.state.params.user
		    	user[field] = event.target.value
					this.setState({user})
			}

	handleChange(event) {

					const user = this.state.params.user
					user['categories'] = catStr
					this.setState({user})

	}
changesName(event) {
	const field = event.target.name
	const user = this.state.params
	user[field] = event.target.value
	this.setState({user})
}
  handleFileChange(event) {
		event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0];
		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
			const user = this.state.params
			user["file"] = file
			this.setState({user});
		}
		reader.readAsDataURL(file);

	}

	render(){
	return(

		<div className="row" style={{padding:'2px 0px 0px 20px', backgroundColor:'#d7e1eb', flex:'1', minHeight:'85vh'}}>
			<div className="row" style={{backgroundColor:'#fff', height:'55px'}}>
				<label style={{fontSize:'22px',height:'100%',fontWeight:'400',margin:'12px 12px 12px 60px'}}>Profile Update</label>
			</div>
			<div className={styles.well} style={{margin:'50px 50px 50px 80px'}}>
				<div className="row" style={{margin:'0px',backgroundColor:'#337ab7'}}>
					<div className="col-md-3" style={{minHeight:'300px', backgroundColor:'#337ab7', borderRadius:'3px'}}>
						<div className="row text-center" style={{padding:'50px 30px'}}>
							<Imageupload />
						</div>
					</div>
          <form onSubmit={this.updatingProfile}>
					<div className="col-md-9">
						<h3 className="text-center" style={{color:'#ffffff'}}></h3>
							<div className="row">
								<div className="col-sm-6">
									<div className="form-group">
											<label htmlFor="email" className={styles.fieldname}>Email Address<span className="kv-reqd">*</span></label>
											<input type="email" className="form-control" name="email" placeholder={this.state.params.email} value={this.state.params.email} readOnly/>
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6">
									<div className="form-group">
											<label htmlFor="email" className={styles.fieldname}>First Name<span className="kv-reqd">*</span></label>
											<input type="text" className="form-control" name="firstName" value={this.state.firstName} onChange={this.changesName} required/>
									</div>
								</div>
								<div className="col-sm-6">
									<div className="form-group">
											<label htmlFor="fullName" className={styles.fieldname}>Last Name</label>
											<input type="text" className="form-control" name="lastName" value={this.state.lastName} onChange={this.changesName} />
									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-sm-6">
										<div className="form-group">
										<label htmlFor="sel1" className={styles.fieldname}>Select Country<span className="kv-reqd">*</span></label>
										<select className="form-control" id="sel1" name="country" placeholder="select country" onChange={this.changeUser} required>
											<option value="Afghanistan">Afghanistan</option>
											<option value="Albania">Albania</option>
											<option value="Algeria">Algeria</option>
											<option value="American Samoa">American Samoa</option>
											<option value="Andorra">Andorra</option>
											<option value="Angola">Angola</option>
											<option value="Anguilla">Anguilla</option>
											<option value="Antartica">Antarctica</option>
											<option value="Antigua and Barbuda">Antigua and Barbuda</option>
											<option value="Argentina">Argentina</option>
											<option value="Armenia">Armenia</option>
											<option value="Aruba">Aruba</option>
											<option value="Australia">Australia</option>
											<option value="Austria">Austria</option>
											<option value="Azerbaijan">Azerbaijan</option>
											<option value="Bahamas">Bahamas</option>
											<option value="Bahrain">Bahrain</option>
											<option value="Bangladesh">Bangladesh</option>
											<option value="Barbados">Barbados</option>
											<option value="Belarus">Belarus</option>
											<option value="Belgium">Belgium</option>
											<option value="Belize">Belize</option>
											<option value="Benin">Benin</option>
											<option value="Bermuda">Bermuda</option>
											<option value="Bhutan">Bhutan</option>
											<option value="Bolivia">Bolivia</option>
											<option value="Bosnia and Herzegowina">Bosnia and Herzegowina</option>
											<option value="Botswana">Botswana</option>
											<option value="Bouvet Island">Bouvet Island</option>
											<option value="Brazil">Brazil</option>
											<option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
											<option value="Brunei Darussalam">Brunei Darussalam</option>
											<option value="Bulgaria">Bulgaria</option>
											<option value="Burkina Faso">Burkina Faso</option>
											<option value="Burundi">Burundi</option>
											<option value="Cambodia">Cambodia</option>
											<option value="Cameroon">Cameroon</option>
											<option value="Canada">Canada</option>
											<option value="Cape Verde">Cape Verde</option>
											<option value="Cayman Islands">Cayman Islands</option>
											<option value="Central African Republic">Central African Republic</option>
											<option value="Chad">Chad</option>
											<option value="Chile">Chile</option>
											<option value="China">China</option>
											<option value="Christmas Island">Christmas Island</option>
											<option value="Cocos Islands">Cocos (Keeling) Islands</option>
											<option value="Colombia">Colombia</option>
											<option value="Comoros">Comoros</option>
											<option value="Congo">Congo</option>
											<option value="Congo">Congo, the Democratic Republic of the</option>
											<option value="Cook Islands">Cook Islands</option>
											<option value="Costa Rica">Costa Rica</option>
											<option value="Cota D'Ivoire">Cote d'Ivoire</option>
											<option value="Croatia">Croatia (Hrvatska)</option>
											<option value="Cuba">Cuba</option>
											<option value="Cyprus">Cyprus</option>
											<option value="Czech Republic">Czech Republic</option>
											<option value="Denmark">Denmark</option>
											<option value="Djibouti">Djibouti</option>
											<option value="Dominica">Dominica</option>
											<option value="Dominican Republic">Dominican Republic</option>
											<option value="East Timor">East Timor</option>
											<option value="Ecuador">Ecuador</option>
											<option value="Egypt">Egypt</option>
											<option value="El Salvador">El Salvador</option>
											<option value="Equatorial Guinea">Equatorial Guinea</option>
											<option value="Eritrea">Eritrea</option>
											<option value="Estonia">Estonia</option>
											<option value="Ethiopia">Ethiopia</option>
											<option value="Falkland Islands">Falkland Islands (Malvinas)</option>
											<option value="Faroe Islands">Faroe Islands</option>
											<option value="Fiji">Fiji</option>
											<option value="Finland">Finland</option>
											<option value="France">France</option>
											<option value="France Metropolitan">France, Metropolitan</option>
											<option value="French Guiana">French Guiana</option>
											<option value="French Polynesia">French Polynesia</option>
											<option value="French Southern Territories">French Southern Territories</option>
											<option value="Gabon">Gabon</option>
											<option value="Gambia">Gambia</option>
											<option value="Georgia">Georgia</option>
											<option value="Germany">Germany</option>
											<option value="Ghana">Ghana</option>
											<option value="Gibraltar">Gibraltar</option>
											<option value="Greece">Greece</option>
											<option value="Greenland">Greenland</option>
											<option value="Grenada">Grenada</option>
											<option value="Guadeloupe">Guadeloupe</option>
											<option value="Guam">Guam</option>
											<option value="Guatemala">Guatemala</option>
											<option value="Guinea">Guinea</option>
											<option value="Guinea-Bissau">Guinea-Bissau</option>
											<option value="Guyana">Guyana</option>
											<option value="Haiti">Haiti</option>
											<option value="Heard and McDonald Islands">Heard and Mc Donald Islands</option>
											<option value="Holy See">Holy See (Vatican City State)</option>
											<option value="Honduras">Honduras</option>
											<option value="Hong Kong">Hong Kong</option>
											<option value="Hungary">Hungary</option>
											<option value="Iceland">Iceland</option>
											<option value="India">India</option>
											<option value="Indonesia">Indonesia</option>
											<option value="Iran">Iran (Islamic Republic of)</option>
											<option value="Iraq">Iraq</option>
											<option value="Ireland">Ireland</option>
											<option value="Israel">Israel</option>
											<option value="Italy">Italy</option>
											<option value="Jamaica">Jamaica</option>
											<option value="Japan">Japan</option>
											<option value="Jordan">Jordan</option>
											<option value="Kazakhstan">Kazakhstan</option>
											<option value="Kenya">Kenya</option>
											<option value="Kiribati">Kiribati</option>
											<option value="Democratic People's Republic of Korea">Korea, Democratic People's Republic of</option>
											<option value="Korea">Korea, Republic of</option>
											<option value="Kuwait">Kuwait</option>
											<option value="Kyrgyzstan">Kyrgyzstan</option>
											<option value="Lao">Lao People's Democratic Republic</option>
											<option value="Latvia">Latvia</option>
											<option value="Lebanon">Lebanon</option>
											<option value="Lesotho">Lesotho</option>
											<option value="Liberia">Liberia</option>
											<option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
											<option value="Liechtenstein">Liechtenstein</option>
											<option value="Lithuania">Lithuania</option>
											<option value="Luxembourg">Luxembourg</option>
											<option value="Macau">Macau</option>
											<option value="Macedonia">Macedonia, The Former Yugoslav Republic of</option>
											<option value="Madagascar">Madagascar</option>
											<option value="Malawi">Malawi</option>
											<option value="Malaysia">Malaysia</option>
											<option value="Maldives">Maldives</option>
											<option value="Mali">Mali</option>
											<option value="Malta">Malta</option>
											<option value="Marshall Islands">Marshall Islands</option>
											<option value="Martinique">Martinique</option>
											<option value="Mauritania">Mauritania</option>
											<option value="Mauritius">Mauritius</option>
											<option value="Mayotte">Mayotte</option>
											<option value="Mexico">Mexico</option>
											<option value="Micronesia">Micronesia, Federated States of</option>
											<option value="Moldova">Moldova, Republic of</option>
											<option value="Monaco">Monaco</option>
											<option value="Mongolia">Mongolia</option>
											<option value="Montserrat">Montserrat</option>
											<option value="Morocco">Morocco</option>
											<option value="Mozambique">Mozambique</option>
											<option value="Myanmar">Myanmar</option>
											<option value="Namibia">Namibia</option>
											<option value="Nauru">Nauru</option>
											<option value="Nepal">Nepal</option>
											<option value="Netherlands">Netherlands</option>
											<option value="Netherlands Antilles">Netherlands Antilles</option>
											<option value="New Caledonia">New Caledonia</option>
											<option value="New Zealand">New Zealand</option>
											<option value="Nicaragua">Nicaragua</option>
											<option value="Niger">Niger</option>
											<option value="Nigeria">Nigeria</option>
											<option value="Niue">Niue</option>
											<option value="Norfolk Island">Norfolk Island</option>
											<option value="Northern Mariana Islands">Northern Mariana Islands</option>
											<option value="Norway">Norway</option>
											<option value="Oman">Oman</option>
											<option value="Pakistan">Pakistan</option>
											<option value="Palau">Palau</option>
											<option value="Panama">Panama</option>
											<option value="Papua New Guinea">Papua New Guinea</option>
											<option value="Paraguay">Paraguay</option>
											<option value="Peru">Peru</option>
											<option value="Philippines">Philippines</option>
											<option value="Pitcairn">Pitcairn</option>
											<option value="Poland">Poland</option>
											<option value="Portugal">Portugal</option>
											<option value="Puerto Rico">Puerto Rico</option>
											<option value="Qatar">Qatar</option>
											<option value="Reunion">Reunion</option>
											<option value="Romania">Romania</option>
											<option value="Russia">Russian Federation</option>
											<option value="Rwanda">Rwanda</option>
											<option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
											<option value="Saint LUCIA">Saint LUCIA</option>
											<option value="Saint Vincent">Saint Vincent and the Grenadines</option>
											<option value="Samoa">Samoa</option>
											<option value="San Marino">San Marino</option>
											<option value="Sao Tome and Principe">Sao Tome and Principe</option>
											<option value="Saudi Arabia">Saudi Arabia</option>
											<option value="Senegal">Senegal</option>
											<option value="Seychelles">Seychelles</option>
											<option value="Sierra">Sierra Leone</option>
											<option value="Singapore">Singapore</option>
											<option value="Slovakia">Slovakia (Slovak Republic)</option>
											<option value="Slovenia">Slovenia</option>
											<option value="Solomon Islands">Solomon Islands</option>
											<option value="Somalia">Somalia</option>
											<option value="South Africa">South Africa</option>
											<option value="South Georgia">South Georgia and the South Sandwich Islands</option>
											<option value="Span">Spain</option>
											<option value="SriLanka">Sri Lanka</option>
											<option value="St. Helena">St. Helena</option>
											<option value="St. Pierre and Miguelon">St. Pierre and Miquelon</option>
											<option value="Sudan">Sudan</option>
											<option value="Suriname">Suriname</option>
											<option value="Svalbard">Svalbard and Jan Mayen Islands</option>
											<option value="Swaziland">Swaziland</option>
											<option value="Sweden">Sweden</option>
											<option value="Switzerland">Switzerland</option>
											<option value="Syria">Syrian Arab Republic</option>
											<option value="Taiwan">Taiwan, Province of China</option>
											<option value="Tajikistan">Tajikistan</option>
											<option value="Tanzania">Tanzania, United Republic of</option>
											<option value="Thailand">Thailand</option>
											<option value="Togo">Togo</option>
											<option value="Tokelau">Tokelau</option>
											<option value="Tonga">Tonga</option>
											<option value="Trinidad and Tobago">Trinidad and Tobago</option>
											<option value="Tunisia">Tunisia</option>
											<option value="Turkey">Turkey</option>
											<option value="Turkmenistan">Turkmenistan</option>
											<option value="Turks and Caicos">Turks and Caicos Islands</option>
											<option value="Tuvalu">Tuvalu</option>
											<option value="Uganda">Uganda</option>
											<option value="Ukraine">Ukraine</option>
											<option value="United Arab Emirates">United Arab Emirates</option>
											<option value="United Kingdom">United Kingdom</option>
											<option value="United States" selected>United States</option>
											<option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
											<option value="Uruguay">Uruguay</option>
											<option value="Uzbekistan">Uzbekistan</option>
											<option value="Vanuatu">Vanuatu</option>
											<option value="Venezuela">Venezuela</option>
											<option value="Vietnam">Viet Nam</option>
											<option value="Virgin Islands (British)">Virgin Islands (British)</option>
											<option value="Virgin Islands (U.S)">Virgin Islands (U.S.)</option>
											<option value="Wallis and Futana Islands">Wallis and Futuna Islands</option>
											<option value="Western Sahara">Western Sahara</option>
											<option value="Yemen">Yemen</option>
											<option value="Yugoslavia">Yugoslavia</option>
											<option value="Zambia">Zambia</option>
											<option value="Zimbabwe">Zimbabwe</option>
										</select>
										</div>
								</div>
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Languages Known<span className="kv-reqd">*</span></label>
												<input type="text" className="form-control" name="languages" value={this.state.languages} onChange={this.changeUser} required />
										</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Job Title<span className="kv-reqd">*</span></label>
												<input type="text" className="form-control" name="jobTitle" value={this.state.jobTitle} onChange={this.changeUser} required />
										</div>
								</div>
								<div className="col-sm-6">
									<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Hourly Rate in HUR<span className="kv-reqd">*</span></label>
												<input type="number" className="form-control" name="salaryPerHour" value={this.state.salaryPerHour} onChange={this.changeUser} required />
										</div>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Categories you are interested<span className="kv-reqd">*</span></label><br/>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" value="Network" onChange={this.handleChange} style={{marginLeft:'-20px', display: 'block'}}/>Network</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" value="Mobile" onChange={this.handleChange} style={{marginLeft:'-20px', display: 'block'}}/>Mobile</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" value="Embedded" onChange={this.handleChange} style={{marginLeft:'-20px', display: 'block'}}/>Embedded</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" value="Cloud" onChange={this.handleChange} style={{marginLeft:'-20px', display: 'block'}}/>Cloud</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" value="Webui" onChange={this.handleChange} style={{marginLeft:'-20px', display: 'block'}}/>WebUI</label>
										<label className="checkbox-inline" style={{color:'#ffffff'}}><input type="checkbox" value="Middleware" onChange={this.handleChange} style={{marginLeft:'-20px', display: 'block'}}/>Middleware</label>
										</div>
								</div>
								<div className="col-sm-6">
										<div className="form-group">
												<label htmlFor="lname" className={styles.fieldname}>Skills<span className="kv-reqd">*</span></label>
												<input type="text" className="form-control" name="skills" value={this.state.skills} onChange={this.changeUser} required />
										</div>
								</div>
							</div>

							<div className="row">
								<div className="col-md-12">
										<div className="form-group">
											<label htmlFor="comment" className={styles.fieldname}>Profile Description<span className="kv-reqd">*</span></label>
											<textarea className="form-control" rows="2" id="comment" name="userDesc" style = {{resize: 'vertical'}} value={this.state.userDesc} onChange={this.changeUser} required></textarea>
									</div>
								</div>
							</div>
              <div className="row">
								<div className="col-md-12">
										<div className="form-group">
											<label htmlFor="comment" className={styles.fieldname}>Profile Attachment</label>
											<input type="file" style={{color:'#ffffff'}} onChange={(e)=>this.handleFileChange(e)} accept=".pdf,.doc" name="file"/>
									</div>
								</div>
							</div>

							<div className="row" style={{padding:'15px 15px'}}>
								<div className="text-right">
									<input type="Submit" className="btn btn-primary btn-md" value="Submit" style={{color:'#ffffff',backgroundColor: '#4FC3F7'}}></input>
								</div>
							</div>
					</div>
          </form>
				</div>
			</div>

		</div>
		)
	}
}
DeveloperProfileUpdate.contextTypes = {
    router: PropTypes.object.isRequired
}
export default DeveloperProfileUpdate
