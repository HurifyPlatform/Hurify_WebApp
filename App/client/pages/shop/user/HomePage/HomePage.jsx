import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { browserHistory } from 'react-router'
import PropTypes from 'prop-types'
import Header from '../../UserComponents/Header';
import Products from '../../UserComponents/Products';
import Pagination from '../../UserComponents/Pagination';
import Footer from '../../UserComponents/Footer';
import QuickView from '../../UserComponents/QuickView';
import AuthLayer from './../../../../network/AuthLayer'
import Cookies from 'universal-cookie';

var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();
class HomePage extends Component{
	constructor(){
		super();
		this.state = {
			products: [],
			cart: [],
			quantityArr: [],
			totalItems: 0,
			totalAmount: 0,
			term: '',
			category: '',
			cartBounce: false,
			quantity : 1,
			quickViewProduct: {},
			modalActive: false
		};
		this.handleSearch = this.handleSearch.bind(this);
		this.handleMobileSearch = this.handleMobileSearch.bind(this);
		this.handleCategory = this.handleCategory.bind(this);
		this.handleAddToCart = this.handleAddToCart.bind(this);
		this.sumTotalItems = this.sumTotalItems.bind(this);
		this.sumTotalAmount = this.sumTotalAmount.bind(this);
		// this.checkProduct = this.checkProduct.bind(this);
		this.updateQuantity = this.updateQuantity.bind(this);
		this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
		this.openModal = this.openModal.bind(this);
		this.closeModal = this.closeModal.bind(this);
		this.addProductsToCart = this.addProductsToCart.bind(this);
	}
	// Fetch Initial Set of Products from external API
	getProducts(){
		const token = {
			token: crypt.decrypt(cookies.get('token'))
		}
		AuthLayer.getAllProducts(token)
	  .then(response => {
			// alert(JSON.stringify(response.data));
	      if (response.data.success){
					// alert("aaa")
					this.setState({
				  			products : response.data.data
				  })

				}
				else {
					alert(JSON.stringify(response.data.error))
				}
			})

	}
	getCartProducts() {
		const data = {
			token: crypt.decrypt(cookies.get('token')),
			userId: crypt.decrypt(cookies.get('UserID'))
		}
		AuthLayer.getCartProducts(data)
	  .then(response => {
	      if (response.data.success){
					// console.log(response.data);
					this.setState({
						cart : response.data.data,
						cartBounce: false
					})
					this.sumTotalItems(this.state.cart);
					this.sumTotalAmount(this.state.cart);
				}
		});
	}
	componentWillMount(){
		// console.log(crypt.decrypt(cookies.get('token')));
		if (crypt.decrypt(cookies.get('token')) != '' && crypt.decrypt(cookies.get('token')) != null) {
			// if (crypt.decrypt(cookies.get('email')) == "lakshmi.spandana@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "schmouli@hurify.co" || crypt.decrypt(cookies.get('email')) == "russell.murphy@hurify.co" || crypt.decrypt(cookies.get('email')) == "srinidhi.murthy@gmail.com" || crypt.decrypt(cookies.get('email')) == "sripriya.murthy@gmail.com" || crypt.decrypt(cookies.get('email')) == "haleygreen406@gmail.com" || crypt.decrypt(cookies.get('email')) == "ashish@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "syed.bilal.hussain@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "padmanabham.pakki@mobodexter.com" || crypt.decrypt(cookies.get('email')) == "sridharkrishnan73@gmail.com") {
				this.getProducts();
				this.getCartProducts();
			// }
			// else {
			// 	alert("Coming Soon")
			// 	 this.context.router.push('/dashboard/mytoken')
      //
      //
			// }

		}
		else {
			browserHistory.push('/')
		}

	}

	// Search by Keyword
	handleSearch(event){
		this.setState({term: event.target.value});
	}
	// Mobile Search Reset
	handleMobileSearch(){
		this.setState({term: ""});
	}
	// Filter by Category
	handleCategory(event){
		this.setState({category: event.target.value});
		// console.log(this.state.category);
	}
	// Add to Cart
	addProductsToCart(selectedProducts) {
		// console.log(selectedProducts);
		const data = {
			token: crypt.decrypt(cookies.get('token')),
			userId: parseInt(crypt.decrypt(cookies.get('UserID'))),
			productId: selectedProducts.id,
			quantity: selectedProducts.quantity,
			price: selectedProducts.price
		}
		// console.log(data);
		AuthLayer.addProductsToCart(data)
	  .then(response => {
	      if (response.data.success){

					this.getCartProducts();
				}
				else {

				}
		});
	}
	handleAddToCart(selectedProducts){
		const data = {
			token: crypt.decrypt(cookies.get('token')),
			userId: parseInt(crypt.decrypt(cookies.get('UserID'))),
			productId: selectedProducts.id,
			quantity: selectedProducts.quantity,
			price: selectedProducts.price
		}
		//alert("hai");
		// console.log(data);
		var responseData = []
		AuthLayer.addProductsToCart(data)
	  .then(response => {
	      if (response.data.success){
					responseData = response.data.data
					// console.log(response.data.data);
					// this.setState({
					// 	cart:response.data.data
					// })
					// this.sumTotalItems();
					// this.sumTotalAmount();
				}
				else {

				}
				this.setState({
					cart:response.data.data,
					quantity:1
				})
				this.sumTotalItems(this.state.cart);
				this.sumTotalAmount(this.state.cart);
		});
	}
	// removeCartProducts(id, e) {
	// 	const data = {
	// 		token: localStorage.getItem('token'),
	// 		userId: localStorage.getItem('userId'),
	// 		cartId: id
	// 	}
	// 	AuthLayer.removeCartProducts(data)
	//   .then(response => {
	// 		// alert(JSON.stringify(response.data))
	//       if (response.data.success){
	// 				this.getCartProducts();
	// 			}
	// 	})
	// 	e.preventDefault();
	// }
	handleRemoveProduct(id, e){

			this.getCartProducts();
	}

	sumTotalItems(){
        let total = 0;
				let tmp = 0;
        let cart = this.state.cart;
				for(var i=0; i< cart.length; i++){
					tmp = tmp + cart[i].quantity
				}
				// console.log("temp"+tmp);
		//total = cart.length;
		total = tmp
		this.setState({
			totalItems: total
		})
    }
	sumTotalAmount(){
		// console.log(this.state.cart[0].quantity);
        var total = 0;
        var cart = this.state.cart;
				// var quantityArr = this.state.quantityArr
        for (var i=0; i<cart.length; i++) {
            total += cart[i].price;
        }
		this.setState({
			totalAmount: total.toFixed(4)
		})
    }

	//Reset Quantity
	updateQuantity(qty){
		// console.log("quantity added...")
		this.setState({
				quantity: qty
		})
	}
	// Open Modal
	openModal(product){
		this.setState({
			quickViewProduct: product,
			modalActive: true
		})
	}
	// Close Modal
	closeModal(){
		this.setState({
			modalActive: false
		})
	}

	render(){
		return(
			<div className="container-fluid" style={{padding:'0px'}}>
				<Header
					cartBounce={this.state.cartBounce}
					total={this.state.totalAmount}
					totalItems={this.state.totalItems}
					cartItems={this.state.cart}
					removeProduct={this.handleRemoveProduct}
					handleSearch={this.handleSearch}
					handleMobileSearch={this.handleMobileSearch}
					handleCategory={this.handleCategory}
					categoryTerm={this.state.category}
					updateQuantity={this.updateQuantity}
					productQuantity={this.state.moq}
				/>

				<Products
					productsList={this.state.products}
					searchTerm={this.state.term}
					addToCart={this.handleAddToCart}
					productQuantity={this.state.quantity}
					updateQuantity={this.updateQuantity}
					openModal={this.openModal}
					cartItems={this.state.cart}
				/>



			</div>
		)
	}
}
HomePage.contextTypes = {
    router: PropTypes.object.isRequired
}
export default HomePage
// ReactDOM.render(
// 	<App />,
//   	document.getElementById('root')
// );
