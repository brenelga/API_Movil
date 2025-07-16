const Usuario = require('../models/Usuario');
const Vehiculo = require('../models/Vehiculo')
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    try {
        const {
            nombre_usuario, // { nombre, ap_pat, ap_mat }
            usuario,        // string
            contrasena,     // string
            correo,
            telefono,
            vehiculo        // { marca, modelo, placas, estado_motor? }
        } = req.body;

        // Cifrado Vigenère
        const response = await axios.post('https://api-python-7bsm.onrender.com/vigenere/cifrar', {
            texto: contrasena,
            clave: usuario
        });

        const cifradoVignere = response.data.resultado;
        const hashFinal = await bcrypt.hash(cifradoVignere, 10);

        // Crear usuario con nuevo esquema
        const nuevoUsuario = new Usuario({
            nombre_usuario: {
                nombre: nombre_usuario.nombre,
                ap_pat: nombre_usuario.ap_pat,
                ap_mat: nombre_usuario.ap_mat
            },
            credenciales: {
                usuario: usuario,
                contrasena: hashFinal,
                tipo: 'Usuario' // default
            },
            correo,
            telefono
        });

        const usuarioGuardado = await nuevoUsuario.save();

        // Crear vehículo relacionado
        const nuevoVehiculo = new Vehiculo({
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            placas: vehiculo.placas,
            estado_motor: vehiculo.estado_motor ?? true,
            propietario: [usuarioGuardado._id]
        });

        await nuevoVehiculo.save();

        res.status(201).json({ mensaje: 'Usuario y Vehículo registrados correctamente' });
    } catch (error) {
        console.error('Error en el registro', error);
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
