const express = require('express');
const JobApplication = require('../models/JobApplication');
const { sendResponse } = require('../utils/response');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// ============================================================================
// RUTAS DE ANALYTICS
// ============================================================================

// Dashboard analytics
router.get('/analytics/dashboard', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;

    // Aggregation pipeline para obtener estadísticas
    const [statusBreakdown, recentActivity, topCompanies] = await Promise.all([
      // Breakdown por estado
      JobApplication.aggregate([
        { $match: { user_id: userId } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $project: { status: '$_id', count: 1, _id: 0 } }
      ]),
      
      // Actividad reciente
      JobApplication.aggregate([
        { $match: { user_id: userId } },
        {
          $facet: {
            last_7_days: [
              {
                $match: {
                  created_at: {
                    $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  }
                }
              },
              { $count: "count" }
            ],
            last_30_days: [
              {
                $match: {
                  created_at: {
                    $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                  }
                }
              },
              { $count: "count" }
            ],
            upcoming_interviews: [
              { $match: { status: 'interview' } },
              { $count: "count" }
            ]
          }
        }
      ]),
      
      // Top empresas
      JobApplication.aggregate([
        { $match: { user_id: userId } },
        {
          $lookup: {
            from: 'jobs',
            localField: 'job_id',
            foreignField: 'job_id',
            as: 'job'
          }
        },
        { $unwind: '$job' },
        {
          $group: {
            _id: '$job.company_name',
            applications: { $sum: 1 }
          }
        },
        { $sort: { applications: -1 } },
        { $limit: 5 },
        {
          $project: {
            company_name: '$_id',
            applications: 1,
            _id: 0
          }
        }
      ])
    ]);

    // Calcular métricas resumen
    const totalApplications = await JobApplication.countDocuments({ user_id: userId });
    const appliedApplications = await JobApplication.countDocuments({ 
      user_id: userId, 
      status: { $in: ['applied', 'interview', 'offer'] } 
    });

    const responseRate = totalApplications > 0 ? appliedApplications / totalApplications : 0;

    // Formatear respuesta
    const statusBreakdownFormatted = statusBreakdown.reduce((acc, item) => {
      acc[item.status] = item.count;
      return acc;
    }, {
      saved: 0,
      applied: 0,
      interview: 0,
      offer: 0,
      rejected: 0
    });

    const activityFormatted = {
      applications_last_7_days: recentActivity[0]?.last_7_days[0]?.count || 0,
      applications_last_30_days: recentActivity[0]?.last_30_days[0]?.count || 0,
      upcoming_interviews: recentActivity[0]?.upcoming_interviews[0]?.count || 0
    };

    sendResponse(res, true, {
      summary: {
        total_applications: totalApplications,
        active_applications: totalApplications - (statusBreakdownFormatted.rejected || 0),
        response_rate: Math.round(responseRate * 100) / 100,
        average_response_time_days: 5.2 // Mock data
      },
      status_breakdown: statusBreakdownFormatted,
      recent_activity: activityFormatted,
      top_companies: topCompanies
    });

  } catch (error) {
    console.error('Error obteniendo analytics:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Estadísticas detalladas de aplicaciones
router.get('/analytics/applications', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id;
    
    // Pipeline de aggregation para estadísticas detalladas
    const stats = await JobApplication.aggregate([
      { $match: { user_id: userId } },
      {
        $lookup: {
          from: 'jobs',
          localField: 'job_id',
          foreignField: 'job_id',
          as: 'job'
        }
      },
      { $unwind: '$job' },
      {
        $facet: {
          by_work_modality: [
            {
              $group: {
                _id: '$job.work_modality',
                count: { $sum: 1 },
                avg_salary: { $avg: '$job.salary_min' }
              }
            }
          ],
          by_seniority: [
            {
              $group: {
                _id: '$job.seniority_level',
                count: { $sum: 1 }
              }
            }
          ],
          by_month: [
            {
              $group: {
                _id: {
                  year: { $year: '$created_at' },
                  month: { $month: '$created_at' }
                },
                count: { $sum: 1 }
              }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
          ],
          success_rate: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                successful: {
                  $sum: {
                    $cond: [
                      { $in: ['$status', ['interview', 'offer']] },
                      1,
                      0
                    ]
                  }
                }
              }
            }
          ]
        }
      }
    ]);

    sendResponse(res, true, {
      by_work_modality: stats[0].by_work_modality,
      by_seniority: stats[0].by_seniority,
      by_month: stats[0].by_month,
      success_rate: stats[0].success_rate[0] || { total: 0, successful: 0 }
    });

  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

module.exports = router;