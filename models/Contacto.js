const mongoose = require('mongoose');

const ContactoSchema = new mongoose.Schema({
    nombre_contacto: {
        nombre: String,
        ap_pat: String,
        ap_mat: String
    },
    telefono: [String],
    correo: [String],
    comentario: [String]
});

module.exports = mongoose.model('Contacto', ContactoSchema);