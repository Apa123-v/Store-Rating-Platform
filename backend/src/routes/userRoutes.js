const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');

router.get('/stats', verifyToken, isAdmin, userController.getStats);
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.post('/', verifyToken, isAdmin, userController.createUser);
router.get('/:id', verifyToken, isAdmin, userController.getUserById);
router.put('/update-password', verifyToken, userController.updatePassword);

module.exports = router;