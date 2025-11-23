const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const VehiculoController = require('../controllers/VehiculoController');

router.patch('/bloquear', auth, VehiculoController.bloquearMotor);
router.patch('/desbloquear', auth, VehiculoController.desbloquearMotor);

module.exports = router;
