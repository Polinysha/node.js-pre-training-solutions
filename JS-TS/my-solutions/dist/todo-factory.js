"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTodo = void 0;
const types_1 = require("./types");
let idCounter = 1;
const createTodo = (todo) => {
    const newTodo = {
        id: idCounter++,
        title: todo.title,
        description: todo.description,
        status: todo.status || types_1.TodoStatus.PENDING,
        createdAt: new Date()
    };
    return newTodo;
};
exports.createTodo = createTodo;
