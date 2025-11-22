const ARCO = require('../models/ARCO');
const arcoSchema = require('../validation/arcoValidation');

const ArcoController = {

    // Registrar nueva solicitud ARCO
    registrarSolicitud: async (req, res) => {
        try {
            // Validación con Joi
            const { error } = arcoSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error en los datos enviados",
                    error: error.details[0].message
                });
            }

            const nuevaSolicitud = new ARCO(req.body);
            await nuevaSolicitud.save();

            return res.status(201).json({
                ok: true,
                mensaje: "Solicitud ARCO registrada correctamente",
                data: nuevaSolicitud
            });

        } catch (err) {
            console.error("Error al registrar ARCO:", err);
            return res.status(500).json({
                ok: false,
                mensaje: "Error interno del servidor",
                error: err.message
            });
        }
    },

    // Obtener todas las solicitudes
    obtenerSolicitudes: async (req, res) => {
        try {
            const solicitudes = await ARCO.find().sort({ _id: -1 });

            return res.status(200).json({
                ok: true,
                data: solicitudes
            });

        } catch (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error al obtener solicitudes",
                error: err.message
            });
        }
    },

    // Obtener solicitud por ID
    obtenerPorId: async (req, res) => {
        try {
            const solicitud = await ARCO.findById(req.params.id);

            if (!solicitud) {
                return res.status(404).json({
                    ok: false,
                    mensaje: "Solicitud no encontrada"
                });
            }

            return res.status(200).json({
                ok: true,
                data: solicitud
            });

        } catch (err) {
            return res.status(500).json({
                ok: false,
                mensaje: "Error interno",
                error: err.message
            });
        }
    }

};

module.exports = ARCOController;
