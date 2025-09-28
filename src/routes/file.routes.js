// ============================================================================
// RUTAS DE ARCHIVOS ADJUNTOS
// ============================================================================

// Subir archivo a aplicación
app.post('/api/v1/applications/:application_id/attachments', 
  authenticateToken, 
  upload.single('file'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return sendResponse(res, false, null, 'No se proporcionó archivo', 400);
      }

      const application = await JobApplication.findOne({
        application_id: req.params.application_id,
        user_id: req.user.user_id
      });

      if (!application) {
        return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
      }

      // Crear objeto de archivo
      const attachment = {
        filename: `${uuidv4()}_${req.file.originalname}`,
        original_name: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
        uploaded_at: new Date()
      };

      // Agregar archivo a la aplicación
      application.attachments.push(attachment);
      await application.save();

      // Responder sin el buffer de datos (demasiado grande)
      const responseAttachment = {
        ...attachment,
        data: undefined
      };

      sendResponse(res, true, responseAttachment, 'Archivo subido exitosamente', 201);

    } catch (error) {
      console.error('Error subiendo archivo:', error);
      sendResponse(res, false, null, 'Error interno del servidor', 500);
    }
  }
);

// Listar archivos de una aplicación
app.get('/api/v1/applications/:application_id/attachments', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      application_id: req.params.application_id,
      user_id: req.user.user_id
    }).select('attachments');

    if (!application) {
      return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
    }

    // Omitir los datos del buffer en la respuesta
    const attachments = application.attachments.map(att => ({
      _id: att._id,
      filename: att.filename,
      original_name: att.original_name,
      mimetype: att.mimetype,
      size: att.size,
      uploaded_at: att.uploaded_at
    }));

    sendResponse(res, true, attachments);

  } catch (error) {
    console.error('Error obteniendo archivos:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Descargar archivo específico
app.get('/api/v1/applications/:application_id/attachments/:attachment_id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      application_id: req.params.application_id,
      user_id: req.user.user_id
    });

    if (!application) {
      return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
    }

    const attachment = application.attachments.id(req.params.attachment_id);
    if (!attachment) {
      return sendResponse(res, false, null, 'Archivo no encontrado', 404);
    }

    // Configurar headers para descarga
    res.set({
      'Content-Type': attachment.mimetype,
      'Content-Disposition': `attachment; filename="${attachment.original_name}"`,
      'Content-Length': attachment.size
    });

    // Enviar el buffer del archivo
    res.send(attachment.data);

  } catch (error) {
    console.error('Error descargando archivo:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});

// Eliminar archivo específico
app.delete('/api/v1/applications/:application_id/attachments/:attachment_id', authenticateToken, async (req, res) => {
  try {
    const application = await JobApplication.findOne({
      application_id: req.params.application_id,
      user_id: req.user.user_id
    });

    if (!application) {
      return sendResponse(res, false, null, 'Aplicación no encontrada', 404);
    }

    const attachment = application.attachments.id(req.params.attachment_id);
    if (!attachment) {
      return sendResponse(res, false, null, 'Archivo no encontrado', 404);
    }

    // Remover el archivo
    attachment.remove();
    await application.save();

    sendResponse(res, true, null, 'Archivo eliminado exitosamente');

  } catch (error) {
    console.error('Error eliminando archivo:', error);
    sendResponse(res, false, null, 'Error interno del servidor', 500);
  }
});
