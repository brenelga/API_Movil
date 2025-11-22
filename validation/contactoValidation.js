const Joi = require('joi');

const contactoSchema = Joi.object({
    nombre_contacto: Joi.object({
        nombre: Joi.string().min(2).max(100).required(),
        ap_pat: Joi.string().min(2).max(100).required(),
        ap_mat: Joi.string().min(2).max(100).allow('', null)
    }).required(),

    telefono: Joi.array().items(
        Joi.string().pattern(/^[0-9]{10}$/).messages({
            "string.pattern.base": "El teléfono debe contener 10 dígitos numéricos."
        })
    ).min(1).required(),

    correo: Joi.array().items(
        Joi.string().email().messages({
            "string.email": "El correo electrónico no tiene un formato válido."
        })
    ).min(1).required(),

    comentario: Joi.array().items(
        Joi.string().min(5).max(1000).required()
    ).min(1).required()
});

module.exports = contactoSchema;
