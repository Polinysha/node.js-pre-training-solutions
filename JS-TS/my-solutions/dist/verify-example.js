"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_js_1 = require("./types.js");
// Exact example from the task
const todo = {
    id: 42,
    title: 'Finish project',
    description: 'Refactor the data layer',
    status: types_js_1.TodoStatus.IN_PROGRESS,
    createdAt: new Date()
};
console.log('Example verification passed');
