const express = require('express');
const UserProfile = require('../models/UserProfile');
const { sendResponse } = require('../utils/response');
const { authenticateToken, validate } = require('../middleware/auth');
const validators = require('../validators/profile.validators');

const router = express.Router();

// ============================================================================
// RUTAS DE PERFILES
// ============================================================================

// Obtener mi perfil
router.get('/profiles/me', authenticateToken, async (req, res) => {
  try {
    const profile = await UserProfile.findOne({ user_id: req.user.user_id });
    
    if (!profile) {
      return sendResponse(res, false, null, 'Perfil no encontrado', 404);
    }

    sendResponse(res, true, profile);

  } catch (error) {
    console.error('Error obteniendo perfil:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Crear perfil
router.post('/profiles', authenticateToken, validate(validators.createProfile), async (req, res) => {
  try {
    // Verificar si ya existe un perfil
    const existingProfile = await UserProfile.findOne({ user_id: req.user.user_id });
    if (existingProfile) {
      return sendResponse(res, false, null, 'El usuario ya tiene un perfil', 409);
    }

    const profile = new UserProfile({
      ...req.body,
      user_id: req.user.user_id
    });

    await profile.save();

    sendResponse(res, true, profile, 'Perfil creado exitosamente', 201);

  } catch (error) {
    console.error('Error creando perfil:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Actualizar perfil
router.put('/profiles/:profile_id', authenticateToken, validate(validators.createProfile), async (req, res) => {
  try {
    const profile = await UserProfile.findOneAndUpdate(
      { 
        profile_id: req.params.profile_id, 
        user_id: req.user.user_id 
      },
      { 
        ...req.body,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!profile) {
      return sendResponse(res, false, null, 'Perfil no encontrado', 404);
    }

    sendResponse(res, true, profile, 'Perfil actualizado exitosamente');

  } catch (error) {
    console.error('Error actualizando perfil:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

module.exports = router;