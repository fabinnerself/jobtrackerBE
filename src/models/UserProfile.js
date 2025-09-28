const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userProfileSchema = new mongoose.Schema({
  profile_id: { 
    type: String, 
    default: () => uuidv4(),
    unique: true,
    index: true
  },
  user_id: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  full_name: { type: String, required: true },
  phone: String,
  linkedin_url: String,
  bio: { type: String, maxLength: 500 },
  
  // Ubicación
  country: String,
  city: String,
  timezone: String,
  
  // Información profesional
  current_job_title: String,
  years_experience: Number,
  industries: [String],
  work_modality_preferred: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid']
  },
  
  // Preferencias salariales
  salary_min: Number,
  salary_max: Number,
  salary_currency: { type: String, default: 'USD' }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('UserProfile', userProfileSchema);