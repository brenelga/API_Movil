const Usuario = require('../models/Usuario');

const getPrecioSuscripcion = async (req, res) => {
    try {
        const userId = req.user ? req.user.id : req.params.id; // Support both JWT and URL param if needed, but best stick to params if no auth, or auth if authMiddleware is used.

        // Assuming params id is used because the request was "Crea una API que obtenga precio_suscripcion de la colección Usuario"
        const id = req.params.id;

        const usuario = await Usuario.findById(id).select('precio_suscripcion');

        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.status(200).json({
            mensaje: "Precio de suscripción obtenido",
            precio_suscripcion: usuario.precio_suscripcion
        });

    } catch (error) {
        console.error("Error obteniendo precio de suscripción:", error);
        res.status(500).json({ error: "Error al obtener el precio de suscripción" });
    }
};

module.exports = {
    getPrecioSuscripcion
};
