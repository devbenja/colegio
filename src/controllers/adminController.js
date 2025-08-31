import { validationResult } from 'express-validator';
import { User, Grade, Subject, GradeSubject, TeacherSubject, StudentGrade } from '../config/associations.js';

class AdminController {
  // ===== CRUD DE GRADOS =====
  
  // Obtener todos los grados
  static async getGrades(req, res) {
    try {
      const grades = await Grade.findAll({
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

  // Crear nuevo grado
  static async createGrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { nombre, descripcion } = req.body;

      // Verificar si ya existe un grado con ese nombre
      const existingGrade = await Grade.findOne({ where: { nombre } });
      if (existingGrade) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un grado con ese nombre'
        });
      }

      const grade = await Grade.create({
        nombre,
        descripcion,
        activo: true
      });

      res.status(201).json({
        success: true,
        message: 'Grado creado exitosamente',
        data: grade
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear grado',
        error: error.message
      });
    }
  }

  // Obtener un grado específico
  static async getGradeById(req, res) {
    try {
      const { id } = req.params;

      const grade = await Grade.findByPk(id, {
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

      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Grado no encontrado'
        });
      }

      res.status(200).json({
        success: true,
        data: grade
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener grado',
        error: error.message
      });
    }
  }

  // Actualizar un grado
  static async updateGrade(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      const grade = await Grade.findByPk(id);
      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Grado no encontrado'
        });
      }

      // Verificar si el nuevo nombre ya existe en otro grado
      if (nombre !== grade.nombre) {
        const existingGrade = await Grade.findOne({ where: { nombre } });
        if (existingGrade) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe un grado con ese nombre'
          });
        }
      }

      await grade.update({ nombre, descripcion });

      res.status(200).json({
        success: true,
        message: 'Grado actualizado exitosamente',
        data: grade
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar grado',
        error: error.message
      });
    }
  }

  // Cambiar estado de un grado
  static async toggleGradeStatus(req, res) {
    try {
      const { id } = req.params;
      const { activo } = req.body;

      const grade = await Grade.findByPk(id);
      if (!grade) {
        return res.status(404).json({
          success: false,
          message: 'Grado no encontrado'
        });
      }

      await grade.update({ activo });

      res.status(200).json({
        success: true,
        message: `Grado ${activo ? 'activado' : 'desactivado'} exitosamente`,
        data: grade
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cambiar estado del grado',
        error: error.message
      });
    }
  }

  // ===== CRUD DE MATERIAS =====

  // Obtener todas las materias
  static async getSubjects(req, res) {
    try {
      const subjects = await Subject.findAll({
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

  // Crear nueva materia
  static async createSubject(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { nombre, descripcion } = req.body;

      // Verificar si ya existe una materia con ese nombre
      const existingSubject = await Subject.findOne({ where: { nombre } });
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe una materia con ese nombre'
        });
      }

      const subject = await Subject.create({
        nombre,
        descripcion,
        activo: true
      });

      res.status(201).json({
        success: true,
        message: 'Materia creada exitosamente',
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear materia',
        error: error.message
      });
    }
  }

  // Obtener una materia específica
  static async getSubjectById(req, res) {
    try {
      const { id } = req.params;

      const subject = await Subject.findByPk(id, {
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

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      res.status(200).json({
        success: true,
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener materia',
        error: error.message
      });
    }
  }

  // Actualizar una materia
  static async updateSubject(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const { nombre, descripcion } = req.body;

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      // Verificar si el nuevo nombre ya existe en otra materia
      if (nombre !== subject.nombre) {
        const existingSubject = await Subject.findOne({ where: { nombre } });
        if (existingSubject) {
          return res.status(400).json({
            success: false,
            message: 'Ya existe una materia con ese nombre'
          });
        }
      }

      await subject.update({ nombre, descripcion });

      res.status(200).json({
        success: true,
        message: 'Materia actualizada exitosamente',
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar materia',
        error: error.message
      });
    }
  }

  // Cambiar estado de una materia
  static async toggleSubjectStatus(req, res) {
    try {
      const { id } = req.params;
      const { activo } = req.body;

      const subject = await Subject.findByPk(id);
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      await subject.update({ activo });

      res.status(200).json({
        success: true,
        message: `Materia ${activo ? 'activada' : 'desactivada'} exitosamente`,
        data: subject
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al cambiar estado de la materia',
        error: error.message
      });
    }
  }

  // ===== ASIGNACIONES =====

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

      // Verificar que ambos estén activos
      if (!grade.activo || !subject.activo) {
        return res.status(400).json({
          success: false,
          message: 'El grado y la materia deben estar activos'
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

  // Remover materia de un grado
  static async removeSubjectFromGrade(req, res) {
    try {
      const { gradeId, subjectId } = req.params;

      const assignment = await GradeSubject.findOne({
        where: { gradeId, subjectId }
      });

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Asignación no encontrada'
        });
      }

      await assignment.destroy();

      res.status(200).json({
        success: true,
        message: 'Materia removida del grado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al remover materia del grado',
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

      // Verificar que la materia esté activa
      if (!subject.activo) {
        return res.status(400).json({
          success: false,
          message: 'La materia debe estar activa'
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

  // Remover materia de un profesor
  static async removeSubjectFromTeacher(req, res) {
    try {
      const { teacherId, subjectId } = req.params;

      const assignment = await TeacherSubject.findOne({
        where: { teacherId, subjectId }
      });

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: 'Asignación no encontrada'
        });
      }

      await assignment.destroy();

      res.status(200).json({
        success: true,
        message: 'Materia removida del profesor exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al remover materia del profesor',
        error: error.message
      });
    }
  }

  // ===== INSCRIPCIONES =====

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

      // Verificar que el grado esté activo
      if (!grade.activo) {
        return res.status(400).json({
          success: false,
          message: 'El grado debe estar activo'
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

  // Remover estudiante de un grado
  static async removeStudentFromGrade(req, res) {
    try {
      const { studentId, gradeId } = req.params;

      const enrollment = await StudentGrade.findOne({
        where: { studentId, gradeId }
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Inscripción no encontrada'
        });
      }

      await enrollment.destroy();

      res.status(200).json({
        success: true,
        message: 'Estudiante removido del grado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al remover estudiante del grado',
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
