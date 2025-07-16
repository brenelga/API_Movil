const mongoose = require('mongoose');
const {Schema, Types} = mongoose;

const VehiculoSchema = new Schema({
    marca: {type: String, required: true},
    modelo: {type: String, required: true},
    placas: {type: String, required: true},
    propietario: [{ type: Types.ObjectId, ref: 'Usuario', required: true }],
    VIN: {type: String, required: true},
    estado_motor: Boolean
}, { collection: 'Vehiculo'});

module.exports = mongoose.model('Vehiculo', VehiculoSchema);