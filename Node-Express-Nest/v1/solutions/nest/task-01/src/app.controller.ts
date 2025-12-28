import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { MathService } from './modules/math/math.service';

@Controller()
export class AppController {
  constructor(
    private appService: AppService,
    private mathService: MathService,
  ) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('add')
  add() {
    const result = this.mathService.add(5, 3);
    return `5 + 3 = ${result}`;
  }

  @Get('subtract')
  subtract() {
    const result = this.mathService.subtract(10, 4);
    return `10 - 4 = ${result}`;
  }
}
