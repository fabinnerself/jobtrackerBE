// Importar todos los validadores
const authValidators = require('./auth.validators');
const profileValidators = require('./profile.validators');
const applicationValidators = require('./application.validators');
const aiValidators = require('./ai.validators');
const jobValidators = require('./job.validators');

// Exportar todo junto (para compatibilidad con código existente)
module.exports = {
  // Auth
  registerUser: authValidators.registerUser,
  loginUser: authValidators.loginUser,
  
  // Profile
  createProfile: profileValidators.createProfile,
  updateProfile: profileValidators.updateProfile,
  
  // Applications
  createApplication: applicationValidators.createApplication,
  updateApplication: applicationValidators.updateApplication,
  updateApplicationStatus: applicationValidators.updateApplicationStatus,
  
  // AI
  generateDocument: aiValidators.generateDocument,
  generateCoverLetter: aiValidators.generateCoverLetter,
  generateColdMessage: aiValidators.generateColdMessage,
  
  // Jobs
  searchJobs: jobValidators.searchJobs,

  // También exportar por módulos
  auth: authValidators,
  profile: profileValidators,
  application: applicationValidators,
  ai: aiValidators,
  job: jobValidators
};