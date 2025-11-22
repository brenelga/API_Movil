const Usuario = require('../models/Usuario');
const catalogoRegimenFiscal = require("../utils/CatalogoRegimenFiscal");

const actualizarFacturacion = async (req, res) => {
    try {
        const userId = req.user.id; // viene del JWT
        const datos = req.body;     // toda la info enviada desde la app móvil

        const usuario = await Usuario.findById(userId);
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        usuario.datos_facturacion = {
            calle: datos.calle,
            num_ext: datos.num_ext,
            num_int: datos.num_int,
            cp: datos.cp,
            colonia: datos.colonia,
            estado: datos.estado,
            municipio: datos.municipio,
            rfc: datos.rfc,
            regimen: datos.regimen
        };

        await usuario.save();

        res.status(200).json({
            mensaje: "Datos de facturación actualizados correctamente",
            datos_facturacion: usuario.datos_facturacion
        });

    } catch (error) {
        console.error("Error actualizando facturación:", error);
        res.status(500).json({ error: "Error actualizando datos de facturación" });
    }
};

const obtenerDatosFacturacion = async (req, res) => {
    try {
        const userId = req.user.id;

        const usuario = await Usuario.findById(userId).select("datos_facturacion");
        if (!usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.status(200).json({
            mensaje: "Datos de facturación obtenidos",
            datos_facturacion: usuario.datos_facturacion
        });

    } catch (error) {
        console.error("Error obteniendo datos de facturación:", error);
        res.status(500).json({ error: "Error al obtener los datos de facturación" });
    }
};

const validarRegimenFiscal = (req, res) => {
    try {
        const { regimen } = req.body;

        if (!regimen) {
            return res.status(400).json({ error: "Debe enviar el campo 'regimen'" });
        }

        const encontrado = catalogoRegimenFiscal.find(r => r.clave === Number(regimen));

        if (!encontrado) {
            return res.status(404).json({ 
                valido: false, 
                mensaje: "Régimen fiscal no válido según el SAT" 
            });
        }

        res.status(200).json({
            valido: true,
            mensaje: "Régimen fiscal válido",
            descripcion: encontrado.descripcion
        });

    } catch (error) {
        console.error("Error validando régimen fiscal:", error);
        res.status(500).json({ error: "Error interno en la validación" });
    }
};

module.exports = {
    actualizarFacturacion,
    obtenerDatosFacturacion,
    validarRegimenFiscal
}