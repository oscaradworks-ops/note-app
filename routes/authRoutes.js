const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 1. Ruta para registrarse
router.post('/register', authController.register);

// 2. Ruta para iniciar sesión
router.post('/login', authController.login);

module.exports = router;
// ESTO VA AL FINAL DE authController.js (No en las rutas)


