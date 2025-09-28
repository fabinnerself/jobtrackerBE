const express = require('express');
const Job = require('../models/Job');
const UserProfile = require('../models/UserProfile');
const JobApplication = require('../models/JobApplication');
const { sendResponse } = require('../utils/response');
const { generateAIContent } = require('../utils/helpers');
const { authenticateToken, validate } = require('../middleware/auth');
const validators = require('../validators/ai.validators');

const router = express.Router();

// ============================================================================
// RUTAS DE GENERACIÓN CON IA
// ============================================================================

// Generar carta de presentación
router.post('/ai/generate-cover-letter', authenticateToken, validate(validators.generateDocument), async (req, res) => {
  try {
    const { job_id, tone = 'professional', language = 'es', additional_context = '' } = req.body;

    // Obtener datos del trabajo
    const job = await Job.findOne({ job_id });
    if (!job) {
      return sendResponse(res, false, null, 'Trabajo no encontrado', 404);
    }

    // Obtener perfil del usuario
    const profile = await UserProfile.findOne({ user_id: req.user.user_id });
    if (!profile) {
      return sendResponse(res, false, null, 'Perfil de usuario no encontrado', 404);
    }

    // Generar contenido con IA (simulado)
    const aiResult = await generateAIContent('cover_letter', job, profile, additional_context);

    // Opcional: Guardar en la aplicación si existe
    const application = await JobApplication.findOne({
      user_id: req.user.user_id,
      job_id
    });

    if (application) {
      application.cover_letter = aiResult.content;
      await application.save();
    }

    sendResponse(res, true, {
      cover_letter: aiResult.content,
      metadata: aiResult.metadata
    }, 'Carta de presentación generada exitosamente');

  } catch (error) {
    console.error('Error generando carta:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Generar mensaje frío
router.post('/ai/generate-cold-message', authenticateToken, validate(validators.generateDocument), async (req, res) => {
  try {
    const { job_id, tone = 'professional', language = 'es', additional_context = '' } = req.body;

    // Obtener datos del trabajo
    const job = await Job.findOne({ job_id });
    if (!job) {
      return sendResponse(res, false, null, 'Trabajo no encontrado', 404);
    }

    // Obtener perfil del usuario
    const profile = await UserProfile.findOne({ user_id: req.user.user_id });
    if (!profile) {
      return sendResponse(res, false, null, 'Perfil de usuario no encontrado', 404);
    }

    // Generar contenido con IA (simulado)
    const aiResult = await generateAIContent('cold_message', job, profile, additional_context);

    // Opcional: Guardar en la aplicación si existe
    const application = await JobApplication.findOne({
      user_id: req.user.user_id,
      job_id
    });

    if (application) {
      application.cold_message = aiResult.content;
      await application.save();
    }

    sendResponse(res, true, {
      cold_message: aiResult.content,
      metadata: aiResult.metadata
    }, 'Mensaje frío generado exitosamente');

  } catch (error) {
    console.error('Error generando mensaje:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

module.exports = router;