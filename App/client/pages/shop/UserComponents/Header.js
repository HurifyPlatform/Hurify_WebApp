import React, {Component} from 'react';
import PropTypes from 'prop-types'
import CartScrollBar from './CartScrollBar';
import Counter from './Counter';
import EmptyCart from './empty-states/EmptyCart';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import {findDOMNode} from 'react-dom';
import {Link, browserHistory} from 'react-router';
import AuthLayer from './../../../network/AuthLayer'
import Home from './../user/HomePage/HomePage'
import styles from './cssFolder/Header.css'
import Cookies from 'universal-cookie';

var crypt = require('./../../../../config/crypt');
const cookies = new Cookies();
class Header extends Component{
    constructor(props){
        super(props);
        this.state = {
            showCart: false,
            cart: this.props.cartItems,
            mobileSearch: false
        };
        this.checkoutClick = this.checkoutClick.bind(this);
        this.logout = this.logout.bind(this);
    }
    componentWillMount(){
      // console.log(this.props.cartItems);
      this.getCartProducts();
    }
    getCartProducts() {
  		const data = {
  			token: crypt.decrypt(cookies.get('token')),
  			userId: crypt.decrypt(cookies.get('UserID'))
  		}
  		AuthLayer.getCartProducts(data)
  	  .then(response => {
  			//alert(JSON.stringify(response.data));
  	      if (response.data.success){
            this.state.cart.push(response.data.data)
            // console.log(this.state.cart);
            // const cart = this.state.cart
            // cart.push(response.data.data)
            // console.log(cart);
  					this.setState({
  						cart:response.data.data
  					})
  				}
  		});
  	}
    handleCart(e){

        e.preventDefault();
        this.getCartProducts();
        this.setState({
            showCart: !this.state.showCart
        })
    }
    handleSubmit(e){
        e.preventDefault();
    }
    handleMobileSearch(e){
        e.preventDefault();
        this.setState({
            mobileSearch: true
        })
    }
    handleSearchNav(e){
        e.preventDefault();
        this.setState({
            mobileSearch: false
        }, function(){
            this.refs.searchBox.value = "";
            this.props.handleMobileSearch();
        })
    }
    handleClickOutside(event) {
        const cartNode = findDOMNode(this.refs.cartPreview);
        const buttonNode = findDOMNode(this.refs.cartButton);
        if(cartNode.classList.contains('active')){
            if (!cartNode || !cartNode.contains(event.target)){
                this.setState({
                    showCart: false
                })
                event.stopPropagation();
            }
        }
    }
    logout(event) {
    	// event.preventDefault();
    	  window.location = '/logout'
    		// window.location.href =  '/dashboard/welcometoHURIFY'

    }
    removeProduct(id, e) {
      const data = {
  			token: crypt.decrypt(cookies.get('token')),
  			userId: crypt.decrypt(cookies.get('UserID')),
  			cartId: id
  		}
  		AuthLayer.removeCartProducts(data)
  	  .then(response => {
  			//console.log(JSON.stringify(response.data))
  	      if (response.data.success){
  					this.getCartProducts();
            this.props.removeProduct(id, e);
  				}
  		})
  }
    componentDidMount() {
      document.addEventListener('click', this.handleClickOutside.bind(this), true);
    }
    componentWillUnmount() {
      document.removeEventListener('click', this.handleClickOutside.bind(this), true);
    }
    checkoutClick(e) {
      e.preventDefault();
      this.setState({
          showCart: false
      })
      this.context.router.push('/dashboard/marketplace/checkout')
    }
    render(){
      let cartItems;
    let profileImage = crypt.decrypt(cookies.get('ProfilePhoto'))
        //console.log(this.state.cart);
        cartItems = this.state.cart.map(product =>{
			return(
				<li className="cart-item" key={product.name}>
                    <img className="product-image" src={product.image} />
                    <div className="product-info">
                        <p className="product-name">{product.name}</p>
                        <p className="product-price">{product.price.toFixed(4)}</p>
                    </div>
                    <div className="product-total">
                        <p className="quantity">{product.quantity} {product.quantity > 1 ?"Qty." : "Qty." } </p>
                        <p className="amount">{(product.price * product.quantity).toFixed(4)}</p>
                    </div>
                    <a className="product-remove" href="#" onClick={this.removeProduct.bind(this, product.id)}>×</a>
                </li>
			)
		});
        let view;
    if(cartItems.length <= 0){
			view = <EmptyCart />
		} else{
			view = <CSSTransitionGroup transitionName="fadeIn" transitionEnterTimeout={500} transitionLeaveTimeout={300} component="ul" className="cart-items">{cartItems}</CSSTransitionGroup>
		}
        return(
            <header1>
                <div className="container" id="shop_Header" style={{width:'65%'}}>
                    <div className="brand" style={{display:'none'}}>
                        <img className="logo" src="https://hurify.co/wp-content/uploads/2018/03/cropped-hurify_logo_1.png" alt="HURIFY"/>
                    </div>

                    <div className="search" style={{width:'20%'}}>
                        <a className="mobile-search" href="#" onClick={this.handleMobileSearch.bind(this)}><img src="https://res.cloudinary.com/sivadass/image/upload/v1494756966/icons/search-green.png" alt="search"/></a>
                        <div className={this.state.mobileSearch ? "search-form active" : "search-form"}>
                            <a className="back-button" href="#" onClick={this.handleSearchNav.bind(this)}><img src="https://res.cloudinary.com/sivadass/image/upload/v1494756030/icons/back.png" alt="back"/></a>
                            <input type="search" ref="searchBox" placeholder="Search for Items" className="search-keyword" onChange={this.props.handleSearch} style={{background:'#fff', color:'#000'}}/>
                            <button className="search-button" type="submit" onClick={this.handleSubmit.bind(this)}></button>
                        </div>
                    </div>
                    <a href="/dashboard/chooseprofile" style={{marginLeft:'2px',marginTop:'5px'}}><img className="logo" src={profileImage} style={{width:'50px',borderRadius:'50%',height:'50px'}} alt="hurify" /></a>
                    <div className="cart">
                        <a className="cart-icon" href="#" onClick={this.handleCart.bind(this)} ref="cartButton">
                        <div onClick={this.hide} href="#close" title="Close" className="closeButton">{this.props.totalItems}</div>
                            <i className="fa fa-shopping-cart" aria-hidden="false" style={{fontSize:'25px',textAlign:'center',color:'#fff',margin:'10px 0px',marginTop: '5px',verticalAlign: 'middle',paddingBottom: '0px'}}></i>
                            <span style={{color:'#fff',paddingLeft:'5px',display:'inline-block',verticalAlign: 'middle',fontSize:'18px',marginTop:'-10px'}}>Cart</span>
                        </a>
                        <div className={this.state.showCart ? "cart-preview active" : "cart-preview"} ref="cartPreview">
                            <CartScrollBar>
                                {view}
                            </CartScrollBar>
                            <div className="action-block">
                                <button type="button" className={this.state.cart.length > 0 ? " " : "disabled"} onClick={this.checkoutClick} style={{padding:'5px'}}>PROCEED TO CHECKOUT</button>
                            </div>
                        </div>
                        <div className="logout" style={{marginTop:'-5px'}}>
                          <Link to="/dashboard/marketplace/myorders" style={{color:'#fff',fontWeight:'600',fontSize:'16px'}}>My Orders</Link>
                        </div>
                        <div className="logout" >
                        <button style={{width:'40px',height:'40px',background:'transparent',border:'transparent', color:'#fff', marginTop:'-20px'}} onClick={this.logout} ><span className="glyphicon glyphicon-log-out"><br/><span style={{fontSize:'16px',fontWeight:'600'}}>Logout</span></span></button>
                        </div>

                    </div>
                </div>
            </header1>
        )
    }
}
Header.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Header;
