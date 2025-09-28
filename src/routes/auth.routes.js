const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');
const { sendResponse } = require('../utils/response');
const { authenticateToken, generateToken } = require('../middleware/auth');
const validate = require('../middleware/validation');
const validators = require('../validators/auth.validators');

const router = express.Router();

// ============================================================================
// RUTAS DE AUTENTICACIÓN
// ============================================================================

// Registro de usuario
router.post('/auth/register', validate(validators.registerUser), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendResponse(res, false, null, 'El email ya está registrado', 409);
    }

    // Hash de la contraseña
    const password_hash = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = new User({
      email,
      password_hash,
      auth_provider: 'local'
    });

    await user.save();

    // Generar token
    const token = generateToken(user);

    sendResponse(res, true, {
      user: {
        user_id: user.user_id,
        email: user.email,
        auth_provider: user.auth_provider,
        created_at: user.created_at
      },
      token
    }, 'Usuario registrado exitosamente', 201);

  } catch (error) {
    console.error('Error en registro:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Login de usuario
router.post('/auth/login', validate(validators.loginUser), async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ email });
    if (!user || !user.password_hash) {
      return sendResponse(res, false, null, 'Credenciales inválidas', 401);
    }

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return sendResponse(res, false, null, 'Credenciales inválidas', 401);
    }

    // Actualizar último login
    user.last_login = new Date();
    await user.save();

    // Generar token
    const token = generateToken(user);

    sendResponse(res, true, {
      user: {
        user_id: user.user_id,
        email: user.email,
        auth_provider: user.auth_provider,
        last_login: user.last_login
      },
      token
    }, 'Login exitoso');

  } catch (error) {
    console.error('Error en login:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Obtener usuario actual
router.get('/auth/me', authenticateToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user_id: req.user.user_id });

    sendResponse(res, true, {
      user: {
        user_id: req.user.user_id,
        email: req.user.email,
        auth_provider: req.user.auth_provider,
        last_login: req.user.last_login,
        created_at: req.user.created_at
      },
      profile: profile || null
    });

  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

module.exports = router;