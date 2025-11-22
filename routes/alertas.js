const express = require('express');
const router = express.Router();

const AlertaController = require('../controllers/AlertaController');
const auth = require('../middleware/authMiddleware');
const iotAuth = require('../middleware/iotAuth');

// 🔹 IoT → Servidor
router.post('/iot/crear', iotAuth, AlertaController.crearAlertaIoT);

// 🔹 Usuario → Consultar sus alertas
router.get('/', auth, AlertaController.obtenerAlertasUsuario);

// 🔹 Usuario → Consultar alertas por vehículo
router.get('/:placa', auth, AlertaController.obtenerAlertasPorVehiculo);

module.exports = router;
