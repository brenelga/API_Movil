const express = require('express');
const router = express.Router();

const ARCOController = require('../controllers/ARCOController');
const authMiddleware = require('../middleware/authMiddleware');

// Registrar solicitud ARCO
router.post('/registrar', authMiddleware, ARCOController.registrarSolicitud);

// Obtener todas
router.get('/listar', authMiddleware, ARCOController.obtenerSolicitudes);

// Obtener por ID
router.get('/detalle/:id', authMiddleware, ARCOController.obtenerPorId);

module.exports = router;
