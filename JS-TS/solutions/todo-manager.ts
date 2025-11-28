// 10
import { Todo, TodoStatus } from './types';
import { InMemoryRepository } from './repository';
import { TodoApi } from './todo-api';
import { TodoService } from './todo-service';

export class ToDoManager {
    private repository: InMemoryRepository<Todo>;
    private api: TodoApi;
    private service: TodoService;

    constructor() {
        this.repository = new InMemoryRepository<Todo>();
        this.api = new TodoApi();
        this.service = new TodoService(this.api);
        
        // Инициализируем демо-данные
        this.initDemoData();
    }

    private initDemoData(): void {
        const demoData: Todo[] = [
            {
                id: 1,
                title: 'Learn TypeScript',
                description: 'Study types and interfaces',
                status: TodoStatus.PENDING,
                createdAt: new Date()
            },
            {
                id: 2,
                title: 'Build a project',
                description: 'Create a full-stack application',
                status: TodoStatus.IN_PROGRESS,
                createdAt: new Date()
            },
            {
                id: 3,
                title: 'Write documentation',
                description: 'Document the codebase',
                status: TodoStatus.COMPLETED,
                createdAt: new Date()
            }
        ];

        demoData.forEach(todo => this.repository.add(todo));
    }

    async init(): Promise<void> {
        // Переинициализируем демо-данные
        const allTodos = this.repository.findAll();
        allTodos.forEach(todo => this.repository.remove(todo.id));
        this.initDemoData();
    }

    async add(title: string, description: string = ''): Promise<void> {
        const todo = await this.service.create(title, description);
        this.repository.add(todo);
    }

    async complete(id: number): Promise<void> {
        const todo = this.repository.findById(id);
        if (!todo) {
            throw new Error(`Todo with id ${id} not found`);
        }
        
        await this.service.toggleStatus(id);
        this.repository.update(id, { status: TodoStatus.COMPLETED });
    }

    async list(): Promise<Todo[]> {
        return this.repository.findAll();
    }
}
