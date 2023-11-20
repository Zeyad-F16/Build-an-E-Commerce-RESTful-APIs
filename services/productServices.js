
const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid'); 
const sharp = require('sharp'); 

const productModel = require('../models/productModel');
const factory = require('./handlerFactory');
const {uploadMixOfImages} =require('../middlewares/uploadImageMiddleware');

// @desc    Get list of products
// @route   GET /api/v1/product
// @access  Public
exports.getProduct = factory.getAll(productModel,'product');


// @desc    Get specific product by id
// @route   GET /api/v1/product/:id
// @access  Public
exports.getProductId = factory.getOne(productModel, 'reviews');


// @desc    Create product
// @route   POST  /api/v1/product
// @access  Private
exports.createProduct = factory.createOne(productModel);


// @desc    Update specific product
// @route   PUT /api/v1/product/:id
// @access  PrivateproductModel
exports.updateProduct = factory.updateOne(productModel);


// @desc    Delete specific product
// @route   DELETE /api/v1/product/:id
// @access  Private
exports.deleteProduct = factory.deleteOne(productModel);



exports.uploadProductImage = uploadMixOfImages(
    [{
      name :  'imageCover' ,
      maxCount : 1
    },
    {
    name : 'images',
    maxCount : 10
    }]
    );

    exports.resizeProductImages = asyncHandler(async (req ,res , next)=>{
        if(req.files.imageCover){
        const imageCoverfileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`uploads/product/${imageCoverfileName}`);
        
         req.body.imageCover = imageCoverfileName;
        }
        
        if(req.files.images){
          req.body.images = [];
        await Promise.all(
          req.files.images.map(async(img,index)=>{
          const imageName = `product-${uuidv4()}-${Date.now()}-${index+1}.jpeg`;
        await sharp(img.buffer)
        .resize(2000,1333)
        .toFormat('jpeg')
        .jpeg({quality:90})
        .toFile(`uploads/product/${imageName}`);
        
         req.body.images.push(imageName);
         }))
        }
         next();
     });
    
   