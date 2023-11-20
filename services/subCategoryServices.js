const SubCategoryModel = require('../models/subCategory');
const factory = require('./handlerFactory'); 

//Nested Route   @route   GET  /api/v1/category/:categoryId/subCategory
exports.createFilterObject = (req,res,next) => {
    let filterObject ={};
    if(req.params.categoryId) {
        filterObject = {category : req.params.categoryId}}
        req.filterObj  = filterObject;
        next();
    }


exports.getCategoryIdToBody =(req,res,next)=>{
    if(!req.body.category)
    req.body.category = req.params.categoryId;
    next();
    }

// @desc    get list of subCategory
// @route   GET  /api/v1/subCategory
// @access  Public
exports.getSubCategory = factory.getAll(SubCategoryModel);


// @desc    get specific subCategory by id 
// @route   GET  /api/v1/subCategory/:id
// @access  Public
exports.getSubCategoryId= factory.getOne(SubCategoryModel);


// @desc    Create subCategory
// @route   POST  /api/v1/subCategory
// @access  Private
exports.createSubCategory = factory.createOne(SubCategoryModel);


// @desc    Update specific category
// @route   PUT /api/v1/subCategory/:id
// @access  Private
exports.updateSubCategory = factory.updateOne(SubCategoryModel);


// @desc    Delete specific category
// @route   DELETE /api/v1/subCategory/:id
// @access  Private
 exports.deleteSubCategory = factory.deleteOne(SubCategoryModel);