import React from 'react'
import { Link } from 'react-router'
import PropTypes from 'prop-types'
import AuthLayer from './../../../../network/AuthLayer'
import { browserHistory } from 'react-router'
import UserStore from './../../../../stores/UserStore'
import styles from './Product.css'
import HomePage from './../HomePage/HomePage'
import Header from '../../UserComponents/Header';
import Cookies from 'universal-cookie';

var crypt = require('./../../../../../config/crypt');
const cookies = new Cookies();
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import {blue700, cyan700, pinkA200, grey100, grey300, grey400, white, darkBlack, fullBlack} from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

const muiTheme = getMuiTheme({
  fontFamily: 'Roboto, sans-serif',
  palette: {
    primary1Color: blue700,
    primary2Color: cyan700,
    primary3Color: grey400,
    accent1Color: pinkA200,
    accent2Color: grey100,
    accent3Color: blue700,
    textColor: darkBlack,
    alternateTextColor: white,
    canvasColor: white,
    borderColor: grey300,
    pickerHeaderColor: blue700,
    shadowColor: fullBlack
  },
  appBar: {}
});
class Product extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productDetails:{},
      specifications:{},
      cart:[],
      totalAmount:0,
      productQuantity:1,
      specificationsDisplay:'block',
      fileDisplay:'block'
    };
    this.AddProductToCart = this.AddProductToCart.bind(this);
    this.handleRemoveProduct = this.handleRemoveProduct.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
  }


  componentWillMount() {
    window.scrollTo(0, 0);
    this.getProductDescription();
    this.getCartProducts();
  }
  getProductDescription() {
    const data = {
      token: crypt.decrypt(cookies.get('token')),
      productId: crypt.decrypt(cookies.get('viewProductId'))
    }
    //alert(JSON.stringify(data))
    AuthLayer.getProductDescription(data)
    .then(response => {
      //alert(JSON.stringify(response.data));
      console.log(JSON.stringify(response.data));
        if (response.data.success){
          console.log(typeof(response.data.data.specifications));
          this.setState({
            productDetails:response.data.data,
            specifications:JSON.parse(response.data.data.specifications)
          })
          if (response.data.data.specifications == null && response.data.data.specifications == []) {
            this.setState({
              specificationsDisplay:'none'
            })
          }
          if (response.data.data.documentPath == "" || response.data.data.documentPath == null) {
            this.setState({
              fileDisplay:'none'
            })
          }
        }
    });
  }
  getCartProducts() {
    const data = {
      token: crypt.decrypt(cookies.get('token')),
      userId: crypt.decrypt(cookies.get('UserID'))
    }
    AuthLayer.getCartProducts(data)
    .then(response => {
        if (response.data.success){
          console.log(response.data);
          this.setState({
            cart : response.data.data
          })
          this.sumTotalItems(this.state.cart);
          this.sumTotalAmount(this.state.cart);
        }
    });
  }
AddProductToCart(e) {
  e.preventDefault();
  		const data = {
			token: crypt.decrypt(cookies.get('token')),
			userId: parseInt(crypt.decrypt(cookies.get('UserID'))),
			productId: this.state.productDetails.id,
			quantity: this.state.productQuantity,
			price: this.state.productDetails.price
		}
		// console.log(data);
		var responseData = []
		AuthLayer.addProductsToCart(data)
	  .then(response => {
	      if (response.data.success){
          this.setState({
            cart:response.data.data
          })
          this.sumTotalItems(this.state.cart);
          this.sumTotalAmount(this.state.cart);
					// alert("Successfully added product to cart")
          // browserHistory.push('/home')
          // HomePage.sumTotalItems(response.data.data)

				}
				else {

				}

		});

}
handleRemoveProduct(e) {
  // e.preventDefault();
  this.getCartProducts();
}
sumTotalItems(){
      let total = 0;
      let tmp = 0;
      let cart = this.state.cart;
      for(var i=0; i< cart.length; i++){
        tmp = tmp + cart[i].quantity
      }
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
    totalAmount: total
  })
  }
  increment(e){
    	this.setState(prevState => ({
      	productQuantity: Number(prevState.productQuantity) + 1
    	})
    );
		e.preventDefault();
  };

	decrement(e){
		e.preventDefault();
		if(this.state.productQuantity <= 1){
			return this.state.productQuantity;
		}
		else{
			this.setState(prevState => ({
				productQuantity: Number(prevState.productQuantity) - 1
			})
    );
		}
	};

  render() {
    console.log("hai"+this.state.specifications)
    var specifications = this.state.specifications
    console.log(typeof(this.state.specifications));
    var Items = Object.keys(specifications).map(function(key) {
      return (<TableRow>
        <TableRowColumn>{key}</TableRowColumn>
        <TableRowColumn>{specifications[key]}</TableRowColumn>
      </TableRow>)
    });

    return (
      <div>
      <Header
        total={this.state.totalAmount}
        totalItems={this.state.totalItems}
        cartItems={this.state.cart}
        removeProduct={this.handleRemoveProduct}
      />
      <div className="row" style={{textAlign:'left',marginBottom:'100px',paddingTop:'40px', marginRight:'0px', marginLeft:'80px'}} autoscroll="true">
        <div className="col-md-3">
            <img className={styles.productView} src={this.state.productDetails.image} alt="hurify" />
        </div>
        <div className="col-md-9">
          <div className={styles.detailsView}>
            <p className={styles.name}>{this.state.productDetails.name}</p>
            <p className={styles.name} style={{marginBottom:'0px'}}>{this.state.productDetails.price}</p>
            <p>Prices are indicative and may change without notice</p>
            <p className={styles.manufacturer}>Manufactured by: <span className={styles.manufacturer1}>{this.state.productDetails.manufacturer}</span></p>
            <div className="stepper-input" style={{ margin:'10px 0px'}}>
      				<a href="#" className="decrement" onClick={this.decrement}>–</a>
      				<label ref="feedQty" className="quantity">{this.state.productQuantity}</label>
      				<a href="#" className="increment" onClick={this.increment}>+</a>
      			</div>
            <div className={styles.flex_container2} style={{height:'50px', textAlign:'center'}}>
              <button  onClick={this.AddProductToCart} style={{float:'left', width:'100px',padding:'5px 5px',backgroundColor:'#528EC1', borderColor:'#528EC1', color:'#fff', borderRadius:'5px',fontSize:'14px',marginTop:'10px'}}>Add to Cart</button>

                <div><ul className="smooth-scroll list-unstyled">
                  <li>
                    <a className="button" href="#test1" style={{height:'36px',marginLeft:'30px',display:this.state.fileDisplay,marginTop:'10px'}}>View Document</a></li>
                    <br/>
                </ul></div>
              </div>

            <hr style={{marginTop:'20px',marginRight:'10px'}}/>
          <p style={{marginTop:'20px', whiteSpace: 'pre-line'}}>{this.state.productDetails.description}</p>

          <p style={{fontSize:'20px',marginTop:'15px',marginBottom:'20px', fontWeight:'600',display:this.state.specificationsDisplay}}>Specifications</p>
            <MuiThemeProvider muiTheme={muiTheme}>
              <Table style={{width:'78%',background:'transparent',border:'1px solid #E5E8E8'}}>
          <TableBody displayRowCheckbox={false}>
            {Items}

          </TableBody>
        </Table>
          </MuiThemeProvider>
          </div>
          <div id="test1" style={{textAlign:'center', display:this.state.fileDisplay}}>
            <embed className={styles.iframePDF} src={this.state.productDetails.documentPath} style={{width:'100%', height:'550px', border:'2px solid #000', borderRadius:'5px',marginTop:'40px'}} frameBorder="0"/>
          </div>
        </div>
      </div>
</div>

    );
  }
}
Product.contextTypes = {
    router: PropTypes.object.isRequired
}
export default Product
