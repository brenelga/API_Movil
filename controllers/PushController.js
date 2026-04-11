const webpush = require('web-push');
const Usuario = require('../models/Usuario');

exports.subscribe = async (req, res) => {
    try {
        const subscription = req.body;
        const userId = req.user.id; // from authMiddleware

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ error: 'Suscripción inválida' });
        }

        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.push_subscription = subscription;
        await usuario.save();

        res.status(200).json({ message: 'Suscripción Web Push guardada correctamente' });
    } catch (error) {
        console.error('Error al guardar suscripción push:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

exports.getVapidPublicKey = (req, res) => {
    res.status(200).json({ publicKey: process.env.VAPID_PUBLIC_KEY });
};
