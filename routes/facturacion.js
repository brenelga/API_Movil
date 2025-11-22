const express = require('express');
const router = express.Router();

const FacturacionController = require('../controllers/FacturacionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registrar', authMiddleware, FacturacionController.actualizarFacturacion);

module.exports = router;
