import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));
  
  await app.listen(3000);
  console.log('Todo API is running on: http://localhost:3000');
  console.log('Try:');
  console.log('  POST /todos - Create a new todo');
  console.log('  GET /todos - List all todos');
  console.log('  GET /todos/:id - Get specific todo');
}
bootstrap();
