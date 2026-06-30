const router = require('express').Router();
const { createOrder, getOrders, getOrder } = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
router.post('/', auth, createOrder);
router.get('/', auth, getOrders);
router.get('/:id', auth, getOrder);
module.exports = router;
