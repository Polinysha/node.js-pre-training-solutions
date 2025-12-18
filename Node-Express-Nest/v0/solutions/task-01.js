const express = require('express');
const app = express();

let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Learn Express.js', completed: true },
  { id: 3, title: 'Walk the dog', completed: false }
];

app.use(express.json());

app.get('/todos', (req, res) => {
  res.json(todos);
});

module.exports = app;
