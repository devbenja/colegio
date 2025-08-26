require('dotenv').config();

module.exports = {
  // Configuración de la base de datos
  database: {
    host: process.env.DB_HOST || 'db.supabase.co',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    url: process.env.DB_URL
  },

  // Configuración de JWT
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  // Configuración del servidor
  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // Configuración de seguridad
  security: {
    bcryptRounds: 10,
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
};
