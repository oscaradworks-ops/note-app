const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // 1. Buscamos el token en la cabecera
  const token = req.header('x-auth-token');

  // 2. ¿No hay token? ¡Afuera! 🚪
  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, permiso denegado' });
  }

  try {
    // 3. ¿El token es real? Lo verificamos con nuestra palabra secreta
    const cifrado = jwt.verify(token, process.env.JWT_SECRET);
    
    // 4. Guardamos el ID del usuario en la petición para usarlo después
    req.usuario = cifrado.id;
    
    // 5. ¡Todo bien! Puedes pasar al siguiente paso
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};