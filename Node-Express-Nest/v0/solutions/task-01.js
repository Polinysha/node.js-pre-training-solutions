// Express.js app with GET /todos endpoint
const express = require('express');
const app = express();

// Хранилище todos в памяти (совпадает с express-app/index.js)
let todos = [
  { id: 1, title: 'Buy milk', completed: false },
  { id: 2, title: 'Learn Express.js', completed: true },
  { id: 3, title: 'Walk the dog', completed: false }
];

// Middleware для парсинга JSON
app.use(express.json());

// GET /todos endpoint
app.get('/todos', (req, res) => {
  res.json(todos);
});

module.exports = app;
