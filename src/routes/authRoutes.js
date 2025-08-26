const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { loginSchema, registerSchema } = require('../schemas/authSchemas');

// Ruta de registro
router.post('/register', registerSchema, AuthController.register);

// Ruta de login
router.post('/login', loginSchema, AuthController.login);

// Ruta para obtener perfil del usuario autenticado
router.get('/profile', auth, AuthController.getProfile);

module.exports = router;
