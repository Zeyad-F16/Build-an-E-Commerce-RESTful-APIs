const express = require('express');

// mergeParams Allows us to access the parameters on other routers 
// ex : we need to access the categoryId from Category route 
const router = express.Router({ mergeParams : true });

const { createSubCategory,
        getSubCategory,
        getSubCategoryId,
        updateSubCategory,
        deleteSubCategory,
        getCategoryIdToBody,
        createFilterObject,
    }
 =require('../services/subCategoryServices');

const {
    createSubCategoryValidator,
    getSubCategoryIdValidator,
    updateSubCategoryValidator,
    deleteSubCategoryValidator
} 
=require('../utils/validators/subCategoryValidator');

const {protrct , allowedTo} = require('../services/authServices');

router.route('/')
.post(protrct ,
    allowedTo('admin','manager') ,
    getCategoryIdToBody , 
    createSubCategoryValidator , 
    createSubCategory )

.get(createFilterObject ,
     getSubCategory)

router.route('/:id')
.get(getSubCategoryIdValidator ,
     getSubCategoryId)

.put(protrct ,
    allowedTo('admin','manager') ,
    updateSubCategoryValidator  , 
    updateSubCategory)

.delete(protrct ,
        allowedTo('admin') ,
        deleteSubCategoryValidator ,
        deleteSubCategory);

module.exports = router;