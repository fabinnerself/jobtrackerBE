const Joi = require('joi');

const jobValidators = {
  searchJobs: Joi.object({
    q: Joi.string().min(2).max(100).optional(),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    work_modality: Joi.string().valid('remote', 'onsite', 'hybrid').optional(),
    seniority_level: Joi.string().valid('junior', 'mid', 'senior').optional(),
    salary_min: Joi.number().min(0).optional(),
    salary_max: Joi.number().min(0).optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional()
  })
};

module.exports = jobValidators;