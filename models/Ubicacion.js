const mongoose = require('mongoose');

const UbicacionSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    default: Date.now
  },
  vehiculo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehiculo', // referencia al modelo Vehiculo
    required: true
  },
  dispositivo_id: {
    type: String, // ID físico del dispositivo, como el serial o MAC del ESP32
    required: true
  },
  ubicacion: {
    latitud: {
      type: String,
      required: true
    },
    longitud: {
      type: String,
      required: true
    }
  }
}, { collection: 'Ubicaciones' });

module.exports = mongoose.model('Ubicacion', UbicacionSchema);
