import type { CacheModuleOptions } from '@nestjs/cache-manager';

/**
 * Configuración de cache para la aplicación
 * 
 * Implementa la regla: perf-use-caching de nestjs-best-practices
 * 
 * TTL (Time To Live) configurable por variable de entorno
 */
export const cacheConfig: CacheModuleOptions = {
  ttl: parseInt(process.env.CACHE_TTL || '300000'),
  max: parseInt(process.env.CACHE_MAX_ITEMS || '1000'),
};

/**
 * Cache keys predefinidos para evitar duplicación
 */
export const CACHE_KEYS = {
  USER_BY_EMAIL: (email: string) => `user:email:${email}`,
  ALL_TASKS: (email: string) => `tasks:all:${email}`,
  TASK_BY_ID: (id: string) => `task:id:${id}`,
} as const;

/**
 * Opciones de cache para métodos específicos
 */
export const taskCacheOptions = {
  ttl: 60000,
};

export const userCacheOptions = {
  ttl: 300000,
};