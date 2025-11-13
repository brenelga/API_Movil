const mongoose = require('mongoose');

const DispositivoSchema = new mongoose.Schema({
    dispositivo_id: {
        type: String,
        required: true,
        unique: true
    },
    api_key:{
        type: String,
        required: true,
    },
    vehiculo:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehiculo',
        required: true
    },
    activo: {
        type: Boolean,
        default: true
    }
}, { collection: 'Dispositivo' });

module.exports = mongoose.model('Dispositivo', DispositivoSchema);