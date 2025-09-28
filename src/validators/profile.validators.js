const Joi = require('joi');

const profileValidators = {
  createProfile: Joi.object({
    full_name: Joi.string().min(2).max(100).required(),
    phone: Joi.string().optional(),
    linkedin_url: Joi.string().uri().optional(),
    bio: Joi.string().max(500).optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    current_job_title: Joi.string().optional(),
    years_experience: Joi.number().min(0).max(50).optional(),
    industries: Joi.array().items(Joi.string()).optional(),
    work_modality_preferred: Joi.string().valid('remote', 'onsite', 'hybrid').optional(),
    salary_min: Joi.number().min(0).optional(),
    salary_max: Joi.number().min(0).optional(),
    salary_currency: Joi.string().length(3).optional()
  }),

  updateProfile: Joi.object({
    full_name: Joi.string().min(2).max(100).optional(),
    phone: Joi.string().optional(),
    linkedin_url: Joi.string().uri().optional(),
    bio: Joi.string().max(500).optional(),
    country: Joi.string().optional(),
    city: Joi.string().optional(),
    current_job_title: Joi.string().optional(),
    years_experience: Joi.number().min(0).max(50).optional(),
    industries: Joi.array().items(Joi.string()).optional(),
    work_modality_preferred: Joi.string().valid('remote', 'onsite', 'hybrid').optional(),
    salary_min: Joi.number().min(0).optional(),
    salary_max: Joi.number().min(0).optional(),
    salary_currency: Joi.string().length(3).optional()
  })
};

module.exports = profileValidators;