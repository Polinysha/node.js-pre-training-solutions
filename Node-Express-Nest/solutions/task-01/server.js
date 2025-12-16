const express = require('express');
const app = express();
const PORT = 3000;

const todos = [
    { id: 1, title: 'Buy milk', completed: false },
    { id: 2, title: 'Read book', completed: true },
    { id: 3, title: 'Walk the dog', completed: false }
];

app.get('/todos', (req, res) => {
    res.status(200).json(todos);
});

const server = app.listen(PORT, () => {
    console.log(\Server running on port \\);
});

module.exports = { app, server };
