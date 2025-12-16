import { Todo, TodoStatus } from './types.js';

// Exact example from the task
const todo: Todo = {
  id: 42,
  title: 'Finish project',
  description: 'Refactor the data layer',
  status: TodoStatus.IN_PROGRESS,
  createdAt: new Date()
};

console.log('Example verification passed');
