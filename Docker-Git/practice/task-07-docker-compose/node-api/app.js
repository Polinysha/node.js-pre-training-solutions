const express = require('express');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'postgres-db',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'secretpassword',
  database: process.env.DB_NAME || 'appdb',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'node-api',
      database: 'connected'
    });
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      service: 'node-api',
      database: 'disconnected',
      error: error.message
    });
  }
});

// Data endpoint with hardcoded data
app.get('/data', (req, res) => {
  const data = [
    { id: 1, name: 'Item One', category: 'A', value: 100 },
    { id: 2, name: 'Item Two', category: 'B', value: 200 },
    { id: 3, name: 'Item Three', category: 'A', value: 150 },
    { id: 4, name: 'Item Four', category: 'C', value: 300 },
    { id: 5, name: 'Item Five', category: 'B', value: 250 }
  ];
  
  res.status(200).json({
    count: data.length,
    data: data,
    timestamp: new Date().toISOString()
  });
});

// Database test endpoint
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id');
    res.status(200).json({
      count: result.rowCount,
      users: result.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create user endpoint
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO users (name, email) VALUES (, ) RETURNING *',
      [name, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(\Node.js API server running on port \\);
  console.log(\Health check: http://localhost:\/health\);
  console.log(\Data endpoint: http://localhost:\/data\);
});
