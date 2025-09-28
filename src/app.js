const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const Joi = require('joi');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const compression = require('compression');
const environment = require('./config/environment');
const authRoutes = require('./routes/auth.routes');
const jobRoutes = require('./routes/job.routes');
const applicationRoutes = require('./routes/application.routes');
const profileRoutes = require('./routes/profile.routes');
// const fileRoutes = require('./routes/file.routes');
const analyticsRoutes = require('./routes/analytics.routes');
const aiRoutes = require('./routes/ai.routes');

// ============================================================================
// CONFIGURACIÓN INICIAL
// ============================================================================

const app = express();

// Middlewares básicos
app.use(helmet());
app.use(compression());

// app.use(cors({
//   origin: environment.FRONTEND_URL,
//   credentials: true
// }));

const allowedOrigins = environment.FRONTEND_URL.split(',').map(url => url.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: environment.RATE_LIMIT.windowMs,
  max: environment.RATE_LIMIT.max
});
app.use('/api/', limiter);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: environment.NODE_ENV
    }
  });
});

// Configuración de multer para archivos
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB límite
  },
  fileFilter: (req, file, cb) => {
    // Permitir solo ciertos tipos de archivo
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Tipo de archivo no permitido'));
    }
  }
});


// ============================================================================
// RUTAS DE LA API
// ============================================================================

app.use('/api/v1', authRoutes);
app.use('/api/v1', jobRoutes);
app.use('/api/v1', applicationRoutes);
app.use('/api/v1', profileRoutes);
// app.use('/api/v1', fileRoutes);
app.use('/api/v1', analyticsRoutes);
app.use('/api/v1', aiRoutes);

module.exports = app;