import { Injectable } from '@nestjs/common';
import { LoggerService } from './modules/logger/logger.service';

@Injectable()
export class AppService {
  constructor(private logger: LoggerService) {
    this.logger.log('AppService created');
  }

  getHello() {
    this.logger.log('getHello called');
    return 'Hello from NestJS!';
  }
}
