const express = require('express');

const router = express.Router();

const {
    getProduct,
    getProductId,
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
    resizeProductImages,
} = require('../services/productServices');

const {
    createProductValidator,
    updateProductValidator,
    deleteProductValidator,
    getProductValidator
} = require('../utils/validators/productValidator');

const {protrct , allowedTo} = require('../services/authServices');

const reviewRoute = require('./reviewRoute');

// Nested route
router.use('/:productId/review', reviewRoute);

router.route('/')
.get(getProduct)

.post(protrct ,
    allowedTo('admin','manager') ,
    uploadProductImage,
    resizeProductImages ,
    createProductValidator ,
    createProduct);

router.route('/:id')
.get(getProductValidator , 
     getProductId)

.put(protrct ,
    allowedTo('admin','manager') ,
    uploadProductImage , 
    resizeProductImages , 
    updateProductValidator , 
    updateProduct)
    
.delete(protrct ,
    allowedTo('admin') ,
    deleteProductValidator ,
    deleteProduct);

module.exports = router;
