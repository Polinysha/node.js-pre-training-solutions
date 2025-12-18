// Express.js app with GET /todos/:id endpoint
const express = require('express');
const app = express();

// Õðàíèëèùå todos â ïàìÿòè (òîëüêî òî ÷òî íóæíî)
let todos = [
  { id: 1, title: 'Buy milk', completed: false }
];

// GET /todos/:id endpoint (Task 04) - ÒÎ×ÍÎ ÏÎ ÇÀÄÀÍÈÞ
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({ error: 'Todo not found' });
  }

  res.json(todo);
});

module.exports = app;
