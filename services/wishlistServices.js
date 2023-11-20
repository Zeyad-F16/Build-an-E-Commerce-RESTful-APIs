const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');

// @desc    add product to wishlist
// @route   POST /api/v1/wishlist
// @access  Private/user
exports.addProductToWishlist = asyncHandler(async(req, res, next)=>{
// $addToSet => add productId to wishlist array if productId not exist
const user = await userModel.findByIdAndUpdate(req.user._id,
    {
    $addToSet :{ wishlist : req.body.productId },
    },
    {new : true},
);

res.status(200).json({
  status: 'success',
  message: 'product added successfully to your wishlist',
  data: user.wishlist,
});
});


// @desc    remove product from wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private/user
exports.removeProductFromWishlist = asyncHandler(async(req, res, next)=>{
  // $pull => remove productId from wishlist array if productId exist
  const user = await userModel.findByIdAndUpdate(req.user._id,
      {
      $pull :{ wishlist : req.params.productId },
      },
      {new : true},
  );
  
  res.status(200).json({
    status: 'success',
    message: 'removed successfully from your wishlist',
    data: user.wishlist,
  });
  });
  
// @desc    get logged user wishlist 
// @route   GET /api/v1/wishlist
// @access  Private/user
exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate('wishlist');

  res.status(200).json({
    status: 'success',
    results: user.wishlist.length,
    data: user.wishlist,
  });
});


