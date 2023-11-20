const express = require('express');

const {protrct , allowedTo} = require('../services/authServices');

const {getLoggedUseraddress , removeAddress , addAddress} = require('../services/addressServices');

const router = express.Router();

router.use( protrct , allowedTo('user'))

router
.route('/')
.get( getLoggedUseraddress )
.post( addAddress);

router.delete('/:addressId' , removeAddress );


module.exports = router;