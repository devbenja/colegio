import express from 'express';
const router = express.Router();
import AuthController from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import { loginSchema, registerSchema } from '../schemas/authSchemas.js';

// Ruta de registro
router.post('/register', registerSchema, AuthController.register);

// Ruta de login
router.post('/login', loginSchema, AuthController.login);

// Ruta para obtener perfil del usuario autenticado
router.get('/profile', auth, AuthController.getProfile);

// Ruta de logout
router.post('/logout', auth, AuthController.logout);

export default router;
