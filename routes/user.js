const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');
const { actualizarFacturacion } = require('../controllers/FacturacionController');

router.put('/facturacion', authMiddleware, actualizarFacturacion);
router.get('/facturacion', authMiddleware, obtenerDatosFacturacion);
router.post('/facturacion/validar-regimen', authMiddleware, validarRegimenFiscal);

module.exports = router;
