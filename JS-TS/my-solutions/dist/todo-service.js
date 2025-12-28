"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoService = void 0;
const types_1 = require("./types");
class TodoService {
    constructor(api) {
        this.api = api;
    }
    async create(title, description) {
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
            status: types_1.TodoStatus.PENDING // Добавляем дефолтный статус
        });
    }
    async toggleStatus(id) {
        if (!Number.isInteger(id) || id <= 0) {
            throw new Error('Invalid todo ID');
        }
        const todo = await this.api.getAll().then(todos => todos.find(t => t.id === id));
        if (!todo) {
            throw new Error(`Todo with ID ${id} not found`);
        }
        const newStatus = todo.status === types_1.TodoStatus.COMPLETED
            ? types_1.TodoStatus.PENDING
            : types_1.TodoStatus.COMPLETED;
        return this.api.update(id, { status: newStatus });
    }
    async search(keyword) {
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
exports.TodoService = TodoService;
