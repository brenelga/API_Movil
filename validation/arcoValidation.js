const Joi = require('joi');

const arcoSchema = Joi.object({
    solicitante: Joi.object({
        nombre: Joi.string().min(2).max(100).required(),
        ap_pat: Joi.string().min(2).max(100).required(),
        ap_mat: Joi.string().min(2).max(100).allow('', null)
    }).required(),

    medios_contacto: Joi.object({
        telefono: Joi.array().items(
            Joi.string().pattern(/^[0-9]{10}$/).messages({
                "string.pattern.base": "El teléfono debe contener 10 dígitos numéricos."
            })
        ).min(1).required(),

        correo: Joi.array().items(
            Joi.string().email().messages({
                "string.email": "El correo no tiene un formato válido."
            })
        ).min(1).required(),
    }).required(),

    tipo_solicitud: Joi.array().items(Joi.string()).min(1).required(),

    complemento: Joi.array().items(Joi.string().allow('', null))
});
    
module.exports = arcoSchema;
