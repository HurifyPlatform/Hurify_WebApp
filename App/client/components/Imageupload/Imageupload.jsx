import React from 'react'
import styles from './Imageupload.css'
import axios from 'axios'
import Cookies from 'universal-cookie';
var crypt = require('./../../../config/crypt')

const cookies = new Cookies();
class Imageupload extends React.Component {
	constructor(props) {
		super(props);
		this.state = {file: null,imagePreviewUrl: 'https://raw.githubusercontent.com/Ashwinvalento/cartoon-avatar/master/lib/images/male/45.png'};
		axios.post(require('./../../../config').serverAPI + '/apicall/getuserprofile', {userId : crypt.decrypt(cookies.get('UserID')), token : crypt.decrypt(cookies.get('token'))  }).then(result => {
			var profilePhotoPath = result.data.data.user.profilePhotoPath;
			console.log(profilePhotoPath)
			if (profilePhotoPath != null && profilePhotoPath != '') {
				this.setState({
					imagePreviewUrl: profilePhotoPath
				});
			}
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		const request = new FormData();
		let file = this.state.file;
		request.append('file', file);
		request.append('name', 'file');
		request.append('token', crypt.decrypt(cookies.get('token')));
		request.append('userId',crypt.decrypt(cookies.get('UserID')));
		request.append('desc', 'This is sample upload');
		axios.post(require('./../../../config').serverAPI + '/apicall/uploadprofilephoto', request).then(result => {
			if(result.data.success) {
			}
		});
	}

	handleImageChange(event) {
		event.preventDefault();
		let reader = new FileReader();
		let file = event.target.files[0];
		reader.onloadend = () => {
			this.setState({
				file: file,
				imagePreviewUrl: reader.result
			});
		}
		reader.readAsDataURL(file);
		const request = new FormData();
		request.append('file', file);
		request.append('name', 'file');
		request.append('token', crypt.decrypt(cookies.get('token')));
		request.append('userId',crypt.decrypt(cookies.get('UserID')));
		request.append('desc', 'This is sample upload');
		axios.post(require('./../../../config').serverAPI + '/apicall/uploadprofilephoto', request).then(result => {
			if(result.data.success) {
				// alert("Success.")
			}
			else {
				alert("Invalid file format.")
			}
		});
	}

	render() {
		let {imagePreviewUrl} = this.state;
		let $imagePreview = null;
		if (imagePreviewUrl) {
			$imagePreview = (<img src={imagePreviewUrl} />);
		} else {
			$imagePreview = (<div className={styles.previewText}>Profile Image</div>);
		}
		return (
			<div className={styles.previewComponent}>
				<div className={styles.imgPreview}>
					{$imagePreview}
				</div>

				<form ref="uploadForm" encType="multipart/form-data">
					<input className={styles.submitButton} type="file" onChange={(e)=>this.handleImageChange(e)} accept=".jpeg,.png,.jpg" name="file"/>

				</form>
			</div>
		)
	}
}

export default Imageupload
