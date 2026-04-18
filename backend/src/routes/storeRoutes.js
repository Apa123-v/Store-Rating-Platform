const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

router.get('/', verifyToken, storeController.getAllStores);
router.post('/', verifyToken, isAdmin, storeController.createStore);

module.exports = router;