import { Module } from '@nestjs/common';
import { MathService } from './math.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [MathService],
  exports: [MathService],
})
export class MathModule {}
