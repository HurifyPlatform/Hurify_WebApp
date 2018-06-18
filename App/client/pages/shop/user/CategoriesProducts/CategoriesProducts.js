import React, {Component} from 'react';
import ReactDOM from "react-dom";
import Product from './Product';
import LoadingProducts from './loaders/Products';
import NoResults from "./empty-states/NoResults";
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import AuthLayer from './../../../network/AuthLayer'
import Cookies from 'universal-cookie';

var crypt = require('./../../../../config/crypt');
const cookies = new Cookies();
class Products extends Component{
	constructor(){
		super();
		this.state ={
			activeItem: 1,
      maxLength: 4,
			data:[],
			productCateg:[]
		};
		this.next = this.next.bind(this);
	 	this.prev = this.prev.bind(this);
	}
componentWillMount() {
	const data = {
		token: crypt.decrypt(cookies.get('token')),
		category:'sensors'
	}
	AuthLayer.getFilterProductsBasedOnCategory(data)
	.then(response => {
			if (response.data.success){
				alert("Hai"+JSON.stringify(response.data))
				this.setState({productCateg:response.data.data})
			}
	})
}
	next() {
	    const nextItem = this.state.activeItem + 1;
	    if(nextItem > this.state.maxLength) {
	      this.setState({ activeItem: 1 });
	    } else {
	      this.setState({ activeItem: nextItem });
	    }
	  }

	  prev() {
	    const prevItem = this.state.activeItem - 1;
	    if(prevItem < 1) {
	      this.setState({ activeItem: this.state.maxLength });
	    } else {
	      this.setState({ activeItem: prevItem });
	    }
	  }

	  goToIndex(item) {
	    if (this.state.activeItem !== item) {
	      this.setState({
	        activeItem: item
	      });
	    }
	  }

		// renderProducts(data){
		// 	//alert(data.length)
		// 	return data.map(productCategorie => {
		// 		return
		// 			<div key={idx}>
		// 			 	<h2>{productcategory.categoryName}</h2>
		// 			 		<div className={styles.FeaturedCategorieDiv}>
		// 			 				<Product key={product.id} price={product.price} name={product.name} image={product.image} id={product.id} addToCart={this.props.addToCart} productQuantity={this.props.productQuantity} updateQuantity={this.props.updateQuantity} openModal={this.props.openModal} cartItems={this.props.cartItems}/>
		// 			 		</div>
		// 			</div>
    //
		// 	})
		// }

  	render(){
			console.log(this.state.data.length)
			let {leftIcon,rightIcon}=this.state;
    	let productsData;
			let productCategorieDataNew;
			let productsDataNew;
    	let term = this.props.searchTerm;
    	let x;
		function searchingFor(term){
			return function(x){
				return x.name.toLowerCase().includes(term.toLowerCase()) || !term;
			}
		}

		// productsDataNew = this.state.data.map(productcategory => {
		// 	return (
		// 				<div>
		// 				  <hr/>
		// 					<h2 className={styles.FeatureProductsCategName}>{productcategory.categoryName}</h2>
		// 					<div className={styles.FeaturedCategorieDiv}>
		// 					{
		// 						productsData = productcategory.products.filter(searchingFor(term)).map(product =>{
		// 								return (
		// 									<Product key={product.id} price={product.price} desc={product.description} name={product.name} image={product.image} id={product.id} addToCart={this.props.addToCart} productQuantity={this.props.productQuantity} updateQuantity={this.props.updateQuantity} openModal={this.props.openModal} cartItems={this.props.cartItems}/>
		// 								)
		// 						}
    //
		// 					)
		// 					}
		// 					</div>
    //
		// 				</div>
		// 	)
		// })

		productsData = this.state.productCateg.filter(searchingFor(term)).map(product =>{
				return (
					<Product key={product.id} price={product.price} desc={product.description} name={product.name} image={product.image} manufacturer={product.manufacturer} id={product.id} addToCart={this.props.addToCart} productQuantity={this.props.productQuantity} updateQuantity={this.props.updateQuantity} openModal={this.props.openModal} cartItems={this.props.cartItems}/>
				)
		}

	);


		// Empty and Loading States
		let view;
		if(productsData.length <= 0 && !term){
			view = <LoadingProducts />
		} else if(productsData.length <= 0 && term){
			view = <NoResults />
		} else{
			view = <div className={styles.FeaturedCategorieDiv}>
					{productsData}
			</div>
		}

// const categories =

		const slides  = ["https://i.pinimg.com/originals/5d/40/de/5d40defca675751a19088336175bf0d6.jpg","https://i.ebayimg.com/images/g/Dd0AAOSw3ydVg3cU/s-l225.jpg"]
		return(
			<div className="products-wrapper" style={{marginLeft:'50px'}}>
				<div className="container" style={{paddingTop:'80px'}} id="startchange1">
				        <div className={styles.shopLandpage}>
				          <div>
				            <h2>Product Categories</h2>
				            <div className={styles.productCategoriesListDiv}>
												{productCategorieDataNew}
				            </div>
				          </div>
									{productsDataNew}
				        </div>
				</div>
			</div>
		)
	}
}

export default Products;
