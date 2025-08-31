import sequelize from '../src/config/database.js';
import { setupAssociations, User } from '../src/config/associations.js';

const checkUsers = async () => {
  try {
    console.log('🔍 Verificando usuarios en la base de datos...');
    
    // Configurar las asociaciones
    setupAssociations();
    
    // Obtener todos los usuarios
    const users = await User.findAll({
      attributes: ['id', 'email', 'nombre', 'apellido', 'role', 'password']
    });
    
    console.log(`\n📊 Total de usuarios encontrados: ${users.length}`);
    console.log('\n👥 Lista de usuarios:');
    
    users.forEach((user, index) => {
      console.log(`\n${index + 1}. ${user.role.toUpperCase()}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Nombre: ${user.nombre} ${user.apellido}`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Password hash: ${user.password.substring(0, 20)}...`);
    });
    
    // Verificar específicamente el admin
    const admin = await User.findOne({
      where: { email: 'admin@colegio.com' }
    });
    
    if (admin) {
      console.log('\n✅ Admin encontrado:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Password hash: ${admin.password.substring(0, 20)}...`);
    } else {
      console.log('\n❌ Admin NO encontrado');
    }
    
  } catch (error) {
    console.error('❌ Error al verificar usuarios:', error);
  } finally {
    await sequelize.close();
  }
};

checkUsers();
