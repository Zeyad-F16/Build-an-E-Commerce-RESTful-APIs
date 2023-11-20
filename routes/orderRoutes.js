const express = require('express');
 
const {protrct , allowedTo} = require('../services/authServices');

const {createCashOrder ,
     filterOrderForLoggedUser ,
     findAllOrders ,
     findSpecificOrder,
     updateOrderToPaid,
     updateOrderToDelivered,
     checkoutSession
    } = require('../services/orderService');

const router = express.Router();

router.use( protrct )

router
.route('/')
.get(allowedTo('user','admin','manager'), filterOrderForLoggedUser , findAllOrders);

router.get('/:id' , allowedTo('user','admin','manager') ,  filterOrderForLoggedUser , findSpecificOrder);
router.get('/checkout-session/:cartId' , allowedTo('user') , checkoutSession);

router
.route('/:cartId')
.post(allowedTo('user') , createCashOrder)
.post(allowedTo('user') , createCashOrder);

router.put('/:id/pay',allowedTo('admin','manager') , updateOrderToPaid);
router.put('/:id/deliver',allowedTo('admin','manager') , updateOrderToDelivered);

module.exports = router;