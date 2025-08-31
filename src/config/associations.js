import User from '../models/User.js';
import Grade from '../models/Grade.js';
import Subject from '../models/Subject.js';
import GradeSubject from '../models/GradeSubject.js';
import TeacherSubject from '../models/TeacherSubject.js';
import StudentGrade from '../models/StudentGrade.js';

// Función para configurar las asociaciones
export function setupAssociations() {
  // Un Grado puede tener muchas Materias (a través de GradeSubject)
  Grade.belongsToMany(Subject, {
    through: GradeSubject,
    foreignKey: 'gradeId',
    otherKey: 'subjectId',
    as: 'subjects'
  });

  // Una Materia puede pertenecer a muchos Grados (a través de GradeSubject)
  Subject.belongsToMany(Grade, {
    through: GradeSubject,
    foreignKey: 'subjectId',
    otherKey: 'gradeId',
    as: 'grades'
  });

  // Un Profesor puede enseñar muchas Materias (a través de TeacherSubject)
  User.belongsToMany(Subject, {
    through: TeacherSubject,
    foreignKey: 'teacherId',
    otherKey: 'subjectId',
    as: 'teachingSubjects',
    scope: {
      role: 'profesor'
    }
  });

  // Una Materia puede ser enseñada por muchos Profesores (a través de TeacherSubject)
  Subject.belongsToMany(User, {
    through: TeacherSubject,
    foreignKey: 'subjectId',
    otherKey: 'teacherId',
    as: 'teachers',
    scope: {
      role: 'profesor'
    }
  });

  // Un Estudiante puede estar en muchos Grados (a través de StudentGrade)
  User.belongsToMany(Grade, {
    through: StudentGrade,
    foreignKey: 'studentId',
    otherKey: 'gradeId',
    as: 'enrolledGrades',
    scope: {
      role: 'estudiante'
    }
  });

  // Un Grado puede tener muchos Estudiantes (a través de StudentGrade)
  Grade.belongsToMany(User, {
    through: StudentGrade,
    foreignKey: 'gradeId',
    otherKey: 'studentId',
    as: 'students',
    scope: {
      role: 'estudiante'
    }
  });

  // Relaciones directas para facilitar consultas
  GradeSubject.belongsTo(Grade, { foreignKey: 'gradeId' });
  GradeSubject.belongsTo(Subject, { foreignKey: 'subjectId' });

  TeacherSubject.belongsTo(User, { foreignKey: 'teacherId' });
  TeacherSubject.belongsTo(Subject, { foreignKey: 'subjectId' });

  StudentGrade.belongsTo(User, { foreignKey: 'studentId' });
  StudentGrade.belongsTo(Grade, { foreignKey: 'gradeId' });
}

export {
  User,
  Grade,
  Subject,
  GradeSubject,
  TeacherSubject,
  StudentGrade
};
