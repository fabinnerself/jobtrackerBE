const express = require('express');
const Job = require('../models/Job');
const { sendResponse } = require('../utils/response');

const router = express.Router();

// ============================================================================
// RUTAS DE TRABAJOS
// ============================================================================

// Listar trabajos con filtros y paginación
router.get('/jobs', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Construir filtros
    let filters = { is_active: true };

    if (req.query.work_modality) {
      const modalities = req.query.work_modality.split(',');
      filters.work_modality = { $in: modalities };
    }

    if (req.query.seniority_level) {
      const levels = req.query.seniority_level.split(',');
      filters.seniority_level = { $in: levels };
    }

    if (req.query.salary_min) {
      filters.salary_min = { $gte: parseInt(req.query.salary_min) };
    }

    if (req.query.salary_max) {
      filters.salary_max = { $lte: parseInt(req.query.salary_max) };
    }

    if (req.query.country) {
      filters.country = new RegExp(req.query.country, 'i');
    }

    if (req.query.city) {
      filters.city = new RegExp(req.query.city, 'i');
    }

    // Búsqueda de texto
    if (req.query.search) {
      filters.$text = { $search: req.query.search };
    }

    // Ejecutar consulta
    const [jobs, total] = await Promise.all([
      Job.find(filters)
        .sort({ posted_date: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Job.countDocuments(filters)
    ]);

    const totalPages = Math.ceil(total / limit);

    sendResponse(res, true, jobs, null, 200, {
      pagination: {
        page,
        limit,
        total,
        total_pages: totalPages,
        has_next: page < totalPages,
        has_prev: page > 1
      },
      filters_applied: {
        ...(req.query.work_modality && { work_modality: req.query.work_modality.split(',') }),
        ...(req.query.seniority_level && { seniority_level: req.query.seniority_level.split(',') }),
        ...(req.query.salary_min && { salary_min: parseInt(req.query.salary_min) }),
        ...(req.query.search && { search: req.query.search })
      }
    });

  } catch (error) {
    console.error('Error obteniendo trabajos:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});
// Búsqueda de trabajos
router.get('/jobs/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q) {
      return sendResponse(res, false, null, 'Parámetro de búsqueda requerido', 400);
    }

    const jobs = await Job.find({
      $text: { $search: q },
      is_active: true
    })
    .sort({ score: { $meta: 'textScore' } })
    .limit(parseInt(limit))
    .lean();

    sendResponse(res, true, jobs);

  } catch (error) {
    console.error('Error en búsqueda:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Obtener detalle de trabajo

// Obtener detalle de trabajo
router.get('/jobs/:job_id', async (req, res) => {
  try {
    const job = await Job.findOne({ job_id: req.params.job_id }).lean();
    
    if (!job) {
      return sendResponse(res, false, null, 'Trabajo no encontrado', 404);
    }

    sendResponse(res, true, job);

  } catch (error) {
    console.error('Error obteniendo trabajo:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

module.exports = router;