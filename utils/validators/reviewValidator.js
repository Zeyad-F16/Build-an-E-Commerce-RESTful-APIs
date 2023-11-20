const { check  } = require('express-validator');
const  reviewModel = require('../../models/reviewModel');
const validatorMiddleWare = require('../../middlewares/validatorMiddleWares');

exports.createReviewValidator = [
check('title').optional(),
check('ratings')
.notEmpty()
.withMessage('rating is required')
.isFloat({min:1 , max:5 })
.withMessage('rating must be between 1 and 5'),
check('user').isMongoId().withMessage('Invalid user id'),
check('product')
.isMongoId().withMessage('Invalid product id')
.custom(( val, {req}) => 
// check if logged user create a review before 
  reviewModel.findOne({user: req.user._id , product: req.body.product})
  .then(
    (review)=>{
      if(review){
 return Promise.reject(new Error('you already created a review before'));
    }
  }
  )
),
validatorMiddleWare
];

exports.updateReviewValidator = [
  check('id').isMongoId().withMessage('Invalid Review id format')
  .custom(( val, {req} ) =>
  reviewModel.findById(val).then((review)=>{
    if(!review){
return Promise.reject(new Error(`there is no review for this id ${val}`));
    }
    if(review.user._id.toString() !== req.user._id.toString()){
return Promise.reject(new Error(`you are not allowed to perform this action`));
    }
  }
  )),
  validatorMiddleWare,
];

exports.getReviewValidator = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validatorMiddleWare,
  ];



exports.deleteReviewValidator = [
  check('id')
  .isMongoId()
  .withMessage('Invalid Review id format')
  .custom(( val, {req} ) => {
    if(req.user.role === 'user'){
  return reviewModel.findById(val).then((review)=>{
    if(!review){
return Promise.reject(
  new Error(`there is no review for this id ${val}`));
    }
    if(review.user._id.toString() !== req.user._id.toString()){
return Promise.reject(new Error(`you are not allowed to perform this action`));
    }
  }
  )}
  return true;
}),
  validatorMiddleWare,
];
