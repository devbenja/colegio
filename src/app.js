import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();

import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

import sequelize from './config/database.js';
import { setupAssociations } from './config/associations.js';
import authRoutes from './routes/authRoutes.js';
import testRoutes from './routes/testRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import teacherRoutes from './routes/teacherRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de seguridad
app.use(helmet());

// Middleware de CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  credentials: true
}));

// Middleware para parsear cookies
app.use(cookieParser());

// Middleware para parsear JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/test', testRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/teacher', teacherRoutes);

// Ruta de prueba principal
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Gestión Escolar',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      test: '/api/test',
      admin: '/api/admin',
      student: '/api/student',
      teacher: '/api/teacher'
    }
  });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor'
  });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Función para sincronizar la base de datos y iniciar el servidor
async function startServer() {
  try {
    // Configurar las asociaciones entre modelos
    setupAssociations();
    console.log('✅ Asociaciones configuradas');
    
    // Sincronizar modelos con la base de datos
    await sequelize.sync({ force: false });
    console.log('✅ Base de datos sincronizada');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📚 API del Sistema de Gestión Escolar`);
      console.log(`🔐 Endpoints de autenticación: /api/auth`);
      console.log(`🧪 Endpoints de prueba: /api/test`);
      console.log(`👨‍💼 Endpoints de administración: /api/admin`);
      console.log(`👨‍🎓 Endpoints de estudiantes: /api/student`);
      console.log(`👨‍🏫 Endpoints de profesores: /api/teacher`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
}

// Manejar señales de terminación
process.on('SIGINT', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Cerrando servidor...');
  await sequelize.close();
  process.exit(0);
});

// Iniciar servidor
startServer();
