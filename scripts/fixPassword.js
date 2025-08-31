import sequelize from '../src/config/database.js';
import { setupAssociations, User } from '../src/config/associations.js';
import bcrypt from 'bcryptjs';

const fixPassword = async () => {
  try {
    console.log('🔧 Corrigiendo contraseña del admin...');
    
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
    console.log('Password hash anterior:', admin.password.substring(0, 20) + '...');
    
    // Generar nuevo hash para 'password123'
    const newPassword = 'password123';
    const newHash = await bcrypt.hash(newPassword, 10);
    
    console.log('🔑 Nueva contraseña:', newPassword);
    console.log('🔐 Nuevo hash:', newHash.substring(0, 20) + '...');
    
    // Actualizar la contraseña
    admin.password = newHash;
    await admin.save();
    
    console.log('✅ Contraseña actualizada en la base de datos');
    
    // Recargar el usuario desde la base de datos
    await admin.reload();
    
    // Verificar que funciona
    const isValid = await admin.comparePassword(newPassword);
    console.log('✅ Verificación de nueva contraseña:', isValid);
    
    // Verificar también directamente con bcrypt
    const isValidDirect = await bcrypt.compare(newPassword, admin.password);
    console.log('✅ Verificación directa bcrypt:', isValidDirect);
    
    if (isValid && isValidDirect) {
      console.log('\n🎉 ¡Contraseña corregida exitosamente!');
      console.log('Ahora puedes hacer login con:');
      console.log('  Email: admin@colegio.com');
      console.log('  Password: password123');
    } else {
      console.log('\n❌ La contraseña sigue sin funcionar');
      console.log('Hash en memoria:', admin.password.substring(0, 20) + '...');
      console.log('Hash generado:', newHash.substring(0, 20) + '...');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
};

fixPassword();
