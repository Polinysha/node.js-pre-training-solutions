import { Todo, NewTodo, TodoStatus } from './types';
import { InMemoryRepository } from './repository';

class TodoNotFoundError extends Error {
    constructor(id: number) {
        super(`Todo with id ${id} not found`);
        this.name = 'TodoNotFoundError';
    }
}

export class TodoApi {
    private repository: InMemoryRepository<Todo> = new InMemoryRepository();
    private idCounter = 1;

    private delay(): Promise<void> {
        const delay = 300 + Math.random() * 300;
        return new Promise(resolve => setTimeout(resolve, delay));
    }

    async getAll(): Promise<Todo[]> {
        await this.delay();
        return this.repository.findAll();
    }

    async add(newTodo: NewTodo): Promise<Todo> {
        await this.delay();
        
        const todo: Todo = {
            id: this.idCounter++,
            title: newTodo.title,
            description: newTodo.description,
            status: newTodo.status || TodoStatus.PENDING,
            createdAt: new Date()
        };
        
        await this.repository.add(todo);
        return todo;
    }

    async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
        await this.delay();
        
        const existingTodo = this.repository.findById(id);
        if (!existingTodo) {
            throw new TodoNotFoundError(id);
        }
        
        const updatedTodo = await this.repository.update(id, update);
        return updatedTodo;
    }

    async remove(id: number): Promise<void> {
        await this.delay();
        
        const existingTodo = this.repository.findById(id);
        if (!existingTodo) {
            throw new TodoNotFoundError(id);
        }
        
        await this.repository.remove(id);
    }
}
