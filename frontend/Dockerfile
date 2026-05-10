# syntax=docker/dockerfile:1

# ========================================
# STAGE 1: Dependencias de producción
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copiar solo package files para cachear dependencias
COPY package*.json ./
RUN npm ci --only=production

# ========================================
# STAGE 2: Build (con devDeps)
# ========================================
FROM node:20-alpine AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copiar package files e instalar TODAS las dependencias (incluye devDeps para build)
COPY package*.json ./
RUN npm ci

# Copiar el código fuente
COPY . .

# Asegurar permisos para el cache de Next.js
RUN mkdir -p .next/cache && chmod -R 777 .next/cache

# Build de la aplicación (usa output: standalone de next.config.ts)
RUN npm run build

# ========================================
# STAGE 3: Runtime (imagen final mínima)
# ========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

# Copiar dependencias de producción desde deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copiar standalone output (incluye server.js, .next, y package.json)
COPY --from=build /app/.next/standalone ./

# Copiar archivos estáticos (Next.js no los incluye en standalone automáticamente)
COPY --from=build /app/.next/static ./.next/static

# Copiar archivos públicos
COPY --from=build /app/public ./public

# Crear usuario no-root para seguridad (Alpine)
RUN addgroup -S -g 1001 nodejs \
    && adduser -S -u 1001 -G nodejs nextjs \
    && chown -R nextjs:nodejs /app

# Usar usuario no-root
USER nextjs

# Exponer puerto
EXPOSE 3000

# Healthcheck básico
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Iniciar servidor Next.js desde standalone
CMD ["node", "server.js"]
