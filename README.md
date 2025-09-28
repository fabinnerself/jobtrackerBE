# 🚀 JobSeeker AI Tracker - API RESTful

API backend completa para gestión de búsqueda laboral con inteligencia artificial, desarrollada con Node.js, Express y MongoDB.

🔗 Rutas disponibles

Recurso	URL Base: 	https://jobtrackerbe.onrender.com/


## 📋 Características Principales

- ✅ **CRUD completo** para perfiles, aplicaciones y documentos
- ✅ **Autenticación JWT** segura
- ✅ **Gestión de archivos** adjuntos (PDF, DOC, imágenes)
- ✅ **Generación con IA** para cartas de presentación y mensajes
- ✅ **Analytics avanzados** con dashboard
- ✅ **Paginación y filtros** inteligentes
- ✅ **Validaciones robustas** con Joi
- ✅ **Rate limiting** y seguridad
- ✅ **Compatible con MongoDB Atlas** (nube)
- ✅ **Deploy en Render** con un click

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Node.js** | 18+ | Runtime JavaScript |
| **Express** | 4.18+ | Framework web |
| **MongoDB** | 6+ | Base de datos NoSQL |
| **Mongoose** | 7.5+ | ODM para MongoDB |
| **JWT** | 9.0+ | Autenticación |
| **Multer** | 1.4+ | Manejo de archivos |
| **Joi** | 17.9+ | Validación de esquemas |
| **Bcrypt** | 2.4+ | Hash de contraseñas |

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+ instalado
- MongoDB local O cuenta en MongoDB Atlas
- Git (opcional)

### 1. Clonar el proyecto
```bash
git clone <tu-repo>
cd jobseeker-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` en la raíz:

```env
# Base de datos
MONGODB_URI=mongodb://localhost:27017/jobseeker
MONGODB_URI_PROD=mongodb+srv://username:password@cluster.mongodb.net/jobseeker?retryWrites=true&w=majority

# Autenticación
JWT_SECRET=tu-secreto-super-seguro-aqui-min-32-chars

# Servidor
PORT=3000
NODE_ENV=development

# CORS (opcional)
FRONTEND_URL=http://localhost:3000

# Timezone
TZ=America/La_Paz
```

### 4. Ejecutar en desarrollo
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### 5. Verificar instalación
```bash
curl http://localhost:3000/api/v1/health
```

**Respuesta esperada:**
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "services": {
      "api": "running",
      "mongodb": "connected",
      "version": "1.0.0"
    }
  }
}
```

## 📊 Configuración de MongoDB Atlas (Recomendado)

### Paso 1: Crear cuenta en MongoDB Atlas
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (M0 Sandbox - Gratis)

### Paso 2: Configurar acceso
1. **Database Access**: Crea un usuario con permisos de lectura/escritura
2. **Network Access**: Agrega `0.0.0.0/0` (permitir todas las IPs)
3. **Connect**: Copia la URI de conexión

### Paso 3: Actualizar .env
```env
MONGODB_URI=mongodb+srv://tu-usuario:tu-password@cluster0.xxxxx.mongodb.net/jobseeker?retryWrites=true&w=majority
```

## 🐳 Docker (Opcional)

### Dockerfile
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm ci --only=production

# Copiar código
COPY server.js ./

# Crear usuario no-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001
USER nodejs

EXPOSE 3000

CMD ["node", "server.js"]
```

### docker-compose.yml
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - MONGODB_URI=mongodb://mongo:27017/jobseeker
      - JWT_SECRET=dev-secret
    depends_on:
      - mongo

  mongo:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

### Ejecutar con Docker
```bash
docker-compose up -d
```

## ☁️ Deploy en Render

### Método 1: Deploy directo desde GitHub

1. **Fork/Push** tu código a GitHub
2. Ve a [Render](https://render.com)
3. **New Web Service** → Conecta tu repo
4. **Configuración**:
   - **Name**: `jobseeker-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

### Método 2: render.yaml (Infraestructura como código)

Crea `render.yaml` en la raíz:

```yaml
services:
  - type: web
    name: jobseeker-api
    runtime: docker
    plan: free
    buildCommand: npm install
    startCommand: node server.js
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: jobseeker-db
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: PORT
        value: 3000

databases:
  - name: jobseeker-db
    databaseName: jobseeker
    plan: free
```

### Variables de Entorno en Render
```
MONGODB_URI = tu-mongodb-atlas-uri
JWT_SECRET = tu-secreto-super-seguro
NODE_ENV = production
PORT = 3000
```

## 📚 Documentación de la API

### Base URL
- **Desarrollo**: `http://localhost:3000/api/v1`
- **Producción**: `https://tu-app.onrender.com/api/v1`

### Autenticación
Todas las rutas protegidas requieren el header:
```
Authorization: Bearer <jwt-token>
```

### 🔐 Endpoints de Autenticación

#### Registro de Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "mi-password-seguro"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "usuario@ejemplo.com",
      "auth_provider": "local"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Usuario registrado exitosamente"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@ejemplo.com",
  "password": "mi-password-seguro"
}
```

#### Usuario Actual
```http
GET /auth/me
Authorization: Bearer <token>
```

### 👤 Endpoints de Perfiles

#### Crear Perfil
```http
POST /profiles
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Juan Pérez",
  "phone": "+591 70000000",
  "linkedin_url": "https://linkedin.com/in/juan-perez",
  "bio": "Desarrollador Full Stack con 5 años de experiencia",
  "country": "Bolivia",
  "city": "La Paz",
  "current_job_title": "Senior Developer",
  "years_experience": 5,
  "industries": ["Tecnología", "Fintech"],
  "work_modality_preferred": "remote",
  "salary_min": 50000,
  "salary_max": 80000,
  "salary_currency": "USD"
}
```

#### Obtener Mi Perfil
```http
GET /profiles/me
Authorization: Bearer <token>
```

#### Actualizar Perfil
```http
PUT /profiles/{profile_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "full_name": "Juan Carlos Pérez",
  "years_experience": 6
}
```

### 💼 Endpoints de Trabajos

#### Listar Trabajos (con filtros y paginación)
```http
GET /jobs?page=1&limit=10&work_modality=remote,hybrid&seniority_level=mid,senior&salary_min=40000&search=developer
```

**Parámetros de consulta:**
- `page`: Número de página (default: 1)
- `limit`: Items por página (default: 20)
- `work_modality`: Filtrar por modalidad (`remote`, `onsite`, `hybrid`)
- `seniority_level`: Filtrar por nivel (`junior`, `mid`, `senior`)
- `salary_min`: Salario mínimo
- `salary_max`: Salario máximo
- `country`: Filtrar por país
- `city`: Filtrar por ciudad
- `search`: Búsqueda de texto libre

**Respuesta:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "65a1b2c3d4e5f6a1b2c3d4e5",
      "job_id": "550e8400-e29b-41d4-a716-446655440000",
      "job_title": "Frontend Developer",
      "company_name": "TechCorp",
      "job_description": "Buscamos desarrollador React...",
      "city": "Madrid",
      "country": "España",
      "work_modality": "remote",
      "salary_min": 45000,
      "salary_max": 65000,
      "salary_currency": "EUR",
      "employment_type": "full_time",
      "seniority_level": "mid",
      "posted_date": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 150,
      "total_pages": 15,
      "has_next": true,
      "has_prev": false
    }
  }
}
```

#### Obtener Trabajo Específico
```http
GET /jobs/{job_id}
```

#### Búsqueda de Texto
```http
GET /jobs/search?q=react developer&limit=5
```

### 📝 Endpoints de Aplicaciones

#### Crear Aplicación
```http
POST /applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "saved",
  "personal_notes": "Empresa interesante, revisar beneficios"
}
```

#### Listar Mis Aplicaciones
```http
GET /applications?page=1&limit=20&status=applied,interview
Authorization: Bearer <token>
```

#### Obtener Aplicación Específica
```http
GET /applications/{application_id}
Authorization: Bearer <token>
```

#### Actualizar Aplicación
```http
PUT /applications/{application_id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "interview",
  "personal_notes": "Entrevista programada para el viernes"
}
```

#### Cambiar Solo Estado
```http
PATCH /applications/{application_id}/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "applied"
}
```

#### Eliminar Aplicación
```http
DELETE /applications/{application_id}
Authorization: Bearer <token>
```

### 📎 Endpoints de Archivos Adjuntos

#### Subir Archivo
```http
POST /applications/{application_id}/attachments
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: [archivo.pdf]
```

**Tipos de archivo soportados:**
- Documentos: PDF, DOC, DOCX, TXT
- Imágenes: JPEG, JPG, PNG, GIF
- Tamaño máximo: 5MB

#### Listar Archivos
```http
GET /applications/{application_id}/attachments
Authorization: Bearer <token>
```

#### Descargar Archivo
```http
GET /applications/{application_id}/attachments/{attachment_id}
Authorization: Bearer <token>
```

#### Eliminar Archivo
```http
DELETE /applications/{application_id}/attachments/{attachment_id}
Authorization: Bearer <token>
```

### 🤖 Endpoints de Generación con IA

#### Generar Carta de Presentación
```http
POST /ai/generate-cover-letter
Authorization: Bearer <token>
Content-Type: application/json

{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "tone": "professional",
  "language": "es",
  "additional_context": "Mencionar mi experiencia en startups"
}
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "cover_letter": "Estimado equipo de TechCorp,\n\nMe dirijo a ustedes...",
    "metadata": {
      "tokens_used": 450,
      "model": "gpt-3.5-turbo",
      "generation_time_ms": 2340
    }
  }
}
```

#### Generar Mensaje Frío
```http
POST /ai/generate-cold-message
Authorization: Bearer <token>
Content-Type: application/json

{
  "job_id": "550e8400-e29b-41d4-a716-446655440000",
  "tone": "casual",
  "language": "es"
}
```

### 📊 Endpoints de Analytics

#### Dashboard Principal
```http
GET /analytics/dashboard
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "total_applications": 45,
      "active_applications": 35,
      "response_rate": 0.32,
      "average_response_time_days": 5.2
    },
    "status_breakdown": {
      "saved": 10,
      "applied": 25,
      "interview": 7,
      "offer": 2,
      "rejected": 1
    },
    "recent_activity": {
      "applications_last_7_days": 8,
      "applications_last_30_days": 22,
      "upcoming_interviews": 3
    },
    "top_companies": [
      { "company_name": "TechCorp", "applications": 3 },
      { "company_name": "StartupXYZ", "applications": 2 }
    ]
  }
}
```

#### Estadísticas Detalladas
```http
GET /analytics/applications
Authorization: Bearer <token>
```

## 🧪 Testing con cURL

### Flujo completo de prueba:

```bash
# 1. Health check
curl http://localhost:3000/api/v1/health

# 2. Registro
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'

# 3. Login (guardar el token)
TOKEN=$(curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}' \
  | jq -r '.data.token')

# 4. Crear perfil
curl -X POST http://localhost:3000/api/v1/profiles \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"full_name":"Juan Pérez","current_job_title":"Developer","years_experience":3}'

# 5. Listar trabajos
curl "http://localhost:3000/api/v1/jobs?limit=5"

# 6. Crear aplicación (usar job_id del paso anterior)
curl -X POST http://localhost:3000/api/v1/applications \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"job_id":"JOB_ID_AQUI","status":"saved"}'

# 7. Ver mis aplicaciones
curl http://localhost:3000/api/v1/applications \
  -H "Authorization: Bearer $TOKEN"

# 8. Dashboard analytics
curl http://localhost:3000/api/v1/analytics/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## 📋 Testing con Postman

### Importar Collection

1. Crea una nueva collection "JobSeeker API"
2. Configura las variables:
   - `base_url`: `http://localhost:3000/api/v1`
   - `token`: (se actualizará después del login)

### Scripts de Pre-request (para login automático):

```javascript
// En el request de login, en "Tests" tab:
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set("token", response.data.token);
}

// En requests protegidos, en "Pre-request Script":
const token = pm.collectionVariables.get("token");
if (token) {
    pm.request.headers.add({
        key: "Authorization",
        value: `Bearer ${token}`
    });
}
```

## 🚨 Códigos de Error

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Petición exitosa |
| 201 | Created | Recurso creado exitosamente |
| 400 | Bad Request | Petición malformada |
| 401 | Unauthorized | Token inválido o faltante |
| 403 | Forbidden | Sin permisos suficientes |
| 404 | Not Found | Recurso no encontrado |
| 409 | Conflict | Recurso duplicado |
| 422 | Validation Error | Error en validación de datos |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error interno del servidor |

## 🔧 Troubleshooting

### Error: "Cannot connect to MongoDB"
```bash
# Verificar que MongoDB esté corriendo
mongosh "mongodb://localhost:27017/jobseeker"

# O verifica tu URI de Atlas
echo $MONGODB_URI
```

### Error: "Token invalid"
- Verifica que el header Authorization esté presente
- El token puede haber expirado (7 días)
- Haz login nuevamente

### Error: "Validation failed"
- Revisa el formato de los datos enviados
- Consulta la documentación de validación

### Error 429: "Too many requests"
- Rate limit: 100 requests por 15 minutos
- Espera o implementa retry con backoff

## 📈 Performance y Escalabilidad

### Optimizaciones implementadas:
- **Índices MongoDB**: En campos frecuentemente consultados
- **Paginación**: Límite por defecto de 20 items
- **Compression**: Compresión gzip automática
- **Rate Limiting**: Protección contra abuso
- **Lean Queries**: Optimización de consultas MongoDB

### Para producción se recomienda:
- **Clustering**: PM2 o similar
- **Load Balancer**: Nginx o Cloudflare
- **Monitoring**: New Relic, DataDog
- **Logs**: Winston + ELK Stack
- **Cache**: Redis para queries frecuentes

## 🛡️ Seguridad

### Medidas implementadas:
- ✅ **Helmet**: Headers de seguridad
- ✅ **Rate Limiting**: Prevención de ataques
- ✅ **JWT**: Autenticación stateless
- ✅ **Bcrypt**: Hash seguro de contraseñas
- ✅ **Validación**: Sanitización de inputs
- ✅ **CORS**: Control de orígenes

### Para reforzar en producción:
- Usar HTTPS (obligatorio)
- Implementar refresh tokens
- Logging de eventos de seguridad
- Firewall y VPC
- Monitoreo de anomalías

###  🏗️ Estructura del Proyecto

```text
jobseeker-api/
├── 📄 README.md
├── 📄 package.json
├── 📄 .env.template
├── 📄 .env                          # ⚠️ NO subir a Git
├── 📄 .gitignore
├── 📄 .dockerignore
├── 📄 Dockerfile
├── 📄 docker-compose.yml
├── 📄 render.yaml
├── 📄 server.js                     # Punto de entrada principal
├── 📁 src/
│   ├── 📁 config/
│   │   ├── 📄 database.js           # Conexión MongoDB
│   │   ├── 📄 environment.js        # Variables de entorno
│   │   └── 📄 constants.js          # Constantes globales
│   ├── 📁 models/
│   │   ├── 📄 User.js              # Modelo de Usuario
│   │   ├── 📄 UserProfile.js       # Modelo de Perfil
│   │   ├── 📄 Job.js               # Modelo de Trabajo
│   │   └── 📄 JobApplication.js    # Modelo de Aplicación
│   ├── 📁 middleware/
│   │   ├── 📄 auth.js              # Middleware de autenticación
│   │   ├── 📄 validation.js        # Middleware de validación
│   │   ├── 📄 upload.js            # Configuración de Multer
│   │   ├── 📄 errorHandler.js      # Manejo de errores
│   │   └── 📄 security.js          # Middlewares de seguridad
│   ├── 📁 validators/
│   │   ├── 📄 auth.validators.js    # Validaciones de autenticación
│   │   ├── 📄 profile.validators.js # Validaciones de perfil
│   │   ├── 📄 job.validators.js     # Validaciones de trabajos
│   │   └── 📄 application.validators.js # Validaciones de aplicaciones
│   ├── 📁 controllers/
│   │   ├── 📄 auth.controller.js    # Controlador de autenticación
│   │   ├── 📄 profile.controller.js # Controlador de perfiles
│   │   ├── 📄 job.controller.js     # Controlador de trabajos
│   │   ├── 📄 application.controller.js # Controlador de aplicaciones
│   │   ├── 📄 file.controller.js    # Controlador de archivos
│   │   ├── 📄 ai.controller.js      # Controlador de IA
│   │   └── 📄 analytics.controller.js # Controlador de analytics
│   ├── 📁 routes/
│   │   ├── 📄 index.js             # Rutas principales
│   │   ├── 📄 auth.routes.js       # Rutas de autenticación
│   │   ├── 📄 profile.routes.js    # Rutas de perfiles
│   │   ├── 📄 job.routes.js        # Rutas de trabajos
│   │   ├── 📄 application.routes.js # Rutas de aplicaciones
│   │   ├── 📄 file.routes.js       # Rutas de archivos
│   │   ├── 📄 ai.routes.js         # Rutas de IA
│   │   └── 📄 analytics.routes.js  # Rutas de analytics
│   ├── 📁 services/
│   │   ├── 📄 ai.service.js        # Servicio de IA
│   │   ├── 📄 file.service.js      # Servicio de archivos
│   │   └── 📄 analytics.service.js # Servicio de analytics
│   ├── 📁 utils/
│   │   ├── 📄 helpers.js           # Funciones helper
│   │   ├── 📄 response.js          # Respuestas estándar
│   │   ├── 📄 mockData.js          # Datos mock
│   │   └── 📄 constants.js         # Constantes de utilidad
│   └── 📁 app.js                   # Configuración de Express
├── 📁 tests/                       # Directorio de pruebas (opcional)
│   ├── 📄 auth.test.js
│   ├── 📄 profile.test.js
│   ├── 📄 application.test.js
│   └── 📄 setup.js
├── 📁 docs/                        # Documentación adicional
│   ├── 📄 api-examples.md
│   └── 📄 deployment-guide.md
└── 📁 uploads/                     # Directorio temporal (opcional)
    └── 📄 .gitkeep
```

## 📜 Licencia

MIT License - Puedes usar este código libremente para proyectos personales y comerciales.

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

- **Email**: tu-email@ejemplo.com
- **Issues**: [GitHub Issues](https://github.com/tu-usuario/jobseeker-api/issues)
- **Documentación**: Este README.md

---

**🎉 ¡API lista para usar! Happy coding!** 🚀