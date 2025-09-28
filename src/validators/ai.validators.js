const Joi = require('joi');

const aiValidators = {
  generateDocument: Joi.object({
    job_id: Joi.string().required(),
    type: Joi.string().valid('cover_letter', 'cold_message').required(),
    tone: Joi.string().valid('professional', 'casual', 'enthusiastic').optional(),
    language: Joi.string().valid('es', 'en').optional(),
    additional_context: Joi.string().max(500).optional()
  }),

  generateCoverLetter: Joi.object({
    job_id: Joi.string().required(),
    tone: Joi.string().valid('professional', 'casual', 'enthusiastic').default('professional'),
    language: Joi.string().valid('es', 'en').default('es'),
    additional_context: Joi.string().max(500).optional()
  }),

  generateColdMessage: Joi.object({
    job_id: Joi.string().required(),
    tone: Joi.string().valid('professional', 'casual', 'enthusiastic').default('professional'),
    language: Joi.string().valid('es', 'en').default('es'),
    additional_context: Joi.string().max(500).optional()
  })
};

module.exports = aiValidators;