const express = require('express');

const {protrct , allowedTo} = require('../services/authServices');

const {addProductToWishlist,
     removeProductFromWishlist ,
     getLoggedUserWishlist} = require('../services/wishlistServices');

const router = express.Router();

router.use( protrct , allowedTo('user'))

router
.route('/')
.get( getLoggedUserWishlist )
.post( addProductToWishlist);

router.delete('/:productId' , removeProductFromWishlist );

module.exports = router;