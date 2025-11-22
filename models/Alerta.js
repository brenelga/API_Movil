const mongoose = require('mongoose');

const AlertaSchema = new mongoose.Schema({
    tipo: {
        type: String,
        required: true
    },
    fecha: {
        type: Date,
        default: Date.now
    },
    contenido: {
        type: String,
        required: true
    },
    vehiculo: {
        type: String,
        required: true
    },
    usuario: {       // IMPORTANTE para notificar al usuario dueño del vehículo
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario"
    }
}, { collection: "Alertas" });

module.exports = mongoose.model('Alerta', AlertaSchema);
