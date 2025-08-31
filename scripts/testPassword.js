import sequelize from '../src/config/database.js';
import { setupAssociations, User } from '../src/config/associations.js';
import bcrypt from 'bcryptjs';

const testPassword = async () => {
  try {
    console.log('🔐 Probando comparación de contraseñas...');
    
    // Configurar las asociaciones
    setupAssociations();
    
    // Buscar el admin
    const admin = await User.findOne({
      where: { email: 'admin@colegio.com' }
    });
    
    if (!admin) {
      console.log('❌ Admin no encontrado');
      return;
    }
    
    console.log('✅ Admin encontrado:', admin.email);
    console.log('Password hash en DB:', admin.password.substring(0, 20) + '...');
    
    // Probar contraseña correcta
    const testPassword = 'password123';
    console.log('\n🔑 Probando contraseña:', testPassword);
    
    // Usar el método del modelo
    const isValidModel = await admin.comparePassword(testPassword);
    console.log('✅ Resultado del modelo:', isValidModel);
    
    // Probar directamente con bcrypt
    const isValidBcrypt = await bcrypt.compare(testPassword, admin.password);
    console.log('✅ Resultado directo bcrypt:', isValidBcrypt);
    
    // Generar hash de la contraseña de prueba
    const testHash = await bcrypt.hash(testPassword, 10);
    console.log('🔐 Hash de prueba:', testHash.substring(0, 20) + '...');
    
    // Comparar hash de prueba con el de la DB
    const isValidTestHash = await bcrypt.compare(testPassword, testHash);
    console.log('✅ Hash de prueba válido:', isValidTestHash);
    
    // Verificar si las contraseñas coinciden
    if (isValidModel && isValidBcrypt) {
      console.log('\n🎉 ¡La contraseña es válida!');
    } else {
      console.log('\n❌ La contraseña NO es válida');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
};

testPassword();
