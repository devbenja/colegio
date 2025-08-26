const User = require('../models/User');
const JWTService = require('../lib/jwt');

class AuthService {
  static async register(userData) {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await User.findOne({ where: { email: userData.email } });
      if (existingUser) {
        throw new Error('El email ya está registrado');
      }

      // Crear el usuario
      const user = await User.create(userData);
      
      // Generar token
      const token = JWTService.generateToken({ 
        id: user.id, 
        email: user.email, 
        role: user.role 
      });

      // Retornar usuario sin contraseña
      const { password, ...userWithoutPassword } = user.toJSON();
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static async login(email, password) {
    try {
      // Buscar usuario por email
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar contraseña
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        throw new Error('Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (!user.activo) {
        throw new Error('Usuario inactivo');
      }

      // Generar token
      const token = JWTService.generateToken({ 
        id: user.id, 
        email: user.email, 
        role: user.role 
      });

      // Retornar usuario sin contraseña
      const { password: userPassword, ...userWithoutPassword } = user.toJSON();
      
      return {
        user: userWithoutPassword,
        token
      };
    } catch (error) {
      throw error;
    }
  }

  static async getProfile(userId) {
    try {
      const user = await User.findByPk(userId, {
        attributes: { exclude: ['password'] }
      });
      
      if (!user) {
        throw new Error('Usuario no encontrado');
      }

      return user;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = AuthService;
