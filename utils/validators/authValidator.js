const { check } = require('express-validator');
const slugify = require('slugify');
const validatorMiddleWare = require('../../middlewares/validatorMiddleWares')
const userModel = require('../../models/userModel');

exports.signupValidator = [
check('name')
.notEmpty()
.withMessage('User required')
.isLength({ min:3 })
.withMessage('Too short User name')
.custom((val, { req }) => {
  req.body.slug = slugify(val);
  return true;
}),
check('email')
.notEmpty()
.withMessage('email required')
.isEmail()
.withMessage('invalid email address')
.custom((val)=>
userModel.findOne({ email:val }).then((user) => {
  if(user){
  return Promise.reject(new Error('Email already in use'));
  }
})
),
check('password')
.notEmpty()
.withMessage('Password required')
.isLength({ min:6})
.withMessage('Password must be at least 6 characters')
.custom((password,{req})=>{
  if(password !== req.body.passwordConfirm){
    throw new Error('Password confirmation incorrect');
  }
  return true;
}),
check('passwordConfirm')
.notEmpty()
.withMessage('password confirmation required'), 
validatorMiddleWare
];


exports.loginValidator = [
  check('email')
  .notEmpty()
  .withMessage('email required')
  .isEmail()
  .withMessage('invalid email address'),
  check('password')
  .notEmpty()
  .withMessage('Password required')
  .isLength({ min:6})
  .withMessage('Password must be at least 6 characters'),
  validatorMiddleWare
  ];