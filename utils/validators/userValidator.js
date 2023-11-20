const { check , body } = require('express-validator');
const slugify = require('slugify');
const bcrypt = require('bcryptjs');

const validatorMiddleWare = require('../../middlewares/validatorMiddleWares')
const userModel = require('../../models/userModel');

exports.createUserValidator = [
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
check('profileImg').optional(),
check('role').optional(),
check('phone').optional().isMobilePhone(['ar-EG','ar-SA'])
.withMessage('invalid phone number only accept Egy and SA phone number'),
validatorMiddleWare
];

exports.getUserValidator = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleWare,
  ];


exports.updateUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  body('name').optional().custom((val, { req }) => {
    req.body.slug = slugify(val); //  req.body.slug = slugify(req.body.name)
    return true; //next()
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
check('profileImg').optional(),
check('role').optional(),
check('phone').optional().isMobilePhone(['ar-EG','ar-SA'])
.withMessage('invalid phone number only accept Egy and SA phone number'),
  validatorMiddleWare,
];

exports.changeUserPasswordValidator = [
check('id').isMongoId().withMessage('Invalid User id format'),
body('currentPassword')
.notEmpty()
.withMessage('you must enter your current password'),
body('passwordConfirm')
.notEmpty()
.withMessage('you must enter your password confirmation'),
body('password') // new password
.notEmpty()
.withMessage('you must enter your new password ')
.custom(async (val,{req}) =>{
// 1 - verify current password 
const user = await userModel.findById(req.params.id);
 if(!user){
  throw new Error('there is no user for this id');
 }
 const isCorrectPassword = await 
 bcrypt.compare(req.body.currentPassword , user.password);

 if(!isCorrectPassword){
  throw new Error('incorrect current password');
 }
// 2 - verify password confirmation
if(val !== req.body.passwordConfirm){
  throw new Error('Password confirmation incorrect');
}
return true;
}),
validatorMiddleWare,
];

exports.deleteUserValidator = [
  check('id').isMongoId().withMessage('Invalid User id format'),
  validatorMiddleWare,
];

exports.updateloggedUserValidator = [
body('name').optional().custom((val, { req }) => {
    req.body.slug = slugify(val); //  req.body.slug = slugify(req.body.name)
    return true; //next()
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
check('phone')
.optional().isMobilePhone(['ar-EG','ar-SA'])
.withMessage('invalid phone number only accept Egy and SA phone number'),
  validatorMiddleWare,
];