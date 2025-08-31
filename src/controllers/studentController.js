import { User, Grade, Subject } from '../config/associations.js';

class StudentController {
  // Obtener información académica del estudiante autenticado
  static async getMyAcademicInfo(req, res) {
    try {
      const studentId = req.user.id;
      console.log('🔍 Buscando información académica para estudiante:', studentId);

      // Primero obtener el estudiante básico
      const student = await User.findOne({
        where: { id: studentId, role: 'estudiante', activo: true },
        attributes: ['id', 'nombre', 'apellido', 'email']
      });

      if (!student) {
        return res.status(404).json({
          success: false,
          message: 'Estudiante no encontrado'
        });
      }

      // Obtener los grados en los que está inscrito
      const enrolledGrades = await Grade.findAll({
        include: [
          {
            model: User,
            as: 'students',
            where: { id: studentId },
            attributes: []
          }
        ],
        attributes: ['id', 'nombre', 'descripcion']
      });

      console.log('📚 Grados encontrados:', enrolledGrades.length);

      // Formatear la respuesta para mostrar información clara
      const academicInfo = {
        estudiante: {
          id: student.id,
          nombre: student.nombre,
          apellido: student.apellido,
          email: student.email
        },
        grados: enrolledGrades.map(grade => ({
          id: grade.id,
          nombre: grade.nombre,
          descripcion: grade.descripcion
        }))
      };

      res.status(200).json({
        success: true,
        data: academicInfo
      });
    } catch (error) {
      console.error('❌ Error en getMyAcademicInfo:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener información académica',
        error: error.message
      });
    }
  }

  // Obtener horario del estudiante (materias por día)
  static async getMySchedule(req, res) {
    try {
      const studentId = req.user.id;
      console.log('📅 Buscando horario para estudiante:', studentId);

      // Por ahora, devolver un horario básico
      const schedule = {
        estudiante: {
          id: studentId
        },
        horario: [
          {
            dia: 'Lunes',
            materias: [
              { hora: '8:00 - 9:00', materia: 'Matemáticas', profesor: 'Juan Pérez' },
              { hora: '9:00 - 10:00', materia: 'Ciencias', profesor: 'Juan Pérez' },
              { hora: '10:00 - 11:00', materia: 'Historia', profesor: 'María García' }
            ]
          },
          {
            dia: 'Martes',
            materias: [
              { hora: '8:00 - 9:00', materia: 'Español', profesor: 'Ana López' },
              { hora: '9:00 - 10:00', materia: 'Inglés', profesor: 'Carlos Ruiz' },
              { hora: '10:00 - 11:00', materia: 'Educación Física', profesor: 'Pedro Sánchez' }
            ]
          }
        ]
      };

      res.status(200).json({
        success: true,
        data: schedule
      });
    } catch (error) {
      console.error('❌ Error en getMySchedule:', error);
      res.status(500).json({
        success: false,
        message: 'Error al obtener horario',
        error: error.message
      });
    }
  }
}

export default StudentController;
