const router = require('express').Router();
const { createPaymentIntent, webhook } = require('../controllers/paymentController');
const { auth } = require('../middleware/auth');
router.post('/create-intent', auth, createPaymentIntent);
router.post('/webhook', webhook);
module.exports = router;
