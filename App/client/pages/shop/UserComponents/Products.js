import React, {Component} from 'react';
import ReactDOM from "react-dom";
import Product from './Product';
import LoadingProducts from './loaders/Products';
import NoResults from "./empty-states/NoResults";
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import styles from './Products.css'
import AuthLayer from './../../../network/AuthLayer'
import Cookies from 'universal-cookie';
import { browserHistory } from 'react-router'

var crypt = require('./../../../../config/crypt');
const cookies = new Cookies();
class Products extends Component{
	constructor(){
		super();
		this.state ={
			activeItem: 1,
      maxLength: 4,
			data:[],
			productCateg:[],
			subCategoryDivShow:'none',
			activeSubCategory:'none',
			subCategoryName:'',
			subCategoryData:[]
		};
		this.next = this.next.bind(this);
	 	this.prev = this.prev.bind(this);
		this.prev = this.getCategoriyProduct.bind(this);
		this.showSubCategory = this.showSubCategory.bind(this);
		this.getSubCategoriyProduct = this.getSubCategoriyProduct.bind(this);

	}
componentWillMount() {
	const data = {
		token: crypt.decrypt(cookies.get('token'))
	}
	AuthLayer.getProductForAllCategories(data)
	.then(response => {
			if (response.data.success){
				//alert("Hai"+JSON.stringify(response.data))
				this.setState({data:response.data.data})
			}
	})
	AuthLayer.getProductCategoriesAndCount(data)
	.then(response => {
			if (response.data.success){
				//alert("Hai"+JSON.stringify(response.data))
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

		showSubCategory(name,id)
 		{
			//alert(id);
			const data = {
				token: crypt.decrypt(cookies.get('token')),
				category:name
			}
			AuthLayer.getproductsubcategoriesandcount(data)
			.then(response => {
					if (response.data.success){
						//alert("Hai"+JSON.stringify(response.data))
						//this.setState({data:response.data.data})
						this.setState({
							subCategoryDivShow:'block',
							activeSubCategory:id,
							subCategoryName:name,
							subCategoryData:response.data.data
						})
					}
			})


 		}
		hideSubCategory(){
		   this.setState({
		     subCategoryDivShow:'none',
		     activeSubCategory:'none'
		   })
		 }

		 activeCategory(active){
 		 	return this.state.activeSubCategory == active ? '#0268a6':''
			}

		getCategoriyProduct(name){
			//alert(name)
			cookies.set('categoryName', crypt.encrypt(name), { path: '/' });
			browserHistory.push('/dashboard/marketplace/category')
		}
		getSubCategoriyProduct(name,count){
			//alert(name)
			cookies.set('subCategoryName', crypt.encrypt(name), { path: '/' });
			cookies.set('subCategoryCount', crypt.encrypt(count), { path: '/' });
			browserHistory.push('/dashboard/marketplace/subcategory')
		}

		renderDivId(num){
			if(num >= 4){
				let num1
				num1 = parseInt(num) % 4
				return 'subCategoryDivId'+num1
			}
			else{
				return 'subCategoryDivId'+num
			}

		 }
  	render(){
			//console.log(this.state.data.length)
			let {leftIcon,rightIcon}=this.state;
    	let productsData;
			let productCategorieDataNew;
			let productsDataNew;
			let subCategoryDivRender
    	let term = this.props.searchTerm;
    	let x;
		function searchingFor(term){
			return function(x){
				return x.name.toLowerCase().includes(term.toLowerCase()) || !term;
			}
		}

		productCategorieDataNew = this.state.productCateg.map((productCateg, idx) => {
			return(
						<div className={styles.CategoriesDiv} onClick={this.showSubCategory.bind(this,productCateg.categories, idx)} style={{color:this.activeCategory(idx)}}>
							<div className={styles.CategoriesIcon}><img src={productCateg.categoryImageURL}/></div>
							<div className={styles.CategorieNameDiv}>
								<div><span className={styles.CategorieName}>{productCateg.categories}</span></div>
								<div><span>{productCateg.counts} &nbsp; Products</span></div>
							</div>
						</div>
			)
		})

		subCategoryDivRender = this.state.subCategoryData.map((subCateg, idx) =>{
			return (
				<div className={styles.subCategoryListInnerDiv}><span onClick={this.getSubCategoriyProduct.bind(this,subCateg.subCategories,subCateg.counts)}>{subCateg.subCategories}</span></div>
			)
		})

		productsDataNew = this.state.data.map(productcategory => {
			return (
						<div>
						  <hr/>
							<h2 className={styles.FeatureProductsCategName} onClick={this.getCategoriyProduct.bind(this,productcategory.categoryName)}>{productcategory.categoryName}</h2>
							<div className={styles.FeaturedCategorieDiv}>
							{
								productsData = productcategory.products.filter(searchingFor(term)).map((product, index) =>{
										//alert(index)
										if(index < 3){
											return (
												<Product key={product.id} price={product.price} desc={product.description} name={product.name} image={product.image} id={product.id} manufacturer={product.manufacturer} addToCart={this.props.addToCart} productQuantity={this.props.productQuantity} updateQuantity={this.props.updateQuantity} openModal={this.props.openModal} cartItems={this.props.cartItems}/>
											)
										}

								}

							)
							}
							</div>

						</div>
			)
		})

		productsData = this.props.productsList.filter(searchingFor(term)).map(product =>{
				return (
					<Product key={product.id} price={product.price} name={product.name} image={product.image} id={product.id} manufacturer={product.manufacturer} addToCart={this.props.addToCart} productQuantity={this.props.productQuantity} updateQuantity={this.props.updateQuantity} openModal={this.props.openModal} cartItems={this.props.cartItems}/>
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
			<div className="products-wrapper" style={{width:'100%'}}>
				<div className="container" style={{paddingTop:'100px', width:'100%', marginLeft:'20px'}} id="startchange1">
				        <div className={styles.shopLandpage}>
				          <div>
				            <h2>Product Categories</h2>
				            <div className={styles.productCategoriesListDiv}>
												{productCategorieDataNew}
				            </div>
										<div className={styles.tooltip} style={{display:this.state.subCategoryDivShow}} >
			               <div className={styles.subCategoryDiv} id={this.renderDivId(this.state.activeSubCategory)}>
			                 <div className={styles.subCategoryCloseDiv}><a href='#' onClick={this.hideSubCategory.bind(this)}><i className="fa fa-times" aria-hidden="true"></i></a></div>
			                 <div className={styles.subCategoryInnerDiv}>
			                     <div className={styles.subCategoryNameDiv}><h3>{this.state.subCategoryName}</h3></div>
			                 </div>
			                 <div className={styles.subCategoryListDiv}>
											 	{subCategoryDivRender}
			                 </div>
			             </div>
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
