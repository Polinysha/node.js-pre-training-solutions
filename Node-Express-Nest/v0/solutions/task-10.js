// Express.js GET /todos/search endpoint with query params
const express = require('express');
const app = express();

// Хранилище todos в памяти (для тестирования)
let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Learn Express.js', completed: true },
  { id: 3, title: 'Walk the dog', completed: false },
  { id: 4, title: 'Read book', completed: true }
];

// GET /todos/search endpoint (Task 10) - ТОЧНО ПО ЗАДАНИЮ
app.get('/todos/search', (req, res) => {
  const { completed } = req.query;
  
  // Если параметр не передан, возвращаем все todos
  if (completed === undefined) {
    return res.json(todos);
  }
  
  // Фильтруем по completed (как в примере задания)
  const completedBool = completed === 'true';
  const filteredTodos = todos.filter(todo => todo.completed === completedBool);
  
  res.json(filteredTodos);
});

module.exports = app;
