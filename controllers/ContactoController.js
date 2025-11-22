const Contacto = require('../models/Contacto');
const contactoSchema = require('../validation/contactoValidation');

const ContactoController = {

    registrarContacto: async (req, res) => {
        try {
            // Validación con Joi
            const { error } = contactoSchema.validate(req.body);
            if (error) {
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error en los datos enviados",
                    error: error.details[0].message
                });
            }

            const nuevoContacto = new Contacto(req.body);
            await nuevoContacto.save();

            return res.status(201).json({
                ok: true,
                mensaje: "Solicitud enviada correctamente. Nos pondremos en contacto contigo.",
                data: nuevoContacto
            });

        } catch (err) {
            console.error("Error en Contacto:", err);
            return res.status(500).json({
                ok: false,
                mensaje: "Error interno del servidor",
                error: err.message
            });
        }
    }

};

module.exports = ContactoController;
