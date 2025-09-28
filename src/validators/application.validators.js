const Joi = require('joi');

const applicationValidators = {
  createApplication: Joi.object({
    job_id: Joi.string().required(),
    status: Joi.string().valid('saved', 'applied', 'interview', 'offer', 'rejected').optional(),
    personal_notes: Joi.string().max(1000).optional(),
    applied_date: Joi.date().optional()
  }),
  
  updateApplication: Joi.object({
    job_id: Joi.string().optional(),
    status: Joi.string().valid('saved', 'applied', 'interview', 'offer', 'rejected').optional(),
    personal_notes: Joi.string().max(1000).optional(),
    applied_date: Joi.date().optional()
  }),
  
  updateApplicationStatus: Joi.object({
    status: Joi.string().valid('saved', 'applied', 'interview', 'offer', 'rejected').required()
  })
};

module.exports = applicationValidators;