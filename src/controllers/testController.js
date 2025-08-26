class TestController {
  static async testEstudiante(req, res) {
    res.status(200).json({
      success: true,
      message: 'Ruta de prueba para estudiantes',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        nombre: req.user.nombre,
        apellido: req.user.apellido
      },
      timestamp: new Date().toISOString()
    });
  }

  static async testProfesor(req, res) {
    res.status(200).json({
      success: true,
      message: 'Ruta de prueba para profesores',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        nombre: req.user.nombre,
        apellido: req.user.apellido
      },
      timestamp: new Date().toISOString()
    });
  }

  static async testAdmin(req, res) {
    res.status(200).json({
      success: true,
      message: 'Ruta de prueba para administradores',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        nombre: req.user.nombre,
        apellido: req.user.apellido
      },
      timestamp: new Date().toISOString()
    });
  }

  static async testMultiRole(req, res) {
    res.status(200).json({
      success: true,
      message: 'Ruta de prueba para múltiples roles (estudiante, profesor, admin)',
      user: {
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
        nombre: req.user.nombre,
        apellido: req.user.apellido
      },
      timestamp: new Date().toISOString()
    });
  }
}

module.exports = TestController;
