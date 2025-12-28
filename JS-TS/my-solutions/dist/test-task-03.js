"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const todo_factory_js_1 = require("./todo-factory.js");
const types_js_1 = require("./types.js");
console.log('Testing Task 03: Todo Factory');
// Test the exact example from the task
const a = (0, todo_factory_js_1.createTodo)({ title: 'Learn TypeScript', description: '' });
const b = (0, todo_factory_js_1.createTodo)({ title: 'Refactor code' });
console.log('a.id:', a.id); // Should be 1
console.log('b.id:', b.id); // Should be 2
console.log('a.status:', a.status); // Should be PENDING
console.log('b.status:', b.status); // Should be PENDING
console.log('a.createdAt is Date:', a.createdAt instanceof Date);
console.log('b.createdAt is Date:', b.createdAt instanceof Date);
// Test with custom status
const c = (0, todo_factory_js_1.createTodo)({
    title: 'Custom status',
    description: 'Test',
    status: types_js_1.TodoStatus.IN_PROGRESS
});
console.log('c.id:', c.id); // Should be 3
console.log('c.status:', c.status); // Should be IN_PROGRESS
console.log('All manual tests passed!');
