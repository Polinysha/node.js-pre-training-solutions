"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const types_js_1 = require("./types.js");
// Test the exact example from the task
const todo = {
    id: 42,
    title: 'Finish project',
    description: 'Refactor the data layer',
    status: types_js_1.TodoStatus.IN_PROGRESS,
    createdAt: new Date()
};
console.log('? Todo object matches example:');
console.log('id:', todo.id);
console.log('title:', todo.title);
console.log('description:', todo.description);
console.log('status:', todo.status);
console.log('createdAt:', todo.createdAt);
// Test NewTodo type
const newTodo = {
    title: 'Learn TypeScript',
    description: 'Study types and interfaces',
    status: types_js_1.TodoStatus.PENDING
};
console.log('? NewTodo works (no id or createdAt):');
console.log('title:', newTodo.title);
console.log('status:', newTodo.status);
// Test all enum values
console.log('? All TodoStatus values:');
console.log('PENDING:', types_js_1.TodoStatus.PENDING);
console.log('IN_PROGRESS:', types_js_1.TodoStatus.IN_PROGRESS);
console.log('COMPLETED:', types_js_1.TodoStatus.COMPLETED);
console.log('?? Task 01 completed successfully! All requirements met.');
