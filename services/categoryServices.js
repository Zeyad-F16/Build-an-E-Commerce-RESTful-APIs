const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid'); // package to generate unique id 
const sharp = require('sharp'); // package that take a image and resize it by buffer
const factory = require('./handlerFactory');
const {uploadSingleImage} =require('../middlewares/uploadImageMiddleware');
const CategoryModel = require('../models/categoryModel');

// @desc    Get list of category
// @route   GET /api/v1/category
// @access  Public
exports.getCategory = factory.getAll(CategoryModel);


// @desc    Get specific category by id
// @route   GET /api/v1/category/:id
// @access  Public
exports.getCategoryId = factory.getOne(CategoryModel);


// @desc    Create category
// @route   POST  /api/v1/category
// @access  Private
exports.createCategory  = factory.createOne(CategoryModel);


// @desc    Update specific category
// @route   PUT /api/v1/category/:id
// @access  Private
exports.updateCategory = factory.updateOne(CategoryModel);


// @desc    Delete specific category
// @route   DELETE /api/v1/category/:id
// @access  Private
exports.deleteCategory = factory.deleteOne(CategoryModel);


// upload single image 
exports.uploadCategoryImage = uploadSingleImage('image');


// resize the image 
exports.resizeImage = asyncHandler(async (req ,res , next)=>{
    const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
    if(req.file){
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/category/${fileName}`);
    
    // save image name on db
    req.body.image = fileName;
}
    // req.body.image = req.hostname+fileName ==> save image url in db

     next();
 });

