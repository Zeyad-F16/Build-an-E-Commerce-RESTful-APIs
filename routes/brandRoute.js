const express = require('express');

const router= express.Router();

const { getBrandValidator, 
    createBrandValidator,
    updateBrandValidator,
    deleteBrandValidator } =
     require('../utils/validators/brandValidator');

const {getBrand,
     getBrandId,
     createBrand,
     updateBrand,
     deleteBrand,
     resizeImage ,   
     uploadBrandImage}
     = require('../services/brandServices');

const {protrct , allowedTo} = require('../services/authServices');

router.route('/')
.get(getBrand)

.post(protrct ,
     allowedTo('admin','manager') ,
     uploadBrandImage ,
     resizeImage ,
     createBrandValidator , 
     createBrand);

router.route('/:id')
.get( getBrandValidator , getBrandId )

.put (protrct ,
     allowedTo('admin','manager') ,
     uploadBrandImage ,
     resizeImage ,
     updateBrandValidator ,
     updateBrand )

.delete(protrct ,
     allowedTo('admin') , 
     deleteBrandValidator ,
     deleteBrand );

module.exports = router;

