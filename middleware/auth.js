const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ mensaje: 'No hay token, permiso denegado' });
  }

  try {
    // 👈 DEBE ser la misma palabra que pusiste en el controlador
    const cifrado = jwt.verify(token, 'palabraSecreta'); 
    
    // 👈 Guardamos el objeto user completo en la petición
    req.user = cifrado.user; 
    
    next();
  } catch (error) {
    // Si entra aquí, es porque la palabra o el token no coinciden
    res.status(401).json({ mensaje: 'Token no Valid' });
  }
};