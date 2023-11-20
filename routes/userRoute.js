const express = require('express');

const router= express.Router();

const { getUserValidator, 
    createUserValidator,
    updateUserValidator,
    deleteUserValidator,
    changeUserPasswordValidator,
    updateloggedUserValidator } =
     require('../utils/validators/userValidator');

const{getUser,
     getUserId,
     createUser,
     updateUser,
     deleteUser,
     resizeImage ,   
     uploadUserImage,
     changeUserPassword,
     getLoggedUserData,
     updateLoggedUserPassword,
     updateLoggedUserData,
     deleteLoggedUserData}
     = require('../services/userServices');

const {protrct , allowedTo} = require('../services/authServices');

router.put('/changePassword/:id' , changeUserPasswordValidator , changeUserPassword);

router.get('/getMe', protrct , getLoggedUserData , getUserId);
router.put('/changeMyPassword', protrct , updateLoggedUserPassword);
router.put('/updateMe', protrct , updateloggedUserValidator , updateLoggedUserData);
router.put('/deleteMe', protrct , deleteLoggedUserData);


router.use(protrct , allowedTo('admin','manager'));
router.route('/')
.get(getUser)
.post( uploadUserImage , resizeImage , createUserValidator , createUser);

router.route('/:id')
.get( getUserValidator , getUserId )
.put (uploadUserImage , resizeImage  , updateUserValidator , updateUser )
.delete( deleteUserValidator , deleteUser );


module.exports = router;

