import express from 'express';
import AdminController from '../controllers/adminController.js';
import { auth, authorize } from '../middleware/auth.js';
import { body } from 'express-validator';

const router = express.Router();

// Middleware para verificar que solo los administradores puedan acceder
const adminOnly = authorize('admin');

// Validaciones
const assignSubjectToGradeSchema = [
  body('gradeId').isUUID().withMessage('ID de grado inválido'),
  body('subjectId').isUUID().withMessage('ID de materia inválido')
];

const assignSubjectToTeacherSchema = [
  body('teacherId').isUUID().withMessage('ID de profesor inválido'),
  body('subjectId').isUUID().withMessage('ID de materia inválido')
];

const enrollStudentSchema = [
  body('studentId').isUUID().withMessage('ID de estudiante inválido'),
  body('gradeId').isUUID().withMessage('ID de grado inválido')
];

// Rutas protegidas solo para administradores
router.use(auth, adminOnly);

// Obtener todos los grados con sus materias y estudiantes
router.get('/grades', AdminController.getGrades);

// Obtener todas las materias con sus grados y profesores
router.get('/subjects', AdminController.getSubjects);

// Asignar materia a un grado
router.post('/grades/assign-subject', assignSubjectToGradeSchema, AdminController.assignSubjectToGrade);

// Asignar materia a un profesor
router.post('/teachers/assign-subject', assignSubjectToTeacherSchema, AdminController.assignSubjectToTeacher);

// Inscribir estudiante en un grado
router.post('/students/enroll', enrollStudentSchema, AdminController.enrollStudentInGrade);

// Obtener información completa de un estudiante
router.get('/students/:studentId', AdminController.getStudentInfo);

export default router;
