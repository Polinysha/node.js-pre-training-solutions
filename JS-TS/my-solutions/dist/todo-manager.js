"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToDoManager = void 0;
const todo_api_1 = require("./todo-api");
const todo_service_1 = require("./todo-service");
class ToDoManager {
    constructor() {
        this.api = new todo_api_1.TodoApi();
        this.service = new todo_service_1.TodoService(this.api);
    }
    async init() {
        await this.service.create('Learn TypeScript', 'Complete all exercises');
        await this.service.create('Build a Todo App', 'Implement all features');
        await this.service.create('Write tests', 'Achieve 90% coverage');
        await this.service.create('Read documentation', 'Study advanced patterns');
    }
    async add(title, description) {
        await this.service.create(title, description);
    }
    async complete(id) {
        await this.service.toggleStatus(id);
    }
    async list() {
        return await this.api.getAll();
    }
}
exports.ToDoManager = ToDoManager;
