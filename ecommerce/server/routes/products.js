const router = require('express').Router();
const { getProducts, getFeatured, getProduct, getCategories, addReview } = require('../controllers/productController');
const { auth } = require('../middleware/auth');
router.get('/', getProducts);
router.get('/featured', getFeatured);
router.get('/categories', getCategories);
router.get('/:id', getProduct);
router.post('/:id/review', auth, addReview);
module.exports = router;
