const express = require('express');
const router = express.Router();

const authMiddleware = require('../middleware/authMiddleware');
const MotorController = require('../controllers/MotorController');
const VehiculoController = require('../controllers/VehiculoController'); // <-- Agrega esta importación

// Obtener la lista de vehículos del usuario autenticado
router.get('/user-list', authMiddleware, VehiculoController.obtenerVehiculosUsuario);

// Usuario presiona el botón de bloqueo
router.post('/bloqueo/:id', authMiddleware, MotorController.cambiarEstadoMotor);

// IoT consulta el estado
router.get('/estado-motor/:id', MotorController.obtenerEstadoMotor);

module.exports = router;
