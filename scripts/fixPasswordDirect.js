import sequelize from '../src/config/database.js';
import bcrypt from 'bcryptjs';

const fixPasswordDirect = async () => {
  try {
    console.log('🔧 Corrigiendo contraseña del admin directamente en la DB...');
    
    // Generar nuevo hash para 'password123'
    const newPassword = 'password123';
    const newHash = await bcrypt.hash(newPassword, 10);
    
    console.log('🔑 Nueva contraseña:', newPassword);
    console.log('🔐 Nuevo hash:', newHash.substring(0, 20) + '...');
    
    // Actualizar directamente en la base de datos usando SQL
    const [updatedRows] = await sequelize.query(
      'UPDATE users SET password = ?, "updatedAt" = NOW() WHERE email = ?',
      {
        replacements: [newHash, 'admin@colegio.com'],
        type: sequelize.QueryTypes.UPDATE
      }
    );
    
    console.log('✅ Filas actualizadas:', updatedRows);
    
    // Verificar que se actualizó correctamente
    const [admin] = await sequelize.query(
      'SELECT password FROM users WHERE email = ?',
      {
        replacements: ['admin@colegio.com'],
        type: sequelize.QueryTypes.SELECT
      }
    );
    
    if (admin) {
      console.log('✅ Contraseña actualizada en la base de datos');
      console.log('Hash en DB:', admin.password.substring(0, 20) + '...');
      
      // Verificar que funciona
      const isValid = await bcrypt.compare(newPassword, admin.password);
      console.log('✅ Verificación de nueva contraseña:', isValid);
      
      if (isValid) {
        console.log('\n🎉 ¡Contraseña corregida exitosamente!');
        console.log('Ahora puedes hacer login con:');
        console.log('  Email: admin@colegio.com');
        console.log('  Password: password123');
      } else {
        console.log('\n❌ La contraseña sigue sin funcionar');
      }
    } else {
      console.log('❌ No se pudo verificar la actualización');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await sequelize.close();
  }
};

fixPasswordDirect();
