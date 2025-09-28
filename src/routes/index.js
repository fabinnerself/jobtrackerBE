// ============================================================================
// RUTAS DE LA API
// ============================================================================

// Health Check
app.get('/api/v1/health', async (req, res) => {
  try {
    // Verificar conexión a MongoDB
    const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
    
    sendResponse(res, true, {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        api: 'running',
        mongodb: dbStatus,
        version: '1.0.0'
      }
    });
  } catch (error) {
    sendResponse(res, false, null, 'Health check failed', 500);
  }
});