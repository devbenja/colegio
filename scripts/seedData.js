import sequelize from '../src/config/database.js';
import { setupAssociations, User, Grade, Subject, GradeSubject, TeacherSubject, StudentGrade } from '../src/config/associations.js';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    console.log('🌱 Iniciando población de datos...');
    
    // Configurar las asociaciones antes de usar los modelos
    setupAssociations();
    console.log('✅ Asociaciones configuradas');

    // Verificar si ya existen datos
    const existingUsers = await User.count();
    const existingGrades = await Grade.count();
    const existingSubjects = await Subject.count();

    if (existingUsers > 0 && existingGrades > 0 && existingSubjects > 0) {
      console.log('ℹ️ Los datos ya existen en la base de datos');
      console.log(`  - Usuarios: ${existingUsers}`);
      console.log(`  - Grados: ${existingGrades}`);
      console.log(`  - Materias: ${existingSubjects}`);
      console.log('\n🔑 Credenciales de acceso:');
      console.log('  - Email: admin@colegio.com, prof1@colegio.com, est1@colegio.com');
      console.log('  - Password: password123');
      return;
    }

    // Crear grados (1° a 6° de secundaria)
    console.log('📚 Creando grados...');
    const grades = await Grade.bulkCreate([
      { nombre: '1°', descripcion: 'Primer año de secundaria', activo: true },
      { nombre: '2°', descripcion: 'Segundo año de secundaria', activo: true },
      { nombre: '3°', descripcion: 'Tercer año de secundaria', activo: true },
      { nombre: '4°', descripcion: 'Cuarto año de secundaria', activo: true },
      { nombre: '5°', descripcion: 'Quinto año de secundaria', activo: true },
      { nombre: '6°', descripcion: 'Sexto año de secundaria', activo: true }
    ], { ignoreDuplicates: true });
    console.log('✅ Grados creados:', grades.map(g => g.nombre));

    // Crear materias
    console.log('📖 Creando materias...');
    const subjects = await Subject.bulkCreate([
      { nombre: 'Matemáticas', descripcion: 'Álgebra y Geometría' },
      { nombre: 'Ciencias', descripcion: 'Biología, Física y Química' },
      { nombre: 'Historia', descripcion: 'Historia Universal y de México' },
      { nombre: 'Geografía', descripcion: 'Geografía física y humana' },
      { nombre: 'Español', descripcion: 'Lengua y Literatura' },
      { nombre: 'Inglés', descripcion: 'Idioma inglés' },
      { nombre: 'Educación Física', descripcion: 'Deportes y actividad física' },
      { nombre: 'Arte', descripcion: 'Arte y cultura' }
    ], { ignoreDuplicates: true });
    console.log('✅ Materias creadas:', subjects.map(s => s.nombre));

    // Crear usuarios de ejemplo
    console.log('👥 Creando usuarios...');
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    // Admin
    const admin = await User.findOrCreate({
      where: { email: 'admin@colegio.com' },
      defaults: {
        password: hashedPassword,
        nombre: 'Administrador',
        apellido: 'Sistema',
        role: 'admin'
      }
    });
    console.log('✅ Admin creado/verificado:', admin[0].email);

    // Profesores
    const profesores = await Promise.all([
      User.findOrCreate({
        where: { email: 'prof1@colegio.com' },
        defaults: {
          password: hashedPassword,
          nombre: 'Juan',
          apellido: 'Pérez',
          role: 'profesor'
        }
      }),
      User.findOrCreate({
        where: { email: 'prof2@colegio.com' },
        defaults: {
          password: hashedPassword,
          nombre: 'María',
          apellido: 'García',
          role: 'profesor'
        }
      })
    ]);
    console.log('✅ Profesores creados/verificados:', profesores.map(p => p[0].email));

    // Estudiantes
    const estudiantes = await Promise.all([
      User.findOrCreate({
        where: { email: 'est1@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Carlos', apellido: 'López', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est2@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Ana', apellido: 'Martínez', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est3@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Luis', apellido: 'Rodríguez', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est4@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Sofia', apellido: 'Hernández', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est5@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Diego', apellido: 'González', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est6@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Valeria', apellido: 'Morales', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est7@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Roberto', apellido: 'Silva', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est8@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Carmen', apellido: 'Vargas', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est9@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Fernando', apellido: 'Castro', role: 'estudiante' }
      }),
      User.findOrCreate({
        where: { email: 'est10@colegio.com' },
        defaults: { password: hashedPassword, nombre: 'Isabella', apellido: 'Reyes', role: 'estudiante' }
      })
    ]);
    console.log('✅ Estudiantes creados/verificados:', estudiantes.map(e => e[0].email));

    // Extraer los usuarios reales de los resultados de findOrCreate
    const adminUser = admin[0];
    const profesoresUsers = profesores.map(p => p[0]);
    const estudiantesUsers = estudiantes.map(e => e[0]);

    // Asignar materias a grados (ejemplo: todas las materias en todos los grados)
    console.log('🔗 Asignando materias a grados...');
    const gradeSubjects = [];
    for (const grade of grades) {
      for (const subject of subjects) {
        gradeSubjects.push({
          gradeId: grade.id,
          subjectId: subject.id
        });
      }
    }
    await GradeSubject.bulkCreate(gradeSubjects, { ignoreDuplicates: true });
    console.log('✅ Materias asignadas a grados');

    // Asignar materias a profesores
    console.log('👨‍🏫 Asignando materias a profesores...');
    const teacherSubjects = [
      { teacherId: profesoresUsers[0].id, subjectId: subjects[0].id }, // Prof1 -> Matemáticas
      { teacherId: profesoresUsers[0].id, subjectId: subjects[1].id }, // Prof1 -> Ciencias
      { teacherId: profesoresUsers[1].id, subjectId: subjects[2].id }, // Prof2 -> Historia
      { teacherId: profesoresUsers[1].id, subjectId: subjects[3].id }  // Prof2 -> Geografía
    ];
    await TeacherSubject.bulkCreate(teacherSubjects, { ignoreDuplicates: true });
    console.log('✅ Materias asignadas a profesores');

    // Inscribir estudiantes en grados
    console.log('🎓 Inscribiendo estudiantes en grados...');
    const studentGrades = [
      { studentId: estudiantesUsers[0].id, gradeId: grades[0].id }, // Est1 -> 1°
      { studentId: estudiantesUsers[1].id, gradeId: grades[0].id }, // Est2 -> 1°
      { studentId: estudiantesUsers[2].id, gradeId: grades[1].id }, // Est3 -> 2°
      { studentId: estudiantesUsers[3].id, gradeId: grades[1].id }, // Est4 -> 2°
      { studentId: estudiantesUsers[4].id, gradeId: grades[2].id }, // Est5 -> 3°
      { studentId: estudiantesUsers[5].id, gradeId: grades[2].id }, // Est6 -> 3°
      { studentId: estudiantesUsers[6].id, gradeId: grades[3].id }, // Est7 -> 4°
      { studentId: estudiantesUsers[7].id, gradeId: grades[3].id }, // Est8 -> 4°
      { studentId: estudiantesUsers[8].id, gradeId: grades[4].id }, // Est9 -> 5°
      { studentId: estudiantesUsers[9].id, gradeId: grades[4].id }  // Est10 -> 5°
    ];
    await StudentGrade.bulkCreate(studentGrades, { ignoreDuplicates: true });
    console.log('✅ Estudiantes inscritos en grados');

    console.log('🎉 Datos poblados exitosamente!');
    console.log('\n📋 Resumen:');
    console.log(`  - ${grades.length} grados creados`);
    console.log(`  - ${subjects.length} materias creadas`);
    console.log(`  - ${profesoresUsers.length} profesores creados`);
    console.log(`  - ${estudiantesUsers.length} estudiantes creados`);
    console.log(`  - 1 administrador creado`);
    console.log('\n🔑 Credenciales de acceso:');
    console.log('  - Email: admin@colegio.com, prof1@colegio.com, est1@colegio.com');
    console.log('  - Password: password123');

  } catch (error) {
    console.error('❌ Error al poblar datos:', error);
  } finally {
    await sequelize.close();
  }
};

seedData();
