// Express.js app with POST /todos endpoint
const express = require('express');
const app = express();

// Хранилище todos в памяти
let todos = [
  { id: 1, title: 'Buy milk', completed: false }
];

// Middleware для парсинга JSON
app.use(express.json());

// GET /todos endpoint (для проверки)
app.get('/todos', (req, res) => {
  res.json(todos);
});

// POST /todos endpoint (Task 02) - ТОЧНО ПО ЗАДАНИЮ
app.post('/todos', (req, res) => {
  const { title } = req.body;
  
  // Создаем новый todo
  const newTodo = {
    id: todos.length + 1, // Простая логика ID как в примере
    title: title,         // Без trim(), без проверок
    completed: false
  };
  
  // Добавляем в список
  todos.push(newTodo);
  
  // Возвращаем созданный todo
  res.status(201).json(newTodo);
});

module.exports = app;
