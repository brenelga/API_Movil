// routes/facturacion.js
const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const axios = require('axios');

// Middleware de autenticación (JWT, token, etc.)
const auth = require('../middleware/auth');

router.post('/', auth, async (req, res) => {
    try {
        const {
            calle,
            num_ext,
            num_int,
            cp,
            colonia,
            estado,
            municipio,
            rfc,
            regimen
        } = req.body;

        // Validación rápida
        if (!calle || !num_ext || !cp || !colonia || !estado || !municipio || !rfc || !regimen) {
            return res.status(400).json({ message: "Faltan datos obligatorios" });
        }

        // 🔍 VALIDAR RÉGIMEN CONTRA EL SAT (tu servicio en Python)
        const validacion = await axios.post(process.env.SAT_VALIDACION_URL, {
            rfc,
            regimen
        });

        if (!validacion.data.valido) {
            return res.status(422).json({
                ok: false,
                message: "El régimen fiscal no es válido para este RFC",
                detalle: validacion.data
            });
        }

        // ✔ Guardar en el usuario autenticado
        const usuario = await Usuario.findById(req.user.id);

        usuario.datos_facturacion = {
            calle,
            num_ext,
            num_int,
            cp,
            colonia,
            estado,
            municipio,
            rfc,
            regimen
        };

        await usuario.save();

        return res.json({
            ok: true,
            message: "Datos de facturación guardados",
            data: usuario.datos_facturacion
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error en el servidor" });
    }
});

module.exports = router;
