import React, {Component} from 'react';
import Counter from './Counter';
import { browserHistory } from 'react-router'
import Cookies from 'universal-cookie';
import styles from './Products.css'


var crypt = require('./../../../../config/crypt');
const cookies = new Cookies();
class Product extends Component{
	constructor(props){
		super(props);
        this.state = {
            selectedProduct: {},
            quickViewProdcut: {},
            isAdded: false
        }
    }
    resetQuantity(){

    }
		// componentWillMount() {
		// 	alert(this.props.id)
		// 	let cartItems = this.props.cartItems
		// 	for (var i = 0; i < cartItems.length; i++) {
		// 		if (this.props.id == cartItems[i].productId) {
		// 			alert("added")
		// 			this.setState({
	  //           isAdded: true
	  //       })
		// 		}
		// 		else {
		// 			alert("not added")
		// 			this.setState({
	  //           isAdded: true
	  //       })
		// 		}
		// 	}
		// }
    addToCart(image, name, price, id, quantity){
        this.setState({
            selectedProduct: {
                image: image,
                name: name,
                price: price,
                id: id,
                quantity: quantity
            }
        }, function(){
            this.props.addToCart(this.state.selectedProduct);
        })
        this.setState({
            isAdded: true
        },
				 function(){
            setTimeout(() => {
                this.setState({
                    isAdded: false,
                    selectedProduct: {}
                });
            }, 3750);
        }
			);
    }
    quickView(image, name, price, id){
			// alert(id);
			cookies.set('viewProductId', crypt.encrypt(id), { path: '/' });
			// localStorage.setItem('productId', id)
			this.context.router.push('/dashboard/marketplace/productdetails')
			// browserHistory.push('/dashboard/marketplace/productdetails')
        // this.setState({
        //     quickViewProdcut: {
        //         image: image,
        //         name: name,
        //         price: price,
        //         id: id
        //     }
        // }, function(){
        //     this.props.openModal(this.state.quickViewProdcut);
        // })
    }
    render(){
        let image = this.props.image;
        let name = this.props.name;
        let price = this.props.price;
        let id = this.props.id;
        let quantity = this.props.productQuantity;
				let productDesc = this.props.desc
				let productManufacturer = this.props.manufacturer
        return(
					<div className={styles.FeaturedCategoriesProductDiv}>
                <div className={styles.FeaturedCategoriesProductInnerDiv}>
                    <div className={styles.FeaturedProductImageDiv}><img src={image} onClick={this.quickView.bind(this, image, name, price, id, quantity)} alt="No Image"/></div>
										<div className={styles.FeatureProductNameDiv}><p className={styles.productName}>{name}</p></div>
                    <div className={styles.FeaturedProductDescDiv}><p className={styles.FeaturedProductContent}>{productDesc}</p></div>
                    <div className={styles.FeaturedProductPrice}><span>{this.props.price.toFixed(4)} HUR</span></div>
										<div style={{marginBottom:'10px'}}>Prices are indicative and may change without notice</div>
										<div>Manufactured by: </div>
										<div className={styles.FeaturedProductManufacturerCont}><p>{productManufacturer}</p></div>
								</div>
                <div className={styles.FeaturedAddCartButtonDiv}>
                  <div className={styles.FeaturedCountProdctDiv}>
                      <Counter productQuantity={quantity} updateQuantity={this.props.updateQuantity} resetQuantity={this.resetQuantity}/>
                  </div>
                  <div className={styles.FeaturedAddCartButtonDiv1}><button onClick={this.addToCart.bind(this, image, name, price, id, quantity)}>Add to Cart</button></div>
                </div>
              </div>
            /*<div className="product">
                <div className="product-image">
                    <img src={image} alt={this.props.name} onClick={this.quickView.bind(this, image, name, price, id, quantity)} style={{width:'100px'}}/>
                </div>
                <h4 className="product-name">{this.props.name}</h4>
                <p className="product-price">{this.props.price}</p>
                <Counter productQuantity={quantity} updateQuantity={this.props.updateQuantity} resetQuantity={this.resetQuantity}/>
                <div className="product-action">
                    <button className={!this.state.isAdded ? "" : "added"} type="button" onClick={this.addToCart.bind(this, image, name, price, id, quantity)} disabled={this.state.isAdded}>{!this.state.isAdded ? "ADD TO CART" : "✔ ADDED"}</button>
                </div>
            </div>*/
        )
    }
}
Product.contextTypes = {
    router: React.PropTypes.object.isRequired
}
export default Product;
