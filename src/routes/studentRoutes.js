import express from 'express';
import StudentController from '../controllers/studentController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Middleware para verificar que solo los estudiantes puedan acceder
const studentOnly = authorize('estudiante');

// Rutas protegidas solo para estudiantes
router.use(auth, studentOnly);

// Obtener información académica del estudiante autenticado
router.get('/academic-info', StudentController.getMyAcademicInfo);

// Obtener horario del estudiante
router.get('/schedule', StudentController.getMySchedule);

export default router;
