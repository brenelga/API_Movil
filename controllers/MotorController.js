// controllers/MotorController.js
const Vehiculo = require('../models/Vehiculo');

exports.cambiarEstadoMotor = async (req, res) => {
    try {
        const vehiculoId = req.params.id;

        // Buscar vehículo
        const vehiculo = await Vehiculo.findById(vehiculoId);
        if (!vehiculo) {
            return res.status(404).json({ message: 'Vehículo no encontrado' });
        }

        // Alternar estado
        vehiculo.estado_motor = !vehiculo.estado_motor;

        await vehiculo.save();

        return res.json({
            message: "Estado del motor actualizado",
            estado_motor: vehiculo.estado_motor
        });

    } catch (error) {
        console.error("Error al cambiar estado del motor:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};

exports.obtenerEstadoMotor = async (req, res) => {
    try {
        const vehiculoId = req.params.id;

        const vehiculo = await Vehiculo.findById(vehiculoId);
        if (!vehiculo) {
            return res.status(404).json({ message: "Vehículo no encontrado" });
        }

        return res.json({
            estado_motor: vehiculo.estado_motor
        });

    } catch (error) {
        console.error("Error al obtener estado del motor:", error);
        return res.status(500).json({ message: "Error interno del servidor" });
    }
};