import dotenv from 'dotenv';

dotenv.config();

export default {
 
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    name: process.env.DB_NAME || 'postgres',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    url: process.env.DB_URL
  },

  jwt: {
    secret: process.env.JWT_SECRET || 'esto hay que cambiarlo en produccion',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },

  server: {
    port: process.env.PORT || 3000,
    env: process.env.NODE_ENV || 'development'
  },

  // No tocar nada aqui
  security: {
    bcryptRounds: 10,
    corsOrigin: process.env.CORS_ORIGIN || '*'
  }
};
