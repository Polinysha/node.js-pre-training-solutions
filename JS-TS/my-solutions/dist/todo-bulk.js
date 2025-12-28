"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countByStatus = exports.clearCompleted = exports.toggleAll = void 0;
// todo-bulk.ts
const types_1 = require("./types");
const toggleAll = (state, completed) => {
    const newStatus = completed ? types_1.TodoStatus.COMPLETED : types_1.TodoStatus.PENDING;
    return state.map(todo => ({
        ...todo,
        status: newStatus
    }));
};
exports.toggleAll = toggleAll;
const clearCompleted = (state) => {
    return state.filter(todo => todo.status !== types_1.TodoStatus.COMPLETED);
};
exports.clearCompleted = clearCompleted;
const countByStatus = (state, status) => {
    return state.reduce((count, todo) => {
        return todo.status === status ? count + 1 : count;
    }, 0);
};
exports.countByStatus = countByStatus;
