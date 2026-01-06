const express = require('express');
const app = express();
const PORT = 3000;

const loggerMiddleware = (req, res, next) => {
    const start = Date.now();
    const requestId = Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    
    console.log(`[${new Date().toISOString()}] [START] ${req.method} ${req.url}`);
    console.log(`  Request ID: ${requestId}`);
    console.log(`  Headers: ${JSON.stringify(req.headers)}`);
    
    req.requestId = requestId;
    req.startTime = start;
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] [END] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
        console.log(`  Response Headers: ${JSON.stringify(res.getHeaders())}`);
        console.log('---'.repeat(20));
    });
    
    next();
};

const timerMiddleware = (req, res, next) => {
    console.log(`[Timer Middleware] Request ${req.requestId} - Timer started`);
    
    const originalSend = res.send;
    res.send = function(body) {
        const duration = Date.now() - req.startTime;
        res.setHeader('X-Response-Time', `${duration}ms`);
        console.log(`[Timer Middleware] Request ${req.requestId} - Response time: ${duration}ms`);
        return originalSend.call(this, body);
    };
    
    next();
};

const customHeaderMiddleware = (req, res, next) => {
    console.log(`[Header Middleware] Request ${req.requestId} - Adding custom headers`);
    
    res.setHeader('X-Powered-By', 'Express-Middleware-Playground');
    res.setHeader('X-API-Version', '1.0.0');
    res.setHeader('X-Request-ID', req.requestId);
    res.setHeader('X-Server-Timestamp', new Date().toISOString());
    
    next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('\nMiddleware Registration Order:');
console.log('1. loggerMiddleware');
console.log('2. timerMiddleware');
console.log('3. customHeaderMiddleware\n');

app.use(loggerMiddleware);
app.use(timerMiddleware);
app.use(customHeaderMiddleware);

app.get('/', (req, res) => {
    console.log(`[Route Handler] Request ${req.requestId} - Handling GET /`);
    res.json({
        message: 'Welcome to Middleware Playground!',
        requestId: req.requestId,
        timestamp: new Date().toISOString(),
        middlewares: ['loggerMiddleware', 'timerMiddleware', 'customHeaderMiddleware']
    });
});

app.get('/api/users', (req, res) => {
    console.log(`[Route Handler] Request ${req.requestId} - Handling GET /api/users`);
    res.json({
        users: [
            { id: 1, name: 'Alice' },
            { id: 2, name: 'Bob' },
            { id: 3, name: 'Charlie' }
        ],
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

app.post('/api/users', (req, res) => {
    console.log(`[Route Handler] Request ${req.requestId} - Handling POST /api/users`);
    console.log(`  Request Body: ${JSON.stringify(req.body)}`);
    
    if (!req.body.name) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Name is required',
            requestId: req.requestId
        });
    }
    
    res.status(201).json({
        message: 'User created successfully',
        user: { id: Date.now(), ...req.body },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

app.get('/api/users/:id', (req, res) => {
    console.log(`[Route Handler] Request ${req.requestId} - Handling GET /api/users/${req.params.id}`);
    
    const userId = parseInt(req.params.id);
    if (isNaN(userId)) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid user ID',
            requestId: req.requestId
        });
    }
    
    res.json({
        user: { id: userId, name: `User ${userId}` },
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

app.get('/protected', (req, res) => {
    console.log(`[Route Handler] Request ${req.requestId} - Handling GET /protected`);
    
    const authToken = req.headers['authorization'];
    if (!authToken) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Authorization header is required',
            requestId: req.requestId
        });
    }
    
    res.json({
        message: 'Access granted to protected route',
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
    console.error(`[Error Middleware] Request ${req.requestId} - Error:`, err.message);
    
    res.status(err.status || 500).json({
        error: 'Internal Server Error',
        message: err.message,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

app.use((req, res) => {
    console.log(`[404 Handler] Request ${req.requestId} - Route not found: ${req.method} ${req.url}`);
    
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.url}`,
        requestId: req.requestId,
        timestamp: new Date().toISOString()
    });
});

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('Middleware Playground Server');
    console.log('='.repeat(50));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nAvailable routes:');
    console.log('  GET  /              - Welcome message');
    console.log('  GET  /api/users     - Get all users');
    console.log('  POST /api/users     - Create new user');
    console.log('  GET  /api/users/:id - Get user by ID');
    console.log('  GET  /protected     - Protected route (requires Authorization header)');
    console.log('\nMiddleware execution order:');
    console.log('1. loggerMiddleware → 2. timerMiddleware → 3. customHeaderMiddleware → Route Handler');
    console.log('='.repeat(50));
    console.log('\nTry these commands:');
    console.log('  curl http://localhost:3000/');
    console.log('  curl http://localhost:3000/api/users');
    console.log('  curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d \'{"name":"John"}\'');
    console.log('='.repeat(50));
});
