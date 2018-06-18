import React, {Component} from 'react';
import ReactDOM from "react-dom";
import Product from './Product';
import LoadingProducts from './loaders/Products';
import NoResults from "./empty-states/NoResults";
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import AuthLayer from './../../../network/AuthLayer'
import Cookies from 'universal-cookie';
import styles from './Products.css'
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
      categoryName:'',
			categoryCount:'',
			offset:'0',
			pageNaviCount:''
		};
		this.next = this.next.bind(this);
	 	this.prev = this.prev.bind(this);
		this.pageNavigation = this.pageNavigation.bind(this);
		this.activePageNavigation = this.activePageNavigation.bind(this);
		this.pageNavigationNext = this.pageNavigationNext.bind(this);
		this.pageNavigationPrev = this.pageNavigationPrev.bind(this);
		this.pageNavigationFirst = this.pageNavigationFirst.bind(this);
		this.pageNavigationLast = this.pageNavigationLast.bind(this);
	}
componentWillMount() {
	//alert(crypt.decrypt(cookies.get('categoryName')))
	//alert(crypt.decrypt(cookies.get('subCategoryName')))
  this.setState({
    categoryName:crypt.decrypt(cookies.get('categoryName')),
  })
	const data = {
		token: crypt.decrypt(cookies.get('token')),
		category:crypt.decrypt(cookies.get('categoryName')),
		offset:0
	}

	AuthLayer.getProductCategoriesAndCount(data)
	.then(response => {
			if (response.data.success){
				//alert("Hai"+JSON.stringify(response.data))
				for(var i=0; i<response.data.data.length; i++)
				{
						//alert(response.data.data[i].categories)
						if(response.data.data[i].categories == this.state.categoryName){
							//alert(response.data.data[i].counts);
							this.setState({
								categoryCount:response.data.data[i].counts,
								pageNaviCount:Math.round(response.data.data[i].counts / 100)
							})
						}
				}

			}
	})

	AuthLayer.getFilterProductsBasedOnCategory(data)
	.then(response => {
			if (response.data.success){
				//alert("Hai"+JSON.stringify(response.data))
				this.setState({productCateg:response.data.data})
			}
	})

	// AuthLayer.getproductbasedonsubcategories(data)
	// .then(response => {
	// 		if (response.data.success){
	// 			alert("Hai"+JSON.stringify(response.data))
	// 			//this.setState({productCateg:response.data.data})
	// 		}
	// })
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
		pageNavigation(pageNum){
			//alert(pageNum)
			//this.setState({})
			const data = {
				token: crypt.decrypt(cookies.get('token')),
				category:crypt.decrypt(cookies.get('categoryName')),
				offset:pageNum
			}
			AuthLayer.getFilterProductsBasedOnCategory(data)
			.then(response => {
					if (response.data.success){
						//alert("Hai"+JSON.stringify(response.data))
						this.setState({
							productCateg:response.data.data,
							offset:pageNum
						})
					}
			})
		}

		pageNavigationNext(pageNum)
		{
				//alert(pageNum)
				//alert(this.state.pageNaviCount)
				let total = parseInt(this.state.pageNaviCount) - 1
				//alert(total)
				if(total > pageNum){
					pageNum = parseInt(pageNum) + 1;
					//alert(pageNum)
					const data = {
						token: crypt.decrypt(cookies.get('token')),
						category:crypt.decrypt(cookies.get('categoryName')),
						offset:pageNum
					}
					AuthLayer.getFilterProductsBasedOnCategory(data)
					.then(response => {
							if (response.data.success){
								//alert("Hai"+JSON.stringify(response.data))
								this.setState({
									productCateg:response.data.data,
									offset:pageNum
								})
							}
					})
				}
				else
				{
					//alert(this.state.pageNaviCount)
					pageNum = 0;
					//alert(pageNum)
					const data = {
						token: crypt.decrypt(cookies.get('token')),
						category:crypt.decrypt(cookies.get('categoryName')),
						offset:pageNum
					}
					AuthLayer.getFilterProductsBasedOnCategory(data)
					.then(response => {
							if (response.data.success){
								//alert("Hai"+JSON.stringify(response.data))
								this.setState({
									productCateg:response.data.data,
									offset:pageNum
								})
							}
					})
				}
			}

		pageNavigationPrev(pageNum)
		{
			//alert(pageNum)
			if(pageNum > 0){
				pageNum = parseInt(pageNum) - 1;
				//alert(pageNum)
				const data = {
					token: crypt.decrypt(cookies.get('token')),
					category:crypt.decrypt(cookies.get('categoryName')),
					offset:pageNum
				}
				AuthLayer.getFilterProductsBasedOnCategory(data)
				.then(response => {
						if (response.data.success){
							//alert("Hai"+JSON.stringify(response.data))
							this.setState({
								productCateg:response.data.data,
								offset:pageNum
							})
						}
				})
			}
			else{
				pageNum =0;
				//alert(pageNum)
				const data = {
					token: crypt.decrypt(cookies.get('token')),
					category:crypt.decrypt(cookies.get('categoryName')),
					offset:pageNum
				}
				AuthLayer.getFilterProductsBasedOnCategory(data)
				.then(response => {
						if (response.data.success){
							//alert("Hai"+JSON.stringify(response.data))
							this.setState({
								productCateg:response.data.data,
								offset:pageNum
							})
						}
				})
			}
		}

		pageNavigationFirst(pageNum){
			//alert(pageNum)
			const data = {
				token: crypt.decrypt(cookies.get('token')),
				category:crypt.decrypt(cookies.get('categoryName')),
				offset:pageNum
			}
			AuthLayer.getFilterProductsBasedOnCategory(data)
			.then(response => {
					if (response.data.success){
						//alert("Hai"+JSON.stringify(response.data))
						this.setState({
							productCateg:response.data.data,
							offset:pageNum
						})
					}
			})
		}

		pageNavigationLast(pageNum){
			pageNum = parseInt(pageNum) - 1;
			const data = {
				token: crypt.decrypt(cookies.get('token')),
				category:crypt.decrypt(cookies.get('categoryName')),
				offset:pageNum
			}
			AuthLayer.getFilterProductsBasedOnCategory(data)
			.then(response => {
					if (response.data.success){
						//alert("Hai"+JSON.stringify(response.data))
						this.setState({
							productCateg:response.data.data,
							offset:pageNum
						})
					}
			})
		}


		activePageNavigation(pageNum){
			return this.state.offset == pageNum ? '#0268a6':'#FFFFFF'
		}
		showPagination(num){
      return this.state.categoryCount > num ? 'block':'none'
    }
		renderPageNavigation(count){
			//alert("count"+count);
			let products =[]
			let c;
			if(count > 0){
			c = Math.round(count / 100);
			//this.setState({pageNaviCount:c})
				if(c<12){
					for (let i = 0; i < c; i++){
	    			products.push( <a href="#" style={{backgroundColor:this.activePageNavigation(i)}} onClick={this.pageNavigation.bind(this,i)}>{i+1}</a> )
	  			}
	  			return products
				}
				else {
					for (let i = 0; i < 12; i++){
						if(i<12){
							products.push( <a href="#" style={{backgroundColor:this.activePageNavigation(i)}} onClick={this.pageNavigation.bind(this,i)}>{i+1}</a> )
						}
	    			else {
							//products.push( <a href="#" style={{backgroundColor:this.activePageNavigation(i)}} onClick={this.pageNavigation.bind(this,15)}>All</a> )
						}
	  			}
	  			return products
				}
			}
		}
  	render(){
			// console.log(this.state.data.length)
			let {leftIcon,rightIcon}=this.state;
    	let productsData;
			let productNavgation;
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
					<Product key={product.id} price={product.price} desc={product.description} name={product.name} image={product.image} id={product.id} addToCart={this.props.addToCart} productQuantity={this.props.productQuantity} updateQuantity={this.props.updateQuantity} openModal={this.props.openModal} cartItems={this.props.cartItems}/>
				)
		}

	);

	//productNavgation  = this.renderPageNavigation(this.state.categoryCount)


		// Empty and Loading States
		// let view;
		// if(productsData.length <= 0 && !term){
		// 	view = <LoadingProducts />
		// } else if(productsData.length <= 0 && term){
		// 	view = <NoResults />
		// } else{
		// 	view = <div className={styles.FeaturedCategorieDiv}>
		// 			{productsData}
		// 	</div>
		// }

// const categories =

		const slides  = ["https://i.pinimg.com/originals/5d/40/de/5d40defca675751a19088336175bf0d6.jpg","https://i.ebayimg.com/images/g/Dd0AAOSw3ydVg3cU/s-l225.jpg"]
		return(
			<div className="products-wrapper">
				<div className="container" style={{paddingTop:'40px', width:'100%',margin:'0px auto'}} id="startchange1">
				        <div className={styles.shopLandpage}>
				          <div>
									<div className={styles.FeaturedCategorieNavigationDiv}>
				             <div><h2 style={{textTransform: 'capitalize'}}>{this.state.categoryName}</h2></div>
				             <div className={styles.pagination} style={{display:this.showPagination(100)}}>
										 	 <a href="#" onClick={this.pageNavigationFirst.bind(this,0)}>&laquo;</a>
											 		<a href="#" onClick={this.pageNavigationPrev.bind(this,this.state.offset)}>&lsaquo;</a>
											 			{this.renderPageNavigation(this.state.categoryCount)}
											 		<a href="#" onClick={this.pageNavigationNext.bind(this,this.state.offset)}>&rsaquo;</a>
											 <a href="#" onClick={this.pageNavigationLast.bind(this,this.state.pageNaviCount)}>&raquo;</a>
				             </div>
         	 				</div>

				            <div className={styles.productCategoriesListDiv}>
												{productCategorieDataNew}
				            </div>
				          </div>
                  <div className={styles.FeaturedCategorieDiv}>
                    {productsData}
                  </div>
				        </div>
				</div>
			</div>
		)
	}
}

export default Products;
