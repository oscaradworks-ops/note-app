const User = require('../models/User'); // Importante
const bcrypt = require('bcryptjs');     // Importante
const jwt = require('jsonwebtoken');   // Importante

// --- REGISTRO ---
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    // 2. Crear la instancia del nuevo usuario
    user = new User({ name, email, password });

    // 3. 🛡️ ENCRIPTAR LA CONTRASEÑA (Aquí está el truco)
    const salt = await bcrypt.genSalt(10); // Genera una "semilla" de seguridad
    user.password = await bcrypt.hash(password, salt); // Transforma la clave en hash

    // 4. Guardar en la base de datos (Ahora se guarda encriptada)
    await user.save();

    res.json({ msg: "User registered successfully with encrypted password" });

  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
};

// --- LOGIN (Tu código verificado) ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await User.findOne({ email });

    if (!usuario) {
      return res.status(400).json({ mensaje: 'Incorrect Credentials' });
    }

    const esCorrecta = await bcrypt.compare(password, usuario.password);
    if (!esCorrecta) {
      return res.status(400).json({ mensaje: 'Incorrect Credentials' });
    }

    const payload = {
  user: {
    id: usuario._id
  }
};

jwt.sign(
  payload,
  'palabraSecreta', // 👈 Vamos a usar un texto fijo para eliminar dudas del .env
  { expiresIn: '1d' },
  (err, token) => {
    if (err) throw err;
    res.status(200).json({ 
      token, 
      user: { name: usuario.name, id: usuario._id } 
    });
  }
);
  } catch (error) {
    console.error("🔥 ERROR CRÍTICO EN LOGIN:", error.message);
    res.status(500).json({ mensaje: 'Login Error' });
  }
};