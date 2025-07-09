const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');

app.use('/api/auth', authRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('Conectado a MongoDB');
    app.listen(3000, () => {
        console.log('Servidor corriendo en http://localhost:3000');
    });
}).catch(err => console.error('Error de conexión: ', err));