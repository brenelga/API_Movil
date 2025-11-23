const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const MotorController = require('../controllers/MotorController');

const MotorController = require('../controllers/MotorController');
const authMiddleware = require('../middleware/authMiddleware');

// Usuario presiona el botón de bloqueo
router.post('/bloqueo/:id', authMiddleware, MotorController.cambiarEstadoMotor);

// IoT consulta el estado
router.get('/estado-motor/:id', MotorController.obtenerEstadoMotor);

module.exports = router;
