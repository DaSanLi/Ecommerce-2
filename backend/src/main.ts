import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { config } from 'dotenv';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
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
