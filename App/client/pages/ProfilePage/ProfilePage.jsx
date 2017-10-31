import React from 'react'
import style from './ProfilePage.css'

class ProfilePage extends React.Component{

	render(){
		return(

			
				<div className="row" style={{padding:'20px 50px', backgroundColor:'#e2e2e2', flex:'1', minHeight:'85vh'}}>
					<div className="row" style={{margin:'15px'}}>
						<div className={style.well}>
							<center className={style.profileheader}>
        						<a href="#aboutModal" data-toggle="modal" data-target="#myModal">
        							<img src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcRbezqZpEuwGSvitKy3wrwnth5kysKdRqBW54cAszm_wiutku3R" name="aboutme" width="120" height="120" className="img-circle" />
        						</a>
        						<h3 className={style.profilename}>Padmanabham Pakki</h3>
							</center>
							<div className="row" style={{padding:'15px', margin:'15px', textAlign:'center'}}>
							<div className="row">
								<div className="col-md-4"> 
									<div className="form-group" style={{textAlign:'center'}}>
    									<label for="email" className={style.label}>Email Id</label> <br/>
    									<label className={style.labevalue}>padmanabham.pakki@gmail.com</label>
  									</div>
								</div>
								<div className="col-md-4"> 
									<div className="form-group" style={{textAlign:'center'}}>
    									<label for="email" className={style.label}>Languages known</label><br/> 
    									<label className={style.labevalue}>English, Hindi</label>
  									</div>
								</div>
								<div className="col-md-4"> 
									<div className="form-group" style={{textAlign:'center'}}>
    									<label for="email" className={style.label}>Country</label><br/>
    									<label className={style.labevalue}>India</label>
  									</div>
								</div>
							</div>
							<div className="row">
								<div className="col-md-12">
									<div className="form-group" style={{textAlign:'center'}}>
    									<label for="email" className={style.label}>Profile Description</label><br/>
    									<label className={style.labevalue}>Bootstrap is the most popular HTML, CSS, and JavaScript framework for developing responsive, mobile-first web sites.Bootstrap is completely free to download and use!</label>
  									</div> 
								</div>
							</div>
							
							</div>
						</div>
					</div>
				</div>				
			

			);
	}
}

export default ProfilePage