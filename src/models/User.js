const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const userSchema = new mongoose.Schema({
  user_id: { 
    type: String, 
    default: () => uuidv4(),
    unique: true,
    index: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password_hash: String,
  auth_provider: {
    type: String,
    enum: ['local', 'google', 'linkedin', 'github'],
    default: 'local'
  },
  auth_provider_id: String,
  last_login: Date
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

module.exports = mongoose.model('User', userSchema);