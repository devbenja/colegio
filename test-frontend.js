import axios from 'axios';

// Configurar axios para usar cookies
const axiosInstance = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:3000'
});

async function testBackend() {
  try {
    console.log('🧪 Probando conexión al backend...');
    
    // Probar endpoint principal
    const mainResponse = await axiosInstance.get('/');
    console.log('✅ Endpoint principal:', mainResponse.data.message);
    
    // Probar login
    console.log('\n🔐 Probando login...');
    const loginResponse = await axiosInstance.post('/api/auth/login', {
      email: 'admin@colegio.com',
      password: 'password123'
    });
    
          if (loginResponse.data.success) {
        console.log('✅ Login exitoso para:', loginResponse.data.data.user.email);
        console.log('✅ Token enviado en cookies (HTTP-only)');
        
        // Probar endpoint de perfil
        console.log('\n👤 Probando endpoint de perfil...');
        const profileResponse = await axiosInstance.get('/api/auth/profile');
        
        if (profileResponse.data.success) {
          console.log('✅ Perfil obtenido:', profileResponse.data.data.email);
          console.log('✅ Role:', profileResponse.data.data.role);
        } else {
          console.log('❌ Error al obtener perfil:', profileResponse.data.message);
        }
        
      } else {
        console.log('❌ Error en login:', loginResponse.data.message);
      }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ No se puede conectar al backend. Asegúrate de que esté ejecutándose en el puerto 3000.');
    } else {
      console.log('❌ Error:', error.response?.data?.message || error.message);
    }
  }
}

testBackend();
