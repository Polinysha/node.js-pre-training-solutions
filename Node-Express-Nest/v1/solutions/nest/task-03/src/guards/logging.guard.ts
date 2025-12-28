import { Injectable, CanActivate, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggingGuard implements CanActivate {
  private readonly logger = new Logger(LoggingGuard.name);

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers['x-api-key'];
    
    this.logger.log('Guard executing...');
    this.logger.log(\Request path: \\);
    
    // Demo condition: require API key for protected routes
    if (request.url.includes('/protected')) {
      const isValid = apiKey === 'secret-key-123';
      
      if (!isValid) {
        this.logger.warn('Access denied: Invalid or missing API key');
        return false;
      }
      
      this.logger.log('Access granted: Valid API key');
    }
    
    return true;
  }
}
