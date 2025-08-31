import express from 'express';
import TeacherController from '../controllers/teacherController.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Middleware para verificar que solo los profesores puedan acceder
const teacherOnly = authorize('profesor');

// Rutas protegidas solo para profesores
router.use(auth, teacherOnly);

// Obtener materias que imparte el profesor
router.get('/subjects', TeacherController.getMySubjects);

// Obtener estudiantes de una materia específica
router.get('/subjects/:subjectId/students', TeacherController.getStudentsBySubject);

// Obtener resumen de clases del profesor
router.get('/summary', TeacherController.getMyClassSummary);

export default router;
