const mongoose = require('mongoose');

// 1. Definimos el esquema (Asegúrate de que el nombre coincida abajo)
const UserSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  date: { 
    type: Date, 
    default: Date.now 
  }
});

// 2. Exportamos el modelo usando el esquema definido arriba
// Fíjate bien: aquí pasamos 'UserSchema' como segundo argumento
module.exports = mongoose.model('User', UserSchema);