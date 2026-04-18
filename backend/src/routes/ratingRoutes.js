const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, ratingController.submitRating);
router.put('/', verifyToken, ratingController.updateRating);
router.get('/store/:storeId', verifyToken, ratingController.getStoreRatings);

module.exports = router;