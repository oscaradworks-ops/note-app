const mongoose = require('mongoose');

const conectarDB = async () => {
  try {
    // Intentamos conectar usando la dirección de nuestro archivo secreto
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ ¡Successfull conection with the DB!');
  } catch (error) {
    console.error('❌ Error trying to Connect:', error.message);
    process.exit(1); // Si falla, detenemos la app
  }
};

module.exports = conectarDB;