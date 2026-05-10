import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { GlobalExceptionFilter } from './filters/http-exception.filter';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    // En desarrollo muestra errores más detallados
    logger: process.env.NODE_ENV === 'production' 
      ? ['error', 'warn', 'log'] 
      : ['error', 'warn', 'log', 'debug'],
  });

  // Helmet para security headers
  // Configuración diferenciada: desarrollo vs producción
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  app.use(helmet({
    // crossOriginEmbedderPolicy: necesario para Apollo Sandbox en desarrollo
    // Permite que el navegador cargue recursos cross-origin para el iframe de Sandbox
    crossOriginEmbedderPolicy: !isDevelopment,
    
    // Content Security Policy: permisivo SOLO en desarrollo para Apollo Sandbox
    // Apollo Sandbox necesita:
    // 1. Scripts desde CDN: embeddable-sandbox.cdn.apollographql.com
    // 2. Scripts inline: para inicializar window.EmbeddedSandbox ('unsafe-inline')
    // 3. Imágenes y manifest desde: apollo-server-landing-page.cdn.apollographql.com
    // 4. Iframe desde: sandbox.embed.apollographql.com
    // 5. connectSrc para permitir conexiones HTTPS a cualquier origen (queries GraphQL)
    contentSecurityPolicy: isDevelopment
      ? {
          directives: {
            defaultSrc: [`'self'`],
            scriptSrc: [
              `'self'`,
              `'unsafe-inline'`,  // Necesario para window.EmbeddedSandbox
              'https://embeddable-sandbox.cdn.apollographql.com',
              'https://apollo-server-landing-page.cdn.apollographql.com',
            ],
            imgSrc: [
              `'self'`,
              'data:',
              'https://apollo-server-landing-page.cdn.apollographql.com',
              'https://embeddable-sandbox.cdn.apollographql.com',
            ],
            manifestSrc: [
              `'self'`,
              'https://apollo-server-landing-page.cdn.apollographql.com',
            ],
            frameSrc: [
              `'self'`,
              'https://sandbox.embed.apollographql.com',
              'https://studio.apollographql.com',
            ],
            connectSrc: [
              `'self'`,
              'https:',  // Permite cualquier conexión HTTPS (necesario para Sandbox)
              'wss:',   // Permite WebSocket seguros (para subscriptions)
            ],
            styleSrc: [
              `'self'`,
              `'unsafe-inline'`,  // Sandbox aplica estilos inline
              'https:',
            ],
            fontSrc: [
              `'self'`,
              'https:',
              'data:',
            ],
          },
        }
      : true,  // En producción: política CSP estricta por defecto de Helmet
  }));

  // ValidationPipe global - valida todos los inputs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Elimina propiedades no definidas en DTOs
    forbidNonWhitelisted: true, // Lanza error si hay propiedades extra
    transform: true, // Transforma payload al tipo del DTO
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Registrar filtro global de excepciones
  app.useGlobalFilters(new GlobalExceptionFilter());
  const port: number = process.env.PORT ? parseInt(process.env.PORT) : 4000
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';
  app.enableCors({
    origin: corsOrigin,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "credentials": true,
  });
  app.use(cookieParser());
  console.log(`servidor corriendo en : http://localhost:${port}, entra en: http://localhost:${port}/graphql`)
  await app.listen(port);
}
void bootstrap();
