const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const userModel = require('../models/userModel');
const ApiError = require('../utils/apiError');
const sendEmail = require('../utils/sendEmail');
const createToken =require('../utils/createToken');
const {sanitizeUser}= require('../utils/sanitizeData');

// @desc    signup
// @route   GET /api/v1/auth/signup
// @access  Public
exports.signup =asyncHandler(async (req ,res ,next)=>{
// 1- create user
const user = await userModel.create({
 name : req.body.name ,
 email : req.body.email ,
 password : req.body.password
  });

// 2- generate token
const token = createToken(user._id);
res.status(201).json({data: sanitizeUser(user) , token})
});


// @desc    login
// @route   GET /api/v1/auth/login
// @access  Public
exports.login = asyncHandler( async (req, res, next) => {
// 1- check if password and email in the body (validation)
// 2- check if user exists and if password is correct
const user = await userModel.findOne({ email: req.body.email});
if(!user || !(await bcrypt.compare(req.body.password , user.password))){
return next(new ApiError('Incorrect email or password',401));
}

// 3- generate token
const token = createToken(user._id);

res.status(200).json({data: user , token})

});


// @desc make sure the user is logged in  
exports.protrct = asyncHandler(async(req, res, next)=>{
  // 1- check if token is exist , if exist get it
  let token ;
  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
   token = req.headers.authorization.split(' ')[1];
  }
  if(!token){
 return next(new ApiError('You are not login , please login to get access this route',401));
}

// 2- verify token ==> token is not expired and no changes happened
 const decoded = JWT.verify(token, process.env.JWT_SECRET_KEY);

// 3- check if user exists
 const CurrentUser = await userModel.findById(decoded.userId)
 if(!CurrentUser){
 return next(new ApiError('the user that belong to this token is not found',401));
}
// 4- check if user change his password after token created
if(CurrentUser.passwordChangedAt){
  
  const passChangedTimesStamp = parseInt(CurrentUser.passwordChangedAt.getTime()/1000,10);
  if(passChangedTimesStamp > decoded.iat){
    return next(new ApiError('User resently change a password , please login again',401));

  }
}
req.user = CurrentUser ;
next();
});


// @desc Authorization (user permissions)
// (...roles) =>  ['admin','manager']
exports.allowedTo =(...roles)=> asyncHandler(async(req, res, next)=>{
   // 1 - access roles
   // 2 - access registered users (req.user.role)
  if(!roles.includes(req.user.role)){
  return next(new ApiError('you are not allowed to access this route',403));
  }
  next();
});


// @desc    Forget password
// @route   post /api/v1/auth/forgetPassword
// @access  Public
exports.forgetPassword = asyncHandler(async(req, res, next)=>{
  // 1 - Get user by email
  const user = await userModel.findOne({ email: req.body.email});
  if (!user) {
    return next( new ApiError(`There is no user for this email ${req.body.email}`,404));
  }
  // if user is exist , generate random 6 digits and save it in db 
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedResetCode = crypto
  .createHash('sha256')
  .update(resetCode)
  .digest('hex');

// save hashedResetCode in db
user.passwordResetCode = hashedResetCode;

// add expiration time for password reset code (10 minutes)
user.passwordResetExpires = Date.now() + 10 *60 * 1000 ; 
user.passwordResetVerified = false;
await user.save();

// 3- send the reset code via email
const message =`Hi ${user.name},\n  We got a request to reset your E-shop password \n ${resetCode} \n Enter this code to reset \n Thanks`;

 try{
  await sendEmail({
    email:user.email,
    subject: 'Your password reset code ( valid for 10 minutes )',
    message,
    });
 }
 catch (err) {
  user.passwordResetCode = undefined;
  user.passwordResetExpires = undefined;
  user.passwordResetVerified = undefined;

  user.save();
  return next( new ApiError('there is an error in sending email',500));
 }

res.status(200).json({status: 'success' ,message : 'Reset code send to Email'});

});


// @desc    verify password
// @route   post /api/v1/auth/verifyResetCode
// @access  Public
exports.verifyPasswordResetCode = asyncHandler(async(req, res ,next)=>{
 // 1- Get user based on reset code
 const hashedResetCode = crypto
 .createHash('sha256')
 .update(req.body.resetCode)
 .digest('hex');

const user  = await userModel.findOne({
  passwordResetCode : hashedResetCode,
  passwordResetExpires :{ $gt : Date.now() },
});

if (!user) {
  return next( new ApiError('Reset code invalid or expired',404));
}

// 2- Reset Code Valid
user.passwordResetVerified = true;

await user.save();

res.status(200).json({
  status: 'success',
})

});


// @desc    reset password
// @route   post /api/v1/auth/resetPassword
// @access  Public
exports.resetPassword = asyncHandler(async(req, res, next)=>{
// 1- Get user based on email
const user = await userModel.findOne({ email: req.body.email});
if (!user) {
  return next(new ApiError(`There is no user for this email ${req.body.email}`,404));
}

//2- check if reset code verified
if(user.passwordResetVerified === false ){
return next(new ApiError('Reset code not verified',400));
}

user.password = req.body.newPassword ;
user.passwordResetCode = undefined;
user.passwordResetExpires = undefined;
user.passwordResetVerified = undefined;

await user.save();

// 3- if everything is ok , generate token
const token = JWT.sign({userId: user._id},process.env.JWT_SECRET_KEY,{
  expiresIn: process.env.JWT_EXPIRE_TIME,
  });

  res.status(200).json({token});

});
