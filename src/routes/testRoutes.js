const express = require('express');
const router = express.Router();
const TestController = require('../controllers/testController');
const { auth, authorize } = require('../middleware/auth');

// Ruta de prueba solo para estudiantes
router.get('/estudiante', auth, authorize('estudiante'), TestController.testEstudiante);

// Ruta de prueba solo para profesores
router.get('/profesor', auth, authorize('profesor'), TestController.testProfesor);

// Ruta de prueba solo para administradores
router.get('/admin', auth, authorize('admin'), TestController.testAdmin);

// Ruta de prueba para múltiples roles (estudiante, profesor, admin)
router.get('/multi-role', auth, authorize('estudiante', 'profesor', 'admin'), TestController.testMultiRole);

module.exports = router;
