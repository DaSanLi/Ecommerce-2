# syntax=docker/dockerfile:1

# ========================================
# STAGE 1: Production dependencies
# ========================================
FROM node:20-alpine AS deps
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copy only package files to cache dependencies
COPY package*.json ./
RUN npm ci --only=production

# ========================================
# STAGE 2: Build (with devDeps)
# ========================================
FROM node:20-alpine AS build
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

# Copy package files and install ALL dependencies (includes devDeps for build)
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Ensure permissions for Next.js cache
RUN mkdir -p .next/cache && chmod -R 777 .next/cache

# Build the application (uses output: standalone from next.config.ts)
RUN npm run build

# ========================================
# STAGE 3: Runtime (minimal final image)
# ========================================
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0

# Copy production dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy standalone output (includes server.js, .next, and package.json)
COPY --from=build /app/.next/standalone ./

# Copy static files (Next.js doesn't auto-include them in standalone)
COPY --from=build /app/.next/static ./.next/static

# Copy public files
COPY --from=build /app/public ./public

# Create non-root user for security (Alpine)
RUN addgroup -S -g 1001 nodejs \
    && adduser -S -u 1001 -G nodejs nextjs \
    && chown -R nextjs:nodejs /app

# Use non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Basic healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start Next.js server from standalone
CMD ["node", "server.js"]
