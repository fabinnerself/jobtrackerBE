// ============================================================================
// MIDDLEWARE DE MANEJO DE ERRORES
// ============================================================================

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
  sendResponse(res, false, null, `Ruta ${req.method} ${req.originalUrl} no encontrada`, 404);
});

// Middleware global de manejo de errores
app.use((error, req, res, next) => {
  console.error('Error no manejado:', error);
  
  // Error de validación de Mongoose
  if (error.name === 'ValidationError') {
    const errors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    return sendResponse(res, false, null, 'Error de validación', 422, { errors });
  }
  
  // Error de duplicado de MongoDB
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return sendResponse(res, false, null, `${field} ya existe`, 409);
  }
  
  // Error de JWT
  if (error.name === 'JsonWebTokenError') {
    return sendResponse(res, false, null, 'Token inválido', 401);
  }
  
  // Error de Multer
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return sendResponse(res, false, null, 'Archivo demasiado grande (máximo 5MB)', 400);
    }
    return sendResponse(res, false, null, 'Error subiendo archivo', 400);
  }

  // Error genérico
  sendResponse(res, false, null, 'Error interno del servidor', 500);
});