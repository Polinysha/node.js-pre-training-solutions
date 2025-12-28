import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { LoggerService } from './services/logger.service';
import { UserService } from './services/user.service';
import { AuditService } from './services/audit.service';

@Module({
  controllers: [AppController],
  providers: [LoggerService, UserService, AuditService],
})
export class AppModule {}
