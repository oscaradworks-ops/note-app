const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const conectarDB = require('./config/db.js');

// 1. Cargamos las variables secretas
dotenv.config();

// 2. Conectamos a la base de datos
conectarDB();

const app = express();

// 3. Middlewares (ayudantes)
app.use(cors()); 
app.use(express.json()); 

// 4. Rutas (Importadas y usadas correctamente)
// Importamos los archivos de rutas
const authRoutes = require('./routes/authRoutes');
const noteRoutes = require('./routes/noteRoutes');

console.log('¿authRoutes es válido?:', typeof authRoutes); 
console.log('¿noteRoutes es válido?:', typeof noteRoutes);

app.use('/api/auth', authRoutes); // Línea 24 (donde explota)
app.use('/api/notes', noteRoutes);

// 5. Ruta de prueba
app.get('/', (req, res) => {
  res.send('The server is Working! 📝');
});

// 6. Encendemos el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is at http://localhost:${PORT}`);
});

