import { Injectable } from '@nestjs/common';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class MathService {
  constructor(private logger: LoggerService) {
    this.logger.log('MathService created');
  }

  add(a: number, b: number) {
    this.logger.log(`Adding ${a} + ${b}`);
    return a + b;
  }

  subtract(a: number, b: number) {
    this.logger.log(`Subtracting ${a} - ${b}`);
    return a - b;
  }
}
