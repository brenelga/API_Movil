const mongoose = require('mongoose');

const AlertaSchema = new mongoose.Schema({
    tipo: [String],
    fecha: Date,
    contenido: [String],
    vehiculo: String
});

module.exports = mongoose.model('Alerta', AlertaSchema);
