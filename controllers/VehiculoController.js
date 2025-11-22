const Vehiculo = require('../models/Vehiculo');
const Usuario = require('../models/Usuario');


exports.agregarVehiculo = async (req, res) => {
    try {
        const { marca, modelo, placas, VIN, estado_motor } = req.body;
        const userId = req.user.id; // obtenido del token JWT

        const usuario = await Usuario.findById(userId);

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Validación: evitar exceder el límite declarado
        if (usuario.vehiculos_registrados >= usuario.numero_vehiculos) {
            return res.status(400).json({
                error: `Ya registraste los ${usuario.numero_vehiculos} vehículos declarados.`
            });
        }

        const nuevoVehiculo = new Vehiculo({
            marca,
            modelo,
            placas,
            VIN,
            estado_motor: estado_motor ?? true,
            propietario: [userId]
        });

        await nuevoVehiculo.save();

        usuario.vehiculos_registrados += 1;
        await usuario.save();

        res.status(201).json({
            mensaje: 'Vehículo registrado correctamente',
            vehiculo: nuevoVehiculo
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al registrar vehículo' });
    }
};
