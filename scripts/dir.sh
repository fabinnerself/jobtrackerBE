#!/bin/bash

# Crear estructura de directorios
mkdir -p src/{config,models,middleware,validators,controllers,routes,services,utils}
mkdir -p tests docs uploads

# Crear archivos principales
touch README.md package.json .env.template .gitignore .dockerignore Dockerfile docker-compose.yml render.yaml server.js

# Crear archivos de configuración
touch src/config/{database.js,environment.js,constants.js}

# Crear modelos
touch src/models/{User.js,UserProfile.js,Job.js,JobApplication.js}

# Crear middleware
touch src/middleware/{auth.js,validation.js,upload.js,errorHandler.js,security.js}

# Crear validadores
touch src/validators/{auth.validators.js,profile.validators.js,job.validators.js,application.validators.js}

# Crear controladores
touch src/controllers/{auth.controller.js,profile.controller.js,job.controller.js,application.controller.js,file.controller.js,ai.controller.js,analytics.controller.js}

# Crear rutas
touch src/routes/{index.js,auth.routes.js,profile.routes.js,job.routes.js,application.routes.js,file.routes.js,ai.routes.js,analytics.routes.js}

# Crear servicios
touch src/services/{ai.service.js,file.service.js,analytics.service.js}

# Crear utilidades
touch src/utils/{helpers.js,response.js,mockData.js,constants.js}

# Crear app principal
touch src/app.js

# Crear .gitkeep para uploads
touch uploads/.gitkeep

# Crear .gitignore
cat > .gitignore << EOF
node_modules/
.env
.env.local
.env.production
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.DS_Store
uploads/*
!uploads/.gitkeep
dist/
build/
*.log
EOF

echo "✅ Estructura de archivos creada exitosamente!"