import { validationResult } from 'express-validator';
import { User, Grade, Subject, GradeSubject, TeacherSubject, StudentGrade } from '../config/associations.js';

class AdminController {
  // Obtener todos los grados
  static async getGrades(req, res) {
    try {
      const grades = await Grade.findAll({
        where: { activo: true },
        include: [
          {
            model: Subject,
            as: 'subjects',
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'students',
            through: { attributes: [] },
            attributes: ['id', 'nombre', 'apellido', 'email']
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: grades
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener grados',
        error: error.message
      });
    }
  }

  // Obtener todas las materias
  static async getSubjects(req, res) {
    try {
      const subjects = await Subject.findAll({
        where: { activo: true },
        include: [
          {
            model: Grade,
            as: 'grades',
            through: { attributes: [] }
          },
          {
            model: User,
            as: 'teachers',
            through: { attributes: [] },
            attributes: ['id', 'nombre', 'apellido', 'email']
          }
        ]
      });

      res.status(200).json({
        success: true,
        data: subjects
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener materias',
        error: error.message
      });
    }
  }

  // Asignar materia a un grado
  static async assignSubjectToGrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { gradeId, subjectId } = req.body;

      // Verificar que el grado y la materia existan
      const grade = await Grade.findByPk(gradeId);
      const subject = await Subject.findByPk(subjectId);

      if (!grade || !subject) {
        return res.status(404).json({
          success: false,
          message: 'Grado o materia no encontrado'
        });
      }

      // Crear la asignación
      await GradeSubject.create({
        gradeId,
        subjectId
      });

      res.status(201).json({
        success: true,
        message: 'Materia asignada al grado exitosamente'
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Esta materia ya está asignada a este grado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al asignar materia al grado',
        error: error.message
      });
    }
  }

  // Asignar materia a un profesor
  static async assignSubjectToTeacher(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { teacherId, subjectId } = req.body;

      // Verificar que el profesor y la materia existan
      const teacher = await User.findOne({
        where: { id: teacherId, role: 'profesor', activo: true }
      });
      const subject = await Subject.findByPk(subjectId);

      if (!teacher || !subject) {
        return res.status(404).json({
          success: false,
          message: 'Profesor o materia no encontrado'
        });
      }

      // Crear la asignación
      await TeacherSubject.create({
        teacherId,
        subjectId
      });

      res.status(201).json({
        success: true,
        message: 'Materia asignada al profesor exitosamente'
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Esta materia ya está asignada a este profesor'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al asignar materia al profesor',
        error: error.message
      });
    }
  }

  // Inscribir estudiante en un grado
  static async enrollStudentInGrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { studentId, gradeId } = req.body;

      // Verificar que el estudiante y el grado existan
      const student = await User.findOne({
        where: { id: studentId, role: 'estudiante', activo: true }
      });
      const grade = await Grade.findByPk(gradeId);

      if (!student || !grade) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante o grado no encontrado'
        });
      }

      // Crear la inscripción
      await StudentGrade.create({
        studentId,
        gradeId
      });

      res.status(201).json({
        success: true,
        message: 'Estudiante inscrito en el grado exitosamente'
      });
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({
          success: false,
          message: 'Este estudiante ya está inscrito en este grado'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error al inscribir estudiante en el grado',
        error: error.message
      });
    }
  }

  // Obtener información completa de un estudiante
  static async getStudentInfo(req, res) {
    try {
      const { studentId } = req.params;

      const student = await User.findOne({
        where: { id: studentId, role: 'estudiante', activo: true },
        include: [
          {
            model: Grade,
            as: 'enrolledGrades',
            through: { attributes: ['fechaInscripcion'] },
            include: [
              {
                model: Subject,
                as: 'subjects',
                through: { attributes: [] },
                include: [
                  {
                    model: User,
                    as: 'teachers',
                    through: { attributes: [] },
                    attributes: ['id', 'nombre', 'apellido', 'email']
                  }
                ]
              }
            ]
          }
        ]
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener información del estudiante',
        error: error.message
      });
    }
  }
}

export default AdminController;
