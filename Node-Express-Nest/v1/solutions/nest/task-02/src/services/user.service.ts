import { Injectable } from '@nestjs/common';
import { LoggerService } from './logger.service';

@Injectable()
export class UserService {
  constructor(private logger: LoggerService) {
    this.logger.log('UserService created');
  }

  getUsers() {
    this.logger.log('Getting users');
    return [{ id: 1, name: 'John' }];
  }
}
