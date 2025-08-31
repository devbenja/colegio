import { validationResult } from 'express-validator';
import AuthService from '../services/authService.js';

class AuthController {
  static async register(req, res) {
    try {
      // Validar datos de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { email, password, nombre, apellido, role } = req.body;
      
      const result = await AuthService.register({
        email,
        password,
        nombre,
        apellido,
        role: role || 'estudiante'
      });

      // Establecer cookie HTTP-only
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      });

      res.status(201).json({
        success: true,
        message: 'Usuario registrado exitosamente',
        data: {
          user: result.user
          // No enviamos el token en el JSON, solo en la cookie
        }
      });

    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      // Validar datos de entrada
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      
      const result = await AuthService.login(email, password);

      // Establecer cookie HTTP-only
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
      });

      res.status(200).json({
        success: true,
        message: 'Login exitoso',
        data: {
          user: result.user
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  static async getProfile(req, res) {
    try {
      const user = await AuthService.getProfile(req.user.id);
      
      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  static async logout(req, res) {
    try {
      // Limpiar la cookie del token
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });

      res.status(200).json({
        success: true,
        message: 'Logout exitoso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en logout'
      });
    }
  }
}

export default AuthController;
