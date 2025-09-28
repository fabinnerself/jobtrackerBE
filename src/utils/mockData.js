
const Job = require('../models/Job');

// ============================================================================
// DATOS MOCK PARA DESARROLLO
// ============================================================================

const createMockData = async () => {
  try {
    // Verificar si ya existen datos mock
    const existingJobs = await Job.countDocuments({ is_mock_data: true });
    if (existingJobs > 0) {
      console.log('✅ Datos mock ya existen');
      return;
    }

    const mockJobs = [
      {
        job_title: 'Frontend Developer',
        company_name: 'TechCorp',
        job_description: 'Buscamos desarrollador React con experiencia en TypeScript y Next.js',
        city: 'Madrid',
        country: 'España',
        work_modality: 'remote',
        salary_min: 45000,
        salary_max: 65000,
        salary_currency: 'EUR',
        employment_type: 'full_time',
        seniority_level: 'mid'
      },
      {
        job_title: 'Backend Developer',
        company_name: 'StartupXYZ',
        job_description: 'Node.js developer para API RESTful con MongoDB',
        city: 'Barcelona',
        country: 'España',
        work_modality: 'hybrid',
        salary_min: 50000,
        salary_max: 70000,
        salary_currency: 'EUR',
        employment_type: 'full_time',
        seniority_level: 'senior'
      },
      {
        job_title: 'Full Stack Developer',
        company_name: 'InnovaTech',
        job_description: 'MERN Stack developer para aplicación de e-commerce',
        city: 'Remote',
        country: 'Global',
        work_modality: 'remote',
        salary_min: 40000,
        salary_max: 60000,
        salary_currency: 'USD',
        employment_type: 'full_time',
        seniority_level: 'mid'
      }
    ];

    await Job.insertMany(mockJobs);
    console.log('✅ Datos mock creados exitosamente');
  } catch (error) {
    console.error('❌ Error creando datos mock:', error);
  }
};

module.exports = { createMockData };