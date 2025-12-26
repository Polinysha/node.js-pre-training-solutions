import { TodoApi } from './todo-api';
import { Todo, TodoStatus } from './types';

export class TodoService {
    constructor(private api: TodoApi) {}

    async create(title: string, description?: string): Promise<Todo> {
        if (!title || title.trim().length === 0) {
            throw new Error('Title cannot be empty');
        }

        if (title.length > 100) {
            throw new Error('Title cannot exceed 100 characters');
        }

        if (description && description.length > 1000) {
            throw new Error('Description cannot exceed 1000 characters');
        }

        return this.api.add({
            title: title.trim(),
            description: description?.trim(),
            status: TodoStatus.PENDING  // Добавляем дефолтный статус
        });
    }

    async toggleStatus(id: number): Promise<Todo> {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid todo ID');
        }

        const todo = await this.api.getAll().then(todos => 
            todos.find(t => t.id === id)
        );

        if (!todo) {
            throw new Error(`Todo with ID ${id} not found`);
        }

        const newStatus = todo.status === TodoStatus.COMPLETED 
            ? TodoStatus.PENDING 
            : TodoStatus.COMPLETED;

        return this.api.update(id, { status: newStatus });
    }

    async search(keyword: string): Promise<Todo[]> {
        if (!keyword || keyword.trim().length === 0) {
            throw new Error('Search keyword cannot be empty');
        }

        const normalizedKeyword = keyword.toLowerCase().trim();
        const todos = await this.api.getAll();

        return todos.filter(todo => {
            const titleMatch = todo.title.toLowerCase().includes(normalizedKeyword);
            const descMatch = todo.description 
                ? todo.description.toLowerCase().includes(normalizedKeyword)
                : false;
            return titleMatch || descMatch;
        });
    }
}
