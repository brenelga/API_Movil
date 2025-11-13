const Dispositivo = require('../models/Dispositivo');

async function authDispositivo(req, res, next) {
    try {
        const { dispositivo_id, api_key } = req.headers;

        if(!dispositivo_id || !api_key) {
            return res.status(400).json({ error: 'Dispositivo ID y API Key son requeridos' });
        }

        const dispositivo = await Dispositivo.findOne({ dispositivo_id, api_key, activo: true });

        if (!dispositivo) {
            return res.status(401).json({ error: 'Dispositivo no autorizado o inactivo' });
        }

        req.dispositivo = dispositivo;
        next();
    } catch (error) {
        res.status(500).json({ error: 'Error al autenticar el dispositivo' });
    }
}

module.exports = authDispositivo;