const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid'); 
const sharp = require('sharp'); // package that take a image and resize it by buffer
const factory = require('./handlerFactory');
const {uploadSingleImage} =require('../middlewares/uploadImageMiddleware');
const brandModel = require('../models/brandModel');

// @desc    Get list of brands
// @route   GET /api/v1/brand
// @access  Public

exports.getBrand = factory.getAll(brandModel);

// @desc    Get specific brand by id
// @route   GET /api/v1/brand/:id
// @access  Public

exports.getBrandId = factory.getOne(brandModel);

// @desc    Create brand
// @route   POST  /api/v1/brand
// @access  Private
exports.createBrand = factory.createOne(brandModel);


// @desc    Update specific brand
// @route   PUT /api/v1/brand/:id
// @access  PrivatebrandModel
exports.updateBrand = factory.updateOne(brandModel)

// @desc    Delete specific brand
// @route   DELETE /api/v1/brand/:id
// @access  Private
exports.deleteBrand = factory.deleteOne(brandModel);


// upload single image 
exports.uploadBrandImage = uploadSingleImage('image');


// resize the image 
exports.resizeImage = asyncHandler(async (req ,res , next)=>{
    const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/brand/${fileName}`);
    
    // save image name on db
     req.body.image = fileName;
     next();
 });