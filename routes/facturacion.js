const express = require('express');
const router = express.Router();

const FacturacionController = require('../controllers/FacturacionController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/registrar', authMiddleware, FacturacionController.actualizarFacturacion);
router.get('/obtener', authMiddleware, FacturacionController.obtenerDatosFacturacion);
console.log("authMiddleware:", authMiddleware);

module.exports = router;
