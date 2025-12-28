import { Controller, Get } from '@nestjs/common';
import { AuditService } from './services/audit.service';

@Controller()
export class AppController {
  constructor(private auditService: AuditService) {}

  @Get()
  getHello() {
    const audit = this.auditService.logAction('VISIT_HOME');
    return {
      message: 'DI Chain Working!',
      audit,
      chain: 'Controller → Audit → User → Logger',
    };
  }
}
