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

exports.bloquearMotor = async (req, res) => {
    try {
        const userId = req.user.id;

        const vehiculo = await Vehiculo.findOne({ propietario: userId });

        if (!vehiculo) {
            return res.status(404).json({ error: "Vehículo no encontrado" });
        }

        // Actualizar en BD
        vehiculo.estado_motor = false;
        await vehiculo.save();

        // Enviar instrucción IoT
        mqtt.publish(`vehiculo/${vehiculo._id}/motor`, "bloquear");

        return res.json({
            mensaje: "Motor bloqueado exitosamente",
            estado_motor: vehiculo.estado_motor
        });

    } catch (error) {
        console.error("Error bloqueando motor:", error);
        return res.status(500).json({ error: "Error interno bloqueando el motor" });
    }
};


exports.desbloquearMotor = async (req, res) => {
    try {
        const userId = req.user.id;

        const vehiculo = await Vehiculo.findOne({ propietario: userId });

        if (!vehiculo) {
            return res.status(404).json({ error: "Vehículo no encontrado" });
        }

        // Actualizar BD
        vehiculo.estado_motor = true;
        await vehiculo.save();

        // Enviar comando al IoT
        mqtt.publish(`vehiculo/${vehiculo._id}/motor`, "desbloquear");

        return res.json({
            mensaje: "Motor desbloqueado exitosamente",
            estado_motor: vehiculo.estado_motor
        });

    } catch (error) {
        console.error("Error desbloqueando motor:", error);
        return res.status(500).json({ error: "Error interno desbloqueando el motor" });
    }
};
