import { Injectable, PipeTransform, ArgumentMetadata, Logger, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  private readonly logger = new Logger(ValidationPipe.name);

  transform(value: any, metadata: ArgumentMetadata) {
    this.logger.log('Pipe executing...');
    this.logger.log(\Pipe type: \\);
    this.logger.log(\Pipe metadata: \\);
    
    // Demo validation
    if (metadata.type === 'body') {
      if (!value || Object.keys(value).length === 0) {
        throw new BadRequestException('Request body cannot be empty');
      }
      
      // Additional validation logic would go here
      this.logger.log('Body validation passed');
    }
    
    return value;
  }
}
