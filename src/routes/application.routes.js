const express = require('express');
const JobApplication = require('../models/JobApplication');
const Job = require('../models/Job');
const { sendResponse } = require('../utils/response');
const { authenticateToken, validate } = require('../middleware/auth');
const validators = require('../validators/application.validators');

const router = express.Router();

// ============================================================================
// RUTAS DE APLICACIONES
// ============================================================================

// Obtener mis aplicaciones
router.get('/applications', authenticateToken, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filters = { user_id: req.user.user_id };

    if (req.query.status) {
      const statuses = req.query.status.split(',');
      filters.status = { $in: statuses };
    }

    const [applications, total] = await Promise.all([
      JobApplication.aggregate([
        { $match: filters },
        {
          $lookup: {
            from: 'jobs',
            localField: 'job_id',
            foreignField: 'job_id',
            as: 'job'
          }
        },
        { $unwind: '$job' },
        { $sort: { updated_at: -1 } },
        { $skip: skip },
        { $limit: limit }
      ]),
      JobApplication.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / limit);

    sendResponse(res, true, applications, null, 200, {
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      }
    });

  } catch (error) {
    console.error('Error obteniendo aplicaciones:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Obtener detalle de aplicación
router.get('/applications/:application_id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.aggregate([
      { 
        $match: { 
          application_id: req.params.application_id,
          user_id: req.user.user_id
        } 
      },
      {
        $lookup: {
          from: 'jobs',
          localField: 'job_id',
          foreignField: 'job_id',
          as: 'job'
        }
      },
      { $unwind: '$job' }
    ]);

    if (!application || application.length === 0) {
      return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
    }

    sendResponse(res, true, application[0]);

  } catch (error) {
    console.error('Error obteniendo aplicación:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Crear nueva aplicación
router.post('/applications', authenticateToken, validate(validators.createApplication), async (req, res) => {
  try {
    const { job_id, status = 'saved', personal_notes, applied_date } = req.body;

    // Verificar si el trabajo existe
    const job = await Job.findOne({ job_id });
    if (!job) {
      return sendResponse(res, false, null, 'Trabajo no encontrado', 404);
    }

    // Verificar si ya existe una aplicación para este trabajo
    const existingApplication = await JobApplication.findOne({
      user_id: req.user.user_id,
      job_id
    });

    if (existingApplication) {
      return sendResponse(res, false, null, 'Ya existe una aplicación para este trabajo', 409, {
        job_id,
        existing_application_id: existingApplication.application_id
      });
    }

    // Crear nueva aplicación
    const application = new JobApplication({
      user_id: req.user.user_id,
      job_id,
      status,
      personal_notes,
      applied_date: applied_date ? new Date(applied_date) : (status === 'applied' ? new Date() : null)
    });

    await application.save();

    sendResponse(res, true, application, 'Aplicación creada exitosamente', 201);

  } catch (error) {
    console.error('Error creando aplicación:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Actualizar aplicación
router.put('/applications/:application_id', authenticateToken, validate(validators.createApplication), async (req, res) => {
  try {
    const application = await JobApplication.findOneAndUpdate(
      {
        application_id: req.params.application_id,
        user_id: req.user.user_id
      },
      {
        ...req.body,
        updated_at: new Date()
      },
      { new: true, runValidators: true }
    );

    if (!application) {
      return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
    }

    sendResponse(res, true, application, 'Aplicación actualizada exitosamente');

  } catch (error) {
    console.error('Error actualizando aplicación:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Cambiar solo estado de aplicación
router.patch('/applications/:application_id/status', authenticateToken, validate(validators.updateApplicationStatus), async (req, res) => {
  try {
    const { status } = req.body;
    
    const updateData = {
      status,
      updated_at: new Date()
    };

    // Si el estado cambia a "applied" y no tiene applied_date, establecerlo
    if (status === 'applied') {
      updateData.applied_date = new Date();
    }

    const application = await JobApplication.findOneAndUpdate(
      {
        application_id: req.params.application_id,
        user_id: req.user.user_id
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!application) {
      return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
    }

    sendResponse(res, true, application, 'Estado actualizado exitosamente');

  } catch (error) {
    console.error('Error actualizando estado:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Eliminar aplicación
router.delete('/applications/:application_id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOneAndDelete({
      application_id: req.params.application_id,
      user_id: req.user.user_id
    });

    if (!application) {
      return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
    }

    sendResponse(res, true, null, 'Aplicación eliminada exitosamente');

  } catch (error) {
    console.error('Error eliminando aplicación:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

module.exports = router;