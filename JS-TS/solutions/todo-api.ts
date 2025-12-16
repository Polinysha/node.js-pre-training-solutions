//6
import { Todo, NewTodo, TodoStatus } from './types';

class TodoNotFoundError extends Error {
    constructor(id: number) {
        super(`Todo with id ${id} not found`);
        this.name = 'TodoNotFoundError';
    }
}

export class TodoApi {
    private todos: Todo[] = [];
    private nextId = 1;

    private delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async getAll(): Promise<Todo[]> {
        await this.delay(300 + Math.random() * 300);
        return [...this.todos];
    }

    async add(newTodo: NewTodo): Promise<Todo> {
        await this.delay(300 + Math.random() * 300);
        
        const todo: Todo = {
            id: this.nextId++,
            title: newTodo.title,
            description: newTodo.description,
            status: newTodo.status || TodoStatus.PENDING,
            createdAt: new Date()
        };

        this.todos.push(todo);
        return todo;
    }

    async update(id: number, update: Partial<Omit<Todo, 'id' | 'createdAt'>>): Promise<Todo> {
        await this.delay(300 + Math.random() * 300);
        
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) {
            throw new TodoNotFoundError(id);
        }

        this.todos[index] = { ...this.todos[index], ...update };
        return this.todos[index];
    }

    async remove(id: number): Promise<void> {
        await this.delay(300 + Math.random() * 300);
        
        const index = this.todos.findIndex(todo => todo.id === id);
        if (index === -1) {
            throw new TodoNotFoundError(id);
        }

        this.todos.splice(index, 1);
    }
}
