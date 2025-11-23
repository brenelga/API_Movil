const Usuario = require('../models/Usuario');
const Vehiculo = require('../models/Vehiculo')
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    try {
        const {
            nombre_usuario, 
            usuario,        
            contrasena,     
            correo,
            telefono,
            numero_vehiculos,
            entidad,
            municipio
        } = req.body;

        // -----------------------------------------
        // 1. Consultar el modelo ML en Python
        // -----------------------------------------
        const riesgoResponse = await axios.post(
            "https://modelo-production-c5b5.up.railway.app/predict-by-location", 
            {
                Entidad: entidad,
                Municipio: municipio,
                Vehiculos: numero_vehiculos ?? 1
            }
        );

        const datosRiesgo = riesgoResponse.data;

        if (datosRiesgo.error) {
            return res.status(400).json({
                error: "Entidad/Municipio inválido",
                detalle: datosRiesgo
            });
        }

        const precioSuscripcion = datosRiesgo.Total;

        // --------------------------------------------------
        // 2. Cifrado Vigenère -> Bcrypt
        // --------------------------------------------------
        const response = await axios.post(
            'https://api-python-7bsm.onrender.com/vigenere/cifrar',
            { texto: contrasena, clave: usuario }
        );

        const cifradoVignere = response.data.resultado;
        const hashFinal = await bcrypt.hash(cifradoVignere, 10);

        // --------------------------------------------------
        // 3. Guardar usuario
        // --------------------------------------------------
        const nuevoUsuario = new Usuario({
            nombre_usuario: {
                nombre: nombre_usuario.nombre,
                ap_pat: nombre_usuario.ap_pat,
                ap_mat: nombre_usuario.ap_mat
            },
            credenciales: {
                usuario: usuario,
                contrasena: hashFinal,
                tipo: 'Usuario'
            },
            correo,
            telefono,
            entidad,
            municipio,
            numero_vehiculos: numero_vehiculos ?? 1,
            vehiculos_registrados: 0,
            precio_suscripcion: precioSuscripcion   // <<---- NUEVO
        });

        await nuevoUsuario.save();

        res.status(201).json({ 
            mensaje: 'Usuario registrado correctamente.',
            precio_suscripcion: precioSuscripcion,
            riesgo: datosRiesgo.Riesgo
        });

    } catch (error) {
        console.error('Error en el registro', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al realizar el registro' });
    }
};





exports.login = async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;

        // Buscar por credenciales
        const user = await Usuario.findOne({ 'credenciales.usuario': usuario });
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const response = await axios.post('https://api-python-7bsm.onrender.com/vigenere/cifrar', {
            texto: contrasena,
            clave: usuario
        });

        const cifradoVignere = response.data.resultado;

        const match = await bcrypt.compare(cifradoVignere, user.credenciales.contrasena);
        if (!match) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: user._id, usuario: user.credenciales.usuario },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: user.credenciales.usuario
        });
    } catch (error) {
        console.error('Error en login:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
