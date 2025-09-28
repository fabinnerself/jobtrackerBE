const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const jobSchema = new mongoose.Schema({
  job_id: { 
    type: String, 
    default: () => uuidv4(),
    unique: true,
    index: true
  },
  job_title: { type: String, required: true },
  company_name: { type: String, required: true },
  job_description: String,
  job_url: String,
  
  // Ubicación y Modalidad
  country: String,
  city: String,
  timezone: String,
  work_modality: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid']
  },
  
  // Compensación
  salary_min: Number,
  salary_max: Number,
  salary_currency: { type: String, default: 'USD' },
  
  // Detalles
  employment_type: {
    type: String,
    enum: ['full_time', 'part_time', 'contract']
  },
  seniority_level: {
    type: String,
    enum: ['junior', 'mid', 'senior']
  },
  
  is_active: { type: Boolean, default: true },
  is_mock_data: { type: Boolean, default: true },
  posted_date: { type: Date, default: Date.now }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Índice de texto para búsqueda
jobSchema.index({ 
  job_title: 'text', 
  company_name: 'text', 
  job_description: 'text' 
});

module.exports = mongoose.model('Job', jobSchema);