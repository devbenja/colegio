import { User, Grade, Subject, TeacherSubject } from '../config/associations.js';

class TeacherController {
  // Obtener materias que imparte el profesor autenticado
  static async getMySubjects(req, res) {
    try {
      const teacherId = req.user.id;
      console.log('👨‍🏫 Buscando materias para profesor:', teacherId);

      // Primero obtener el profesor básico
      const teacher = await User.findOne({
        where: { id: teacherId, role: 'profesor', activo: true },
        attributes: ['id', 'nombre', 'apellido', 'email']
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Profesor no encontrado'
        });
      }

      // Obtener las materias que imparte
      const teachingSubjects = await Subject.findAll({
        include: [
          {
            model: User,
            as: 'teachers',
            where: { id: teacherId },
            attributes: []
          }
        ],
        attributes: ['id', 'nombre', 'descripcion']
      });

      console.log('📚 Materias encontradas:', teachingSubjects.length);

      // Formatear la respuesta
      const teacherInfo = {
        profesor: {
          id: teacher.id,
          nombre: teacher.nombre,
          apellido: teacher.apellido,
          email: teacher.email
        },
        materias: teachingSubjects.map(subject => ({
          id: subject.id,
          nombre: subject.nombre,
          descripcion: subject.descripcion
        }))
      };

      res.status(200).json({
        success: true,
        data: teacherInfo
      });
    } catch (error) {
      console.error('❌ Error en getMySubjects:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener materias del profesor',
        error: error.message
      });
    }
  }

  // Obtener estudiantes de una materia específica
  static async getStudentsBySubject(req, res) {
    try {
      const { subjectId } = req.params;
      const teacherId = req.user.id;
      console.log('👨‍🏫 Buscando estudiantes para materia:', subjectId, 'profesor:', teacherId);

      // Verificar que el profesor imparta esta materia
      const teacherSubject = await TeacherSubject.findOne({
        where: { teacherId, subjectId }
      });

      if (!teacherSubject) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para acceder a esta materia'
        });
      }

      // Obtener la materia
      const subject = await Subject.findOne({
        where: { id: subjectId, activo: true },
        attributes: ['id', 'nombre', 'descripcion']
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Materia no encontrada'
        });
      }

      // Por ahora, devolver información básica
      res.status(200).json({
        success: true,
        data: {
          materia: {
            id: subject.id,
            nombre: subject.nombre,
            descripcion: subject.descripcion
          },
          mensaje: 'Funcionalidad de estudiantes por materia en desarrollo'
        }
      });
    } catch (error) {
      console.error('❌ Error en getStudentsBySubject:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener estudiantes de la materia',
        error: error.message
      });
    }
  }

  // Obtener resumen de clases del profesor
  static async getMyClassSummary(req, res) {
    try {
      const teacherId = req.user.id;
      console.log('👨‍🏫 Buscando resumen para profesor:', teacherId);

      // Obtener el profesor básico
      const teacher = await User.findOne({
        where: { id: teacherId, role: 'profesor', activo: true },
        attributes: ['id', 'nombre', 'apellido', 'email']
      });

      if (!teacher) {
        return res.status(404).json({
          success: false,
          message: 'Profesor no encontrado'
        });
      }

      // Obtener las materias que imparte
      const teachingSubjects = await Subject.findAll({
        include: [
          {
            model: User,
            as: 'teachers',
            where: { id: teacherId },
            attributes: []
          }
        ],
        attributes: ['id', 'nombre', 'descripcion']
      });

      console.log('📚 Materias encontradas para resumen:', teachingSubjects.length);

      // Crear resumen simplificado
      const summary = {
        profesor: `${teacher.nombre} ${teacher.apellido}`,
        estadisticas: {
          totalMaterias: teachingSubjects.length,
          totalGrados: 'En desarrollo',
          totalEstudiantes: 'En desarrollo'
        },
        materias: teachingSubjects.map(subject => ({
          nombre: subject.nombre,
          descripcion: subject.descripcion
        }))
      };

      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (error) {
      console.error('❌ Error en getMyClassSummary:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener resumen de clases',
        error: error.message
      });
    }
  }
}

export default TeacherController;
