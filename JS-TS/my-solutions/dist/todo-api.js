"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TodoApi = void 0;
const types_1 = require("./types");
const repository_1 = require("./repository");
class TodoNotFoundError extends Error {
    constructor(id) {
        super(`Todo with id ${id} not found`);
        this.name = 'TodoNotFoundError';
    }
}
class TodoApi {
    constructor() {
        this.repository = new repository_1.InMemoryRepository();
        this.idCounter = 1;
    }
    delay() {
        const delay = 300 + Math.random() * 300;
        return new Promise(resolve => setTimeout(resolve, delay));
    }
    async getAll() {
        await this.delay();
        return this.repository.findAll();
    }
    async add(newTodo) {
        await this.delay();
        const todo = {
            id: this.idCounter++,
            title: newTodo.title,
            description: newTodo.description,
            status: newTodo.status || types_1.TodoStatus.PENDING,
            createdAt: new Date()
        };
        await this.repository.add(todo);
        return todo;
    }
    async update(id, update) {
        await this.delay();
        const existingTodo = this.repository.findById(id);
        if (!existingTodo) {
            throw new TodoNotFoundError(id);
        }
        const updatedTodo = await this.repository.update(id, update);
        return updatedTodo;
    }
    async remove(id) {
        await this.delay();
        const existingTodo = this.repository.findById(id);
        if (!existingTodo) {
            throw new TodoNotFoundError(id);
        }
        await this.repository.remove(id);
    }
}
exports.TodoApi = TodoApi;
