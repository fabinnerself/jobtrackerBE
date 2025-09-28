const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const jobApplicationSchema = new mongoose.Schema({
  application_id: { 
    type: String, 
    default: () => uuidv4(),
    unique: true,
    index: true
  },
  user_id: { 
    type: String, 
    required: true,
    index: true
  },
  job_id: { 
    type: String, 
    required: true,
    index: true
  },
  
  status: {
    type: String,
    enum: ['saved', 'applied', 'interview', 'offer', 'rejected'],
    default: 'saved'
  },
  
  applied_date: Date,
  personal_notes: String,
  
  // Documentos generados
  cover_letter: String,
  cold_message: String,
  
  // Archivos adjuntos
  attachments: [{
    filename: String,
    original_name: String,
    mimetype: String,
    size: Number,
    data: Buffer, // Para almacenar el archivo en MongoDB
    uploaded_at: { type: Date, default: Date.now }
  }]
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

// Índice compuesto único para evitar aplicaciones duplicadas
jobApplicationSchema.index({ user_id: 1, job_id: 1 }, { unique: true });

module.exports = mongoose.model('JobApplication', jobApplicationSchema);