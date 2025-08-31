import JWTService from '../lib/jwt.js';
import User from '../models/User.js';

const auth = async (req, res, next) => {
  try {
    // Priorizar cookies sobre headers para mayor seguridad
    let token = req.cookies.token || req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de autenticación requerido' 
      });
    }

    const decoded = JWTService.verifyToken(token);
    const user = await User.findByPk(decoded.id);

    if (!user || !user.activo) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado o inactivo' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no autenticado' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'No tienes permisos para acceder a este recurso' 
      });
    }

    next();
  };
};

export { auth, authorize };
