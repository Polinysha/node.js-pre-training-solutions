import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { LoggerService } from './logger.service';

@Injectable()
export class AuditService {
  constructor(
    private userService: UserService,
    private logger: LoggerService,
  ) {
    this.logger.log('AuditService created');
  }

  logAction(action: string) {
    const users = this.userService.getUsers();
    this.logger.log(`Audit: ${action}. Users: ${users.length}`);
    return { action, timestamp: new Date() };
  }
}
