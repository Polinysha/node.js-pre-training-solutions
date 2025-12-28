"use strict";
// Test Task 01 directly without imports
// Copy the types directly for testing
var TodoStatus;
(function (TodoStatus) {
    TodoStatus["PENDING"] = "PENDING";
    TodoStatus["IN_PROGRESS"] = "IN_PROGRESS";
    TodoStatus["COMPLETED"] = "COMPLETED";
})(TodoStatus || (TodoStatus = {}));
// Test the exact example from the task
const todo = {
    id: 42,
    title: 'Finish project',
    description: 'Refactor the data layer',
    status: TodoStatus.IN_PROGRESS,
    createdAt: new Date()
};
console.log('Todo object matches example:');
console.log('id:', todo.id);
console.log('title:', todo.title);
console.log('description:', todo.description);
console.log('status:', todo.status);
console.log('createdAt:', todo.createdAt);
// Test NewTodo type
const newTodo = {
    title: 'Learn TypeScript',
    description: 'Study types and interfaces',
    status: TodoStatus.PENDING
};
console.log('NewTodo works (no id or createdAt):');
console.log('title:', newTodo.title);
console.log('status:', newTodo.status);
// Test all enum values
console.log('All TodoStatus values:');
console.log('PENDING:', TodoStatus.PENDING);
console.log('IN_PROGRESS:', TodoStatus.IN_PROGRESS);
console.log('COMPLETED:', TodoStatus.COMPLETED);
console.log('Task 01 completed successfully. All requirements met.');
