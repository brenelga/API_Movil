const express = require('express');
const router = express.Router();

const ContactoController = require('../controllers/ContactoController');

// Registrar solicitud de contacto (público)
router.post('/enviar', ContactoController.registrarContacto);

module.exports = router;
