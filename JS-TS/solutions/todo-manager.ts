import { Todo, TodoStatus } from './types';
import { InMemoryRepository } from './repository';
import { TodoApi } from './todo-api';
import { TodoService } from './todo-service';

export class ToDoManager {
    private repository: InMemoryRepository<Todo>;
    private api: TodoApi;
    private service: TodoService;
    private nextId: number;

    constructor() {
        this.repository = new InMemoryRepository<Todo>();
        this.api = new TodoApi();
        this.service = new TodoService(this.api);
        this.nextId = 1;
    }

    async init(): Promise<void> {
        // Очищаем состояние
        const existing = this.repository.findAll();
        existing.forEach(todo => this.repository.remove(todo.id));
        this.nextId = 1;
        
        // Добавляем демо-данные
        const demoData: Todo[] = [
            {
                id: this.nextId++,
                title: 'Learn TypeScript',
                description: 'Study types and interfaces',
                status: TodoStatus.PENDING,
                createdAt: new Date()
            },
            {
                id: this.nextId++,
                title: 'Build a project',
                description: 'Create a full-stack application',
                status: TodoStatus.IN_PROGRESS,
                createdAt: new Date()
            },
            {
                id: this.nextId++,
                title: 'Write documentation',
                status: TodoStatus.COMPLETED,
                createdAt: new Date()
            }
        ];

        demoData.forEach(todo => this.repository.add(todo));
    }

    async add(title: string, description: string = ''): Promise<void> {
        const todo: Todo = {
            id: this.nextId++,
            title,
            description,
            status: TodoStatus.PENDING, // Все новые задачи PENDING
            createdAt: new Date()
        };
        this.repository.add(todo);
    }

    async complete(id: number): Promise<void> {
        const todo = this.repository.findById(id);
        if (!todo) {
            throw new Error(`Todo with id ${id} not found`);
        }
        
        // Меняем статус на COMPLETED
        this.repository.update(id, { status: TodoStatus.COMPLETED });
    }

    async list(): Promise<Todo[]> {
        return this.repository.findAll();
    }
}
