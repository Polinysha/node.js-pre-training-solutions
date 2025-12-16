import { Todo, TodoStatus } from './types';
import { TodoApi } from './todo-api';

export class TodoService {
    private api: TodoApi;

    constructor(api: TodoApi) {
        this.api = api;
    }

    async create(title: string, description = ''): Promise<Todo> {
        return await this.api.add({
            title,
            description,
            status: TodoStatus.PENDING
        });
    }

    async toggleStatus(id: number): Promise<Todo> {
        // Получаем текущую задачу
        const currentTodo = await this.api.get(id);
        if (!currentTodo) {
            throw new Error(`Todo with id ${id} not found`);
        }

        // Определяем новый статус
        const newStatus = currentTodo.status === TodoStatus.COMPLETED 
            ? TodoStatus.PENDING 
            : TodoStatus.COMPLETED;

        // Обновляем задачу
        const updatedTodo = await this.api.update(id, { status: newStatus });
        if (!updatedTodo) {
            throw new Error(`Failed to update todo with id ${id}`);
        }

        return updatedTodo;
    }

    async search(keyword: string): Promise<Todo[]> {
        const allTodos = await this.api.getAll();
        const lowerKeyword = keyword.toLowerCase();
        
        return allTodos.filter(todo =>
            todo.title.toLowerCase().includes(lowerKeyword) ||
            todo.description?.toLowerCase().includes(lowerKeyword)
        );
    }

    async getAll(): Promise<Todo[]> {
        return await this.api.getAll();
    }
}
