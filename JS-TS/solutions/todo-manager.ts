import { TodoService } from './todo-service';
import { TodoApi } from './todo-api';
import { InMemoryRepository } from './in-memory-repository';
import { Todo } from './types';

export class ToDoManager {
  private service: TodoService;

  constructor() {
    const repository = new InMemoryRepository();
    const api = new TodoApi(repository);
    this.service = new TodoService(api);
  }

  async init(): Promise<void> {
    // Seed with demo data
    await this.add('Learn TypeScript', 'Complete the TypeScript tutorial');
    await this.add('Build Todo App', 'Implement the todo manager facade');
    await this.add('Write Tests', 'Ensure all functionality works correctly');
    console.log('Demo data initialized successfully');
  }

  async add(title: string, description = ''): Promise<void> {
    await this.service.addTodo(title, description);
  }

  async complete(id: number): Promise<void> {
    await this.service.completeTodo(id);
  }

  async list(): Promise<Todo[]> {
    return await this.service.getTodos();
  }
}
