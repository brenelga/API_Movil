const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const PushController = require('../controllers/PushController');

router.post('/subscribe', authMiddleware, PushController.subscribe);
router.get('/public-key', authMiddleware, PushController.getVapidPublicKey);

module.exports = router;
