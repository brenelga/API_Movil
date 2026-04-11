const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { actualizarFacturacion, obtenerDatosFacturacion, validarRegimenFiscal } = require('../controllers/FacturacionController');
const { getPrecioSuscripcion } = require('../controllers/UserController');

router.put('/facturacion', authMiddleware, actualizarFacturacion);
router.get('/facturacion', authMiddleware, obtenerDatosFacturacion);
router.post('/facturacion/validar-regimen', authMiddleware, validarRegimenFiscal);

router.get('/:id/precio-suscripcion', authMiddleware, getPrecioSuscripcion);

module.exports = router;
