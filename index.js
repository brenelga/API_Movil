const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const webpush = require('web-push');

dotenv.config();

webpush.setVapidDetails(
    'mailto:tu_correo_soporte@ivss.com',
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
const ubicacionesRutas = require('./api/Ubicaciones');
const authMiddleware = require('./middleware/authMiddleware');
const VehiculoController = require('./controllers/VehiculoController');
const facturacionRutas = require('./routes/facturacion');
const arcoRutas = require('./routes/arco');
const contactoRutas = require('./routes/contacto');
const alertasRutas = require('./routes/alertas');
const vehiculoRutas = require('./routes/vehiculo');
const pushRutas = require('./routes/push');

app.use('/api/auth', authRoutes);
app.use('/api/ubicaciones', ubicacionesRutas);
app.post('/api/vehiculos/agregar', authMiddleware, VehiculoController.agregarVehiculo);
app.use('/api/facturacion', facturacionRutas);
app.use('/api/arco', arcoRutas);
app.use('/api/contacto', contactoRutas);
app.use('/api/alertas', alertasRutas);
app.use('/api/vehiculo', vehiculoRutas);
app.use('/api/usuarios', require('./routes/user'));
app.use('/api/push', pushRutas);

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Conectado a MongoDB');

        // Usa la constante PORT
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch(err => console.error('Error de conexión: ', err));