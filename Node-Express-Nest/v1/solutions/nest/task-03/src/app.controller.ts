import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  UseGuards, 
  UseInterceptors,
  UsePipes 
} from '@nestjs/common';
import { AppService } from './app.service';
import { LoggingGuard } from './guards/logging.guard';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { ValidationPipe } from './pipes/validation.pipe';
import { ValidateDto } from './dto/validate.dto';

@Controller()
@UseInterceptors(LoggingInterceptor)
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('public')
  getPublic() {
    return { message: 'Public endpoint - accessible to everyone' };
  }

  @Get('protected')
  @UseGuards(LoggingGuard)
  getProtected() {
    return { 
      message: 'Protected endpoint - requires valid API key',
      secret: 'You found the secret data!' 
    };
  }

  @Post('validate')
  @UsePipes(ValidationPipe)
  validateBody(@Body() validateDto: ValidateDto) {
    return {
      message: 'Validation successful',
      data: validateDto,
      timestamp: new Date().toISOString()
    };
  }
}
