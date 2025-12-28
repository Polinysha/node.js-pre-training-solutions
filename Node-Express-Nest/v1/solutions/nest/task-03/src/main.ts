import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Use global middleware
  // app.use(new LoggingMiddleware().use);
  
  await app.listen(3000);
  console.log('Application is running on: http://localhost:3000');
  console.log('Try:');
  console.log('  GET /public');
  console.log('  GET /protected (requires API key)');
  console.log('  POST /validate (requires valid body)');
}
bootstrap();
