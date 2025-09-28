const jwt = require('jsonwebtoken');
const User = require('../models/User');

// ============================================================================
// MIDDLEWARE DE AUTENTICACIÓN
// ============================================================================

const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '24h' }
  );
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'Token de acceso requerido',
      code: 401
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');
    const user = await User.findOne({ user_id: decoded.user_id });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Usuario no encontrado',
        code: 401
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: 'Token inválido',
      code: 403
    });
  }
};

// Middleware de validación
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({
        success: false,
        error: 'Error de validación',
        code: 422,
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      });
    }
    next();
  };
};

module.exports = { authenticateToken, validate, generateToken };