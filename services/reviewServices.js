const factory = require('./handlerFactory');
const reviewModel = require('../models/reviewModel');

//Nested Route   @route   GET  /api/v1/product/:productId/review
exports.createFilterObject = (req,res,next) => {
    let filterObject ={};
    if(req.params.productId) filterObject = {product : req.params.productId}
        req.filterObj  = filterObject;
        next();
    }

// Nested route (Create)
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) req.body.product = req.params.productId;
    if (!req.body.user) req.body.user = req.user._id;
    next();
  };
// @desc    Get list of reviews
// @route   GET /api/v1/review
// @access  Public
exports.getReviews = factory.getAll(reviewModel);


// @desc    Get specific review by id
// @route   GET /api/v1/review/:id
// @access  Public
exports.getReview = factory.getOne(reviewModel);


// @desc    Create review
// @route   POST  /api/v1/review
// @access  Private/protected/User
exports.createReview = factory.createOne(reviewModel);


// @desc    Update specific review
// @route   PUT /api/v1/review/:id
// @access  Private/protected/User
exports.updateReview = factory.updateOne(reviewModel)


// @desc    Delete specific review
// @route   DELETE /api/v1/review/:id
// @access  Private/protected/User-admin-manager
exports.deleteReview = factory.deleteOne(reviewModel);


