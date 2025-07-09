const mongoose = require('mongoose');

const UsuarioSchema = new mongoose.Schema({
    nombre_usuario: {
        nombre: String,
        ap_pat: String,
        ap_mat: String,
        usuario: String
    },
    contrasena: {type: String, required: true},
    correo: [String],
    telefono: [String],
    datos_facturacion: {
        calle: String,
        num_ext: Number,
        num_int: Number,
        cp: String,
        colonia: String,
        estado: String,
        municipio: String,
        rfc: String,
        regimen: Number
    },
    datos_pago: [{
        tarjeta: String,
        vencimiento: Date
    }]
}, { collection: 'Usuario'});

module.exports = mongoose.model('Usuario', UsuarioSchema);