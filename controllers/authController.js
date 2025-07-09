const Usuario = require('../models/Usuario');
const Vehiculo = require('../models/Vehiculo')
const axios = require('axios');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async(req, res) => {
    try{
        const {
            nombre_usuario,
            usuario,
            contrasena,
            correo,
            telefono,
            vehiculo
        } = req.body;
        
        const response = await axios.post('http://localhost:8000/vigenere/cifrar', {
            texto: contrasena,
            clave: usuario
        });


        const cifradoVignere = response.data.resultado;

        const hashFinal = await bcrypt.hash(cifradoVignere, 10);

        const nuevoUsuario = new Usuario({
            nombre_usuario: {
                ...nombre_usuario,
                usuario: usuario
            },
            contrasena: hashFinal,
            correo,
            telefono
        });

        const usuarioGuardado = await nuevoUsuario.save();

        const nuevoVehiculo = new Vehiculo({
            marca: vehiculo.marca,
            modelo: vehiculo.modelo,
            placas: vehiculo.placas,
            estado_motor: vehiculo.estado_motor ?? true,
            propietario: [usuarioGuardado._id]
        });

        await nuevoVehiculo.save();

        res.status(201).json({mensaje: 'Usuario y Vehiculo registrados de manera correcta'});
    } catch (error) {
        console.error('Error en el registro', error);
        res.status(500).json({error: 'Error al realizar el registro'});
    }
};

exports.login = async (req, res) => {
    try {
        const {usuario, contrasena} = req.body;

        const user = await Usuario.findOne({'nombre_usuario.usuario': usuario});
        if(!user) {
            return res.status(404).json({error: 'Usuario no encontrado'});
        }

        const response = await axios.post('http://localhost:8000/vigenere/cifrar', {
            texto: contrasena,
            clave: usuario
        });

        const cifradoVignere = response.data.resultado;

        const match = await bcrypt.compare(cifradoVignere, user.contrasena);

        if(!match) {
            return res.status(401).json({error: 'Contraseña Incorrecta'});
        }

        const token = jwt.sign(
            {id: user._id, usuario: user.nombre_usuario.usuario},
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        );

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token,
            usuario: user.nombre_usuario.usuario
        });
    } catch (error) {
        console.error('Error en login:', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};