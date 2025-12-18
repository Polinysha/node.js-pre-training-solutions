const express = require('express');
const app = express();

let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Learn Express.js', completed: true },
  { id: 3, title: 'Walk the dog', completed: false },
  { id: 4, title: 'Read book', completed: true }
];

app.get('/todos/search', (req, res) => {
  const { completed } = req.query;
  
  if (completed === undefined) {
    return res.json(todos);
  }
  
  const completedBool = completed === 'true';
  const filteredTodos = todos.filter(todo => todo.completed === completedBool);
  
  res.json(filteredTodos);
});

module.exports = app;
