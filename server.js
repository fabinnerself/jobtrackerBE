// ============================================================================
// INICIALIZACIÓN DEL SERVIDOR
// ============================================================================

const mongoose = require('mongoose');
const app = require('./src/app');
const environment = require('./src/config/environment');
const { connectDB } = require('./src/config/database');
const { createMockData } = require('./src/utils/mockData');

const startServer = async () => {
  try {
    // Conectar a MongoDB
    await connectDB();
    
    // Crear datos mock para desarrollo
    if (environment.NODE_ENV !== 'production') {
      await createMockData();
    }
    
    // Iniciar servidor
    app.listen(environment.PORT, '0.0.0.0', () => {
      console.log(`🚀 Servidor iniciado en puerto ${environment.PORT}`);
      console.log(`📱 Ambiente: ${environment.NODE_ENV}`);
      console.log(`🌐 Health check: http://localhost:${environment.PORT}/api/v1/health`);
      //console.log(`server: ${environment.MONGODB_URI}`);

      
      if (environment.NODE_ENV !== 'production') {
        console.log(`📚 Datos mock disponibles`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error iniciando servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGTERM', async () => {
  console.log('📴 SIGTERM recibido. Cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📴 SIGINT recibido. Cerrando servidor...');
  await mongoose.connection.close();
  process.exit(0);
});

// Iniciar el servidor
if (require.main === module) {
  startServer();
}

module.exports = app;