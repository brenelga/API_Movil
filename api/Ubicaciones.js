const express = require('express');
const router = express.Router();
const Ubicacion = require('../models/Ubicacion');
const authDispositivo = require('../controllers/authDispositivo');

router.post('/', authDispositivo, async(req, res) => {
    try {
        const {ubicacion} = req.body;

        const vehiculo = req.dispositivo.vehiculo;

        const nuevaUbicacion = new Ubicacion({
            vehiculo,
            dispositivo_id: req.dispositivo.dispositivo_id,
            ubicacion
        });

        await nuevaUbicacion.save();
        res.status(201).json({ mensaje: 'Ubicación registrada correctamente', data: nuevaUbicacion});
        
    } catch (error) {
        console.error('Error al registrar ubicación:', error);
        res.status(500).json({ error: 'Error al registrar ubicación' });
    }
});

router.get('/:vehiculoId/ultima', async(req, res) => {
    try {
        const { vehiculoId } = req.params;

        const ultimaUbicacion = await Ubicacion.findOne({ vehiculo: vehiculoId}).sort({fecha: -1})
        .select('fecha ubicacion dispositivo_id vehiculo')

        if(!ultimaUbicacion) {
            return res.status(404).json({message: 'No se encontró ubicación para este vehículo'});
        }

        res.json({
            vehiculo: ultimaUbicacion.vehiculo,
            dispositivo: ultimaUbicacion.dispositivo_id,
            fecha: ultimaUbicacion.fecha,
            latitud: ultimaUbicacion.latitud,
            longitud: ultimaUbicacion.longitud
        });

    } catch (error) {
        res.status(500).json({message: 'Error al obtener la ubicacion', error})
    }
});

router.get('/:vehiculoId/historial', async(req, res) => {
    try {
        const { vehiculoId } = req.params;

        const ubicaciones = await Ubicacion.find({vehiculo: vehiculoId})
        .sort({fecha: -1})
        .limit(50)
        
        res.json(ubicaciones)
    } catch (error) {
        res.status(500).json({message: 'Error al obtener historial de ubicaciones', error})     
    }
});

module.exports = router;