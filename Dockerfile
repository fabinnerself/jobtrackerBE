# Usar Node.js 18 Alpine como base (imagen más pequeña)
FROM node:18-alpine AS builder

# Establecer directorio de trabajo
WORKDIR /app

# Instalar dumb-init (para manejo correcto de señales)
RUN apk add --no-cache dumb-init

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (solo producción)
RUN npm ci --only=production && npm cache clean --force

# Crear usuario no-root para seguridad
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Cambiar a usuario no-root
USER nodejs

# Copiar código fuente (con permisos correctos)
COPY --chown=nodejs:nodejs . .

# Exponer puerto
EXPOSE 80

# Variables de entorno por defecto
ENV NODE_ENV=production
ENV PORT=80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node healthcheck.js

# Comando de inicio con dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
