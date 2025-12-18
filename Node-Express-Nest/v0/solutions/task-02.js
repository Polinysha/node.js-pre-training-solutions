const express = require('express');
const app = express();

let todos = [
  { id: 1, title: 'Buy milk', completed: false }
];

app.use(express.json());

app.get('/todos', (req, res) => {
  res.json(todos);
});

app.post('/todos', (req, res) => {
  const { title } = req.body;
  
  const newTodo = {
    id: todos.length + 1, 
    title: title,        
    completed: false
  };
  
  todos.push(newTodo);
  
  res.status(201).json(newTodo);
});

module.exports = app;
