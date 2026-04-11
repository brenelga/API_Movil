const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/NotificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/subscribe', authMiddleware, NotificationController.subscribe);
router.post('/unsubscribe', authMiddleware, NotificationController.unsubscribe);

module.exports = router;
