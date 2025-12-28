import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from './modules/logger/logger.module';
import { MathModule } from './modules/math/math.module';

@Module({
  imports: [LoggerModule, MathModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
