const asyncHandler = require('express-async-handler');
const { v4: uuidv4 } = require('uuid'); // package to generate unique id 
const sharp = require('sharp'); // package that take a image and resize it by buffer
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const factory = require('./handlerFactory');
const {uploadSingleImage} = require('../middlewares/uploadImageMiddleware');
const userModel = require('../models/userModel');
const ApiError = require('../utils/apiError');


// @desc    Get list of users
// @route   GET /api/v1/User
// @access  Private/admin
exports.getUser = factory.getAll(userModel);


// @desc    Get specific User by id
// @route   GET /api/v1/User/:id
// @access  Private/admin
exports.getUserId = factory.getOne(userModel);


// @desc    Create User
// @route   POST  /api/v1/User
// @access  Private/admin
exports.createUser = factory.createOne(userModel);


// @desc    Delete specific User
// @route   DELETE /api/v1/User/:id
// @access  Private/admin
exports.deleteUser = factory.deleteOne(userModel);


// @desc    Update specific User
// @route   PUT /api/v1/User/:id
// @access  Private/admin
exports.updateUser = asyncHandler( async(req,res,next) => {
    const document = await userModel.findByIdAndUpdate(
 req.params.id,
 {
    name : req.body.name,
    email : req.body.email,
    slug : req.body.slug,
    phone : req.body.phone,
    role : req.body.role,
    profileImg : req.body.profileImg
 },
 {new:true});
 
 if(!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`,404))
}
res.status(200).json({data : document});
});

// admin change the user password ( so here we don't need a token)
exports.changeUserPassword =  asyncHandler( async(req,res,next) => {
    const document = await userModel.findByIdAndUpdate(
 req.params.id,
 {
    password : await bcrypt.hash(req.body.password ,12),
    passwordChangedAt : Date.now()
 },
 {new:true});
 
 if(!document) {
    return next(new ApiError(`No document for this id ${req.params.id}`,404))
}
res.status(200).json({data : document});
});


// upload single image 
exports.uploadUserImage = uploadSingleImage('profileImg');


// resize the image 
exports.resizeImage = asyncHandler(async (req ,res , next)=>{
    const fileName = `user-${uuidv4()}-${Date.now()}-profileImg.jpeg`;
    if(req.file){
    await sharp(req.file.buffer)
    .resize(600,600)
    .toFormat('jpeg')
    .jpeg({quality:90})
    .toFile(`uploads/user/${fileName}`);
    
    // save image name on db
     req.body.profileImg = fileName;

    }
     next();
 });


// @desc    Get logged User data
// @route   Get /api/v1/User/getMe
// @access  Private/protect 
exports.getLoggedUserData = asyncHandler(async(req, res, next) => {
 req.params.id = req.user._id;
next();
});



// @desc    Update logged User Password (user change his password so here we need a token)
// @route   PUT /api/v1/User/updateMyPassword
// @access  Private/protect
exports.updateLoggedUserPassword = asyncHandler(async(req, res, next)=>{
   // 1- update user password based on user payload (req.user._id)
   const user = await userModel.findByIdAndUpdate(
      req.user._id,
      {
         password : await bcrypt.hash(req.body.password ,12),
         passwordChangedAt : Date.now()
      },
      {new:true});

//2- generate token 
const token = JWT.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
    expiresIn: process.env.JWT_EXPIRE_TIME,
         });

   res.status(200).json({ date: user , token });
});



// @desc    Update logged User Password not include ( password , role)
// @route   PUT /api/v1/User/updateMe
// @access  Private/protect  
exports.updateLoggedUserData = asyncHandler(async(req, res, next)=>{

const user = await userModel.findByIdAndUpdate(
req.user._id,{
name: req.body.name,
email: req.body.email,
phone: req.body.phone

},{new : true});

res.status(200).json({data: user});
});


// @desc    Deactivate logged user
// @route   PUT /api/v1/User/deleteMe
// @access  Private/protect  
exports.deleteLoggedUserData = asyncHandler(async(req, res, next)=>{
await userModel.findByIdAndUpdate(req.user._id,{active:false});

res.status(204).json({status: 'success'});
});
