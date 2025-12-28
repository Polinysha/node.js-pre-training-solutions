import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log('Middleware executing...');
    this.logger.log(\\ \\);
    
    // Store start time
    res.locals.startTime = Date.now();
    
    // Log response completion
    res.on('finish', () => {
      const duration = Date.now() - res.locals.startTime;
      this.logger.log(\\ \ - \ - \ms\);
    });
    
    next();
  }
}
