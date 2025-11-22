const Alerta = require('../models/Alerta');
const Usuario = require('../models/Usuario');

const AlertaController = {

    // 📌 1. Crear alerta desde sensor IoT
    crearAlertaIoT: async (req, res) => {
        try {
            const { tipo, contenido, vehiculo } = req.body;

            if (!tipo || !contenido || !vehiculo) {
                return res.status(400).json({ error: "Faltan datos de la alerta" });
            }

            // Buscar dueño del vehículo
            const usuario = await Usuario.findOne({ "vehiculos.placa": vehiculo });

            const alerta = new Alerta({
                tipo,
                contenido,
                vehiculo,
                usuario: usuario ? usuario._id : null
            });

            await alerta.save();

            // Aquí podrías activar notificaciones push
            // notifyUser(usuario._id, { tipo, contenido });

            res.status(201).json({
                ok: true,
                mensaje: "Alerta recibida y registrada",
                alerta
            });

        } catch (err) {
            console.error("Error en crear alerta IoT:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // 📌 2. Obtener alertas del usuario autenticado
    obtenerAlertasUsuario: async (req, res) => {
        try {
            const userId = req.user.id;

            const alertas = await Alerta.find({ usuario: userId })
                .sort({ fecha: -1 });

            res.status(200).json({
                ok: true,
                alertas
            });

        } catch (err) {
            console.error("Error en obtener alertas:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    // 📌 3. Obtener alertas por vehículo (usuario autenticado)
    obtenerAlertasPorVehiculo: async (req, res) => {
        try {
            const { placa } = req.params;
            const userId = req.user.id;

            const alertas = await Alerta.find({
                vehiculo: placa,
                usuario: userId
            }).sort({ fecha: -1 });

            res.status(200).json({ ok: true, alertas });

        } catch (err) {
            console.error("Error al filtrar alertas:", err);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

module.exports = AlertaController;
