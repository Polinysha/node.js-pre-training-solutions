// NestJS Controller for /todos
import { Controller, Get } from '@nestjs/common';

@Controller('todos')
export class TodosController {
  @Get()
  getTodos() {
    // ТОЧНО как в примере задания: возвращает массив todos
    return [
      { id: 1, title: 'Buy milk', completed: false }
    ];
  }
}
