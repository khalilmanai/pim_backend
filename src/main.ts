import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Enable CORS with proper configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3002', // Match your Next.js dev URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true, // Enable if you're using cookies/sessions
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
