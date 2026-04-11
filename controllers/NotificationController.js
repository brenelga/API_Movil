const Usuario = require('../models/Usuario');
const webpush = require('web-push');

// Configure VAPID keys from environment
// These should be in .env: VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:example@yourdomain.org',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY
    );
}

const NotificationController = {
    subscribe: async (req, res) => {
        try {
            const { subscription } = req.body;
            const userId = req.user.id;

            if (!subscription || !subscription.endpoint || !subscription.keys) {
                return res.status(400).json({ error: "Suscripción inválida" });
            }

            const usuario = await Usuario.findById(userId);
            if (!usuario) {
                return res.status(404).json({ error: "Usuario no encontrado" });
            }

            // Check if subscription already exists to avoid duplicates
            const exists = usuario.pushSubscriptions.some(sub => sub.endpoint === subscription.endpoint);
            if (!exists) {
                usuario.pushSubscriptions.push(subscription);
                await usuario.save();
            }

            res.status(201).json({ ok: true, mensaje: "Suscrito a notificaciones push" });
        } catch (error) {
            console.error("Error al suscribir:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    },

    unsubscribe: async (req, res) => {
        try {
            const { endpoint } = req.body;
            const userId = req.user.id;

            await Usuario.findByIdAndUpdate(userId, {
                $pull: { pushSubscriptions: { endpoint: endpoint } }
            });

            res.status(200).json({ ok: true, mensaje: "Desuscrito con éxito" });
        } catch (error) {
            console.error("Error al desuscribir:", error);
            res.status(500).json({ error: "Error interno del servidor" });
        }
    }
};

module.exports = NotificationController;
