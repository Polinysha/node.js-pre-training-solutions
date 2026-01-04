const express = require('express');
const app = express();
const PORT = 3000;

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', service: 'node-mongo-app' });
});

app.get('/items', (req, res) => {
  res.json({ count: 1, items: [{ name: 'Test', value: 100 }] });
});

app.post('/items', (req, res) => {
  res.status(201).json({ name: 'Test', value: 100, _id: '123' });
});

app.listen(PORT, () => {
  console.log('Server running on port ' + PORT);
});
