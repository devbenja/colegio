const sequelize = require('../src/config/database');

(async () => {
  try {
    console.log('Probando conexión a la base de datos...');
    await sequelize.authenticate();
    console.log('✅ Conexión exitosa.');

    const [results] = await sequelize.query("SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name");
    console.log('Tablas en el esquema public:');
    if (results && Array.isArray(results)) {
      for (const row of results) {
        console.log('- ' + row);
      }
    } else {
      console.log('No hay tablas o formato inesperado de resultados');
    }
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
})();
