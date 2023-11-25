const express = require('express');

const {createReviewValidator,
       getReviewValidator,
       updateReviewValidator,
       deleteReviewValidator } =require('../utils/validators/reviewValidator');
       
       const {getReviews,
              getReview,
              createReview,
              updateReview,
              deleteReview,
              createFilterObject,
              setProductIdAndUserIdToBody}
              = require('../services/reviewServices');
              
// mergeParams Allows us to access the parameters on other routers 
// ex : we need to access the productId from product route 
const router = express.Router({ mergeParams : true });

const {protrct , allowedTo} = require('../services/authServices');

router.route('/')
.get(createFilterObject , getReviews)
.post(protrct , allowedTo('user') ,
      setProductIdAndUserIdToBody , 
      createReviewValidator ,
       createReview);

router.route('/:id')
.get( getReviewValidator, getReview )
.put (protrct , allowedTo('user') ,
      updateReviewValidator ,
      updateReview )
.delete(protrct , allowedTo('user','manager','admin') ,
       deleteReviewValidator,
       deleteReview );

module.exports = router;