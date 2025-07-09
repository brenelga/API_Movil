const mongoose = require('mongoose');

const ARCOSchema = new mongoose.Schema({
    solicitante: {
        nombre: String,
        ap_pat: String,
        ap_mat: String
    },
    medios_contacto: {
        telefono: [String],
        correo: [String]
    },
    tipo_solicitud: [String],
    complemento: [String]
}, {collection: 'ARCO'});

module.exports = mongoose.model('ARCO', ARCOSchema);