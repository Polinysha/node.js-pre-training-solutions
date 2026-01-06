const express = require('express');
const app = express();

let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Learn Express.js', completed: true },
  { id: 3, title: 'Walk the dog', completed: false }
];

app.use(express.json());

app.get('/todos/search', (req, res) => {
  const { completed } = req.query;
  
  console.log('DEBUG: Query params:', req.query);
  console.log('DEBUG: Completed value:', completed);
  console.log('DEBUG: Completed type:', typeof completed);
  
  if (completed === 'true') {
    const result = todos.filter(todo => todo.completed === true);
    return res.json(result);
  }
  
  if (completed === 'false') {
    const result = todos.filter(todo => todo.completed === false);
    return res.json(result);
  }
  
  return res.json(todos);
});

module.exports = app;
