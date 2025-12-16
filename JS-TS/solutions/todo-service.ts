//8
import { Todo, TodoStatus } from './types';
import { TodoApi } from './todo-api';

export class TodoService {
    private api: TodoApi;

    constructor(api: TodoApi) {
        this.api = api;
    }

    async create(title: string, description: string = ''): Promise<Todo> {
        if (!title || title.trim().length === 0) {
            throw new Error('Title is required');
        }

        if (title.length > 100) {
            throw new Error('Title must be less than 100 characters');
        }

        if (description.length > 500) {
            throw new Error('Description must be less than 500 characters');
        }

        return await this.api.add({
            title: title.trim(),
            description: description.trim(),
            status: TodoStatus.PENDING
        });
    }

    async toggleStatus(id: number): Promise<Todo> {
        if (!id || id <= 0) {
            throw new Error('Valid ID is required');
        }

        const todo = await this.api.getAll().then(todos => 
            todos.find(t => t.id === id)
        );

        if (!todo) {
            throw new Error(`Todo with id ${id} not found`);
        }

        const newStatus = todo.status === TodoStatus.COMPLETED 
            ? TodoStatus.PENDING 
            : TodoStatus.COMPLETED;

        return await this.api.update(id, { status: newStatus });
    }

    async search(keyword: string): Promise<Todo[]> {
        if (!keyword || keyword.trim().length === 0) {
            throw new Error('Search keyword is required');
        }

        const todos = await this.api.getAll();
        const lowerKeyword = keyword.toLowerCase().trim();

        return todos.filter(todo =>
            todo.title.toLowerCase().includes(lowerKeyword) ||
            (todo.description && todo.description.toLowerCase().includes(lowerKeyword))
        );
    }
}
