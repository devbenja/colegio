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

// Validaciones para CRUD de grados y materias
const gradeSchema = [
  body('nombre').notEmpty().withMessage('El nombre del grado es requerido'),
  body('descripcion').optional().isString().withMessage('La descripción debe ser texto')
];

const subjectSchema = [
  body('nombre').notEmpty().withMessage('El nombre de la materia es requerido'),
  body('descripcion').optional().isString().withMessage('La descripción debe ser texto')
];

// Rutas protegidas solo para administradores
router.use(auth, adminOnly);

// ===== CRUD DE GRADOS =====
// Obtener todos los grados con sus materias y estudiantes
router.get('/grades', AdminController.getGrades);

// Crear nuevo grado
router.post('/grades', gradeSchema, AdminController.createGrade);

// Obtener un grado específico
router.get('/grades/:id', AdminController.getGradeById);

// Actualizar un grado
router.put('/grades/:id', gradeSchema, AdminController.updateGrade);

// Cambiar estado de un grado (activo/inactivo)
router.patch('/grades/:id/toggle-status', AdminController.toggleGradeStatus);

// ===== CRUD DE MATERIAS =====
// Obtener todas las materias con sus grados y profesores
router.get('/subjects', AdminController.getSubjects);

// Crear nueva materia
router.post('/subjects', subjectSchema, AdminController.createSubject);

// Obtener una materia específica
router.get('/subjects/:id', AdminController.getSubjectById);

// Actualizar una materia
router.put('/subjects/:id', subjectSchema, AdminController.updateSubject);

// Cambiar estado de una materia (activa/inactiva)
router.patch('/subjects/:id/toggle-status', AdminController.toggleSubjectStatus);

// ===== ASIGNACIONES =====
// Asignar materia a un grado
router.post('/grades/assign-subject', assignSubjectToGradeSchema, AdminController.assignSubjectToGrade);

// Remover materia de un grado
router.delete('/grades/:gradeId/subjects/:subjectId', AdminController.removeSubjectFromGrade);

// Asignar materia a un profesor
router.post('/teachers/assign-subject', assignSubjectToTeacherSchema, AdminController.assignSubjectToTeacher);

// Remover materia de un profesor
router.delete('/teachers/:teacherId/subjects/:subjectId', AdminController.removeSubjectFromTeacher);

// ===== INSCRIPCIONES =====
// Inscribir estudiante en un grado
router.post('/students/enroll', enrollStudentSchema, AdminController.enrollStudentInGrade);

// Remover estudiante de un grado
router.delete('/students/:studentId/grades/:gradeId', AdminController.removeStudentFromGrade);

// Obtener información completa de un estudiante
router.get('/students/:studentId', AdminController.getStudentInfo);

export default router;
