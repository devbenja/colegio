import axios from 'axios';

const testTeacherLogin = async () => {
  try {
    console.log('🔐 Probando login de profesor...');
    
    // Probar login con profesor
    console.log('\n📧 Probando login con prof1@colegio.com...');
    const response = await axios.post('http://localhost:3000/api/auth/login', {
      email: 'prof1@colegio.com',
      password: 'password123'
    });
    
    console.log('✅ Respuesta del backend:');
    console.log('Status:', response.status);
    console.log('Success:', response.data.success);
    console.log('Message:', response.data.message);
    
    if (response.data.success) {
      console.log('✅ Login exitoso!');
      console.log('User:', response.data.data.user.email);
      console.log('Role:', response.data.data.user.role);
      console.log('Nombre:', response.data.data.user.nombre);
      console.log('Apellido:', response.data.data.user.apellido);
      console.log('Token recibido:', response.data.data.token ? 'SÍ' : 'NO');
    } else {
      console.log('❌ Login falló');
      console.log('Error:', response.data.message);
    }
    
  } catch (error) {
    console.error('❌ Error en la petición:');
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', error.response.data);
      console.log('Message:', error.response.data.message);
    } else if (error.request) {
      console.log('❌ No se recibió respuesta del servidor');
    } else {
      console.log('❌ Error:', error.message);
    }
  }
};

testTeacherLogin();
