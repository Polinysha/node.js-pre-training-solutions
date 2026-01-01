const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Health endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        service: 'Node.js API',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Data endpoint
app.get('/data', (req, res) => {
    res.json({
        success: true,
        data: [
            { id: 1, name: 'Item 1', description: 'First item' },
            { id: 2, name: 'Item 2', description: 'Second item' },
            { id: 3, name: 'Item 3', description: 'Third item' }
        ],
        count: 3,
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to Node.js API with Docker Compose',
        endpoints: {
            health: '/health',
            data: '/data',
            apiDocs: 'Coming soon...'
        }
    });
});

// Start server
app.listen(PORT, () => {
    console.log(\Node.js API running on port \\);
    console.log(\Health check: http://localhost:\/health\);
});
