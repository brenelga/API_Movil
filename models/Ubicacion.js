const mongoose = require('mongoose');

const UbicacionSchema = new mongoose.Schema({
    fecha: Date,
    vehiculo: String,
    ubicacion: {
        latitud: String,
        longitud: String
    }
}, {collection: 'Vehiculo'});

module.exports = mongoose.model('Ubicacion', UbicacionSchema);