import { TodoApi } from './todo-api';
import { TodoService } from './todo-service';
import { Todo } from './types';

export class ToDoManager {
    private service: TodoService;
    private api: TodoApi;
    
    constructor() {
        this.api = new TodoApi();
        this.service = new TodoService(this.api);
    }

    async init(): Promise<void> {
        await this.service.create('Learn TypeScript', 'Complete all exercises');
        await this.service.create('Build a Todo App', 'Implement all features');
        await this.service.create('Write tests', 'Achieve 90% coverage');
        await this.service.create('Read documentation', 'Study advanced patterns');
    }

    async add(title: string, description?: string): Promise<void> {
        await this.service.create(title, description);
    }

    async complete(id: number): Promise<void> {
        await this.service.toggleStatus(id);
    }

    async list(): Promise<Todo[]> {
        return await this.api.getAll();
    }
}
