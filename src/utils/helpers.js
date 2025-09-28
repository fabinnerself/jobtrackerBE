// Generar token JWT
const generateToken = (user) => {
  return jwt.sign(
    { user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '7d' }
  );
};

// Respuesta estándar
const sendResponse = (res, success, data = null, message = null, code = 200, meta = null) => {
  const response = {
    success,
    ...(data && { data }),
    ...(message && { message }),
    ...(meta && { meta }),
    timestamp: new Date().toISOString()
  };
  
  res.status(code).json(response);
};

// Simulador de IA para generación de documentos
const generateAIContent = async (type, jobData, profileData, additionalContext = '') => {
  // Simulación de llamada a OpenAI API
  const templates = {
    cover_letter: `Estimado equipo de ${jobData.company_name},

Me dirijo a ustedes con gran interés en la posición de ${jobData.job_title} que han publicado.

Con ${profileData.years_experience || 2} años de experiencia en ${profileData.industries?.join(', ') || 'tecnología'}, considero que mi perfil se alinea perfectamente con los requisitos del puesto.

${additionalContext}

Mi experiencia incluye trabajo en modalidad ${profileData.work_modality_preferred || 'remota'}, lo cual me ha permitido desarrollar habilidades de comunicación efectiva y gestión autónoma del tiempo.

Estaría encantado/a de discutir cómo puedo contribuir al crecimiento de ${jobData.company_name}.

Atentamente,
${profileData.full_name}`,

    cold_message: `Hola,

Espero que se encuentren bien. Mi nombre es ${profileData.full_name} y me pongo en contacto porque he visto la oportunidad de ${jobData.job_title} en ${jobData.company_name}.

${additionalContext}

Con mi experiencia en ${profileData.industries?.join(', ') || 'el sector'}, creo que podría aportar valor significativo a su equipo.

¿Sería posible agendar una breve conversación para conocer más sobre esta oportunidad?

Saludos,
${profileData.full_name}`
  };

  return {
    content: templates[type] || 'Contenido generado por IA',
    metadata: {
      tokens_used: Math.floor(Math.random() * 500) + 200,
      model: 'gpt-3.5-turbo',
      generation_time_ms: Math.floor(Math.random() * 3000) + 1000
    }
  };
};

module.exports = {
 generateToken,
 sendResponse,
 generateAIContent
};