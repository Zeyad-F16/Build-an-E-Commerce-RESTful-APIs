
const express = require('express');



const { getCategoryValidator, 
     createCategoryValidator,
     updateCategoryValidator,
     deleteCategoryValidator } =
     require('../utils/validators/categoryValidator');

     const {getCategory,
          getCategoryId,
          createCategory,
          updateCategory,
          deleteCategory,
          uploadCategoryImage,
           resizeImage} = require('../services/categoryServices');
          
     
const {protrct , allowedTo} = require('../services/authServices');

     const router= express.Router();
     
const subCategoryRoute = require('./subCategoryRoute');

// Nested route
router.use('/:categoryId/subCategory', subCategoryRoute);

router.route('/')
.get(getCategory)

.post(protrct ,
      allowedTo('admin','manager') ,
      uploadCategoryImage ,
      resizeImage ,
      createCategoryValidator ,
      createCategory);

router.route('/:id')
.get(getCategoryValidator ,
     getCategoryId
     )

.put(protrct ,
     allowedTo('admin','manager') ,
     uploadCategoryImage ,
      resizeImage ,
      updateCategoryValidator ,
      updateCategory
      )

.delete(protrct ,
     allowedTo('admin') ,
     deleteCategoryValidator ,
     deleteCategory
        );

module.exports = router;


