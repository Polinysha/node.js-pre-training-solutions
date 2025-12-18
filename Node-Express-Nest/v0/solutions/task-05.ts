import { Controller, Get } from '@nestjs/common';

@Controller('todos')
export class TodosController {
  @Get()
  getTodos() {

    return [
      { id: 1, title: 'Buy milk', completed: false }
    ];
  }
}
