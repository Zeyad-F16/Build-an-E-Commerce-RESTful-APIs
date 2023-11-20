const asyncHandler = require('express-async-handler');
const userModel = require('../models/userModel');

// @desc    add address to user addresses 
// @route   POST /api/v1/address
// @access  Private/user
exports.addAddress = asyncHandler(async(req, res, next)=>{
// $addToSet => add address to addresses 
const user = await userModel.findByIdAndUpdate(req.user._id,
    {
    $addToSet :{ address : req.body },
    },
    {new : true},
);

res.status(200).json({
  status: 'success',
  message: 'Address added successfully ',
  data: user.address,
});
});


// @desc    remove address 
// @route   POST /api/v1/address/:addressId
// @access  Private/user
exports.removeAddress = asyncHandler(async(req, res, next)=>{
  // $pull => remove address from addresses 
  const user = await userModel.findByIdAndUpdate(req.user._id,
      {
      $pull :{ address : {_id : req.params.addressId } },
      },
      {new : true},
  );
  
  res.status(200).json({
    status: 'success',
    message: 'Address removed successfully ',
    data: user.address,
  });
  });
  
// @desc    get logged user address 
// @route   GET /api/v1/address
// @access  Private/user
exports.getLoggedUseraddress = asyncHandler(async (req, res, next) => {
  const user = await userModel.findById(req.user._id).populate('address');

  res.status(200).json({
    status: 'success',
    results: user.address.length,
    data: user.address,
  });
});
