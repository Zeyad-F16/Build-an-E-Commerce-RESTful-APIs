const express = require('express');
 
const {protrct , allowedTo} = require('../services/authServices');

const { addProductsToCart , 
        getLoggedUserCart ,
        removeSpecificCartItem ,
         clearCart ,
         updateCartItemQuantity,
         applyCoupon } = require('../services/cartServices');

const router = express.Router();

router.use( protrct , allowedTo('user'))

router
.route('/')
.get( getLoggedUserCart )
.post( addProductsToCart )
.delete( clearCart );

router.put('/applyCoupon', applyCoupon);

router
.route('/:itemId')
.put(updateCartItemQuantity)
.delete(removeSpecificCartItem)

module.exports = router;