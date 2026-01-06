const express = require('express');
const app = express();
const PORT = 3004;

class MetricsTracker {
    constructor() {
        this.requests = [];
        this.metrics = {
            totalRequests: 0,
            totalErrors: 0,
            totalResponseTime: 0,
            byMethod: {},
            byRoute: {},
            byStatus: {},
            lastHour: {
                requests: 0,
                errors: 0,
                avgResponseTime: 0
            }
        };
        
        ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
            this.metrics.byMethod[method] = 0;
        });
    }
    
    recordRequest(req, res, duration) {
        const timestamp = new Date();
        const route = req.route ? req.route.path : req.path;
        const method = req.method;
        const statusCode = res.statusCode;
        
        const requestRecord = {
            timestamp: timestamp.toISOString(),
            method,
            route,
            statusCode,
            duration,
            ip: req.ip || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'] || 'unknown'
        };
        
        this.requests.push(requestRecord);
        
        if (this.requests.length > 1000) {
            this.requests.shift();
        }
        
        this.metrics.totalRequests++;
        this.metrics.totalResponseTime += duration;
        
        if (this.metrics.byMethod[method] !== undefined) {
            this.metrics.byMethod[method]++;
        }
        
        if (!this.metrics.byRoute[route]) {
            this.metrics.byRoute[route] = { count: 0, totalTime: 0 };
        }
        this.metrics.byRoute[route].count++;
        this.metrics.byRoute[route].totalTime += duration;
        
        const statusGroup = Math.floor(statusCode / 100) * 100; 
        if (!this.metrics.byStatus[statusGroup]) {
            this.metrics.byStatus[statusGroup] = 0;
        }
        this.metrics.byStatus[statusGroup]++;
        
        if (statusCode >= 400) {
            this.metrics.totalErrors++;
        }
        
        const oneHourAgo = new Date(timestamp.getTime() - 60 * 60 * 1000);
        const lastHourRequests = this.requests.filter(req => 
            new Date(req.timestamp) > oneHourAgo
        );
        
        this.metrics.lastHour.requests = lastHourRequests.length;
        this.metrics.lastHour.errors = lastHourRequests.filter(req => req.statusCode >= 400).length;
        this.metrics.lastHour.avgResponseTime = lastHourRequests.length > 0
            ? lastHourRequests.reduce((sum, req) => sum + req.duration, 0) / lastHourRequests.length
            : 0;
    }
    
    getMetrics() {
        const avgResponseTime = this.metrics.totalRequests > 0
            ? this.metrics.totalResponseTime / this.metrics.totalRequests
            : 0;
        
        const errorRate = this.metrics.totalRequests > 0
            ? (this.metrics.totalErrors / this.metrics.totalRequests) * 100
            : 0;
        
        const routesWithAvgTime = {};
        Object.keys(this.metrics.byRoute).forEach(route => {
            const routeData = this.metrics.byRoute[route];
            routesWithAvgTime[route] = {
                count: routeData.count,
                avgTime: routeData.count > 0 ? routeData.totalTime / routeData.count : 0
            };
        });
        
        const recentRequests = this.requests.slice(-10).reverse();
        
        return {
            summary: {
                totalRequests: this.metrics.totalRequests,
                totalErrors: this.metrics.totalErrors,
                errorRate: parseFloat(errorRate.toFixed(2)),
                averageResponseTime: parseFloat(avgResponseTime.toFixed(2)),
                uptime: process.uptime()
            },
            byMethod: this.metrics.byMethod,
            byRoute: routesWithAvgTime,
            byStatus: this.metrics.byStatus,
            lastHour: this.metrics.lastHour,
            recentRequests: recentRequests
        };
    }
    
    reset() {
        this.requests = [];
        this.metrics = {
            totalRequests: 0,
            totalErrors: 0,
            totalResponseTime: 0,
            byMethod: {},
            byRoute: {},
            byStatus: {},
            lastHour: {
                requests: 0,
                errors: 0,
                avgResponseTime: 0
            }
        };
        
        ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
            this.metrics.byMethod[method] = 0;
        });
    }
}

const metricsTracker = new MetricsTracker();

const metricsMiddleware = (req, res, next) => {
    const startTime = Date.now();
    
    console.log(`[${new Date().toISOString()}] START ${req.method} ${req.url}`);
    console.log(`  IP: ${req.ip || req.connection.remoteAddress}`);
    console.log(`  User-Agent: ${req.headers['user-agent'] || 'unknown'}`);
    console.log(`  Headers: ${JSON.stringify(req.headers)}`);
    
    const originalEnd = res.end;
    const originalSend = res.send;
    
    res.end = function(...args) {
        const duration = Date.now() - startTime;
        
        metricsTracker.recordRequest(req, res, duration);
        
        console.log(`[${new Date().toISOString()}] END ${req.method} ${req.url}`);
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Duration: ${duration}ms`);
        console.log(`  Response Headers: ${JSON.stringify(res.getHeaders())}`);
        console.log('---'.repeat(15));
        
        return originalEnd.apply(this, args);
    };
    
    res.send = function(body) {
        const duration = Date.now() - startTime;
        
        metricsTracker.recordRequest(req, res, duration);
        
        console.log(`[${new Date().toISOString()}] END ${req.method} ${req.url}`);
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  Duration: ${duration}ms`);
        console.log(`  Response Size: ${JSON.stringify(body).length} bytes`);
        console.log('---'.repeat(15));
        
        return originalSend.call(this, body);
    };
    
    next();
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(metricsMiddleware);

let todos = [
    { id: 1, title: 'Learn Express Metrics', completed: false },
    { id: 2, title: 'Implement Middleware', completed: true },
    { id: 3, title: 'Test API Endpoints', completed: false }
];

app.get('/todos', (req, res) => {
    res.json({
        success: true,
        data: todos,
        count: todos.length
    });
});

app.get('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todo = todos.find(t => t.id === id);
    
    if (!todo) {
        return res.status(404).json({
            success: false,
            error: 'Todo not found'
        });
    }
    
    res.json({
        success: true,
        data: todo
    });
});

app.post('/todos', (req, res) => {
    const { title } = req.body;
    
    if (!title) {
        return res.status(400).json({
            success: false,
            error: 'Title is required'
        });
    }
    
    const newTodo = {
        id: todos.length + 1,
        title,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    todos.push(newTodo);
    
    res.status(201).json({
        success: true,
        message: 'Todo created successfully',
        data: newTodo
    });
});

app.put('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, completed } = req.body;
    
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Todo not found'
        });
    }
    
    todos[todoIndex] = {
        ...todos[todoIndex],
        ...(title && { title }),
        ...(completed !== undefined && { completed }),
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: 'Todo updated successfully',
        data: todos[todoIndex]
    });
});

app.delete('/todos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const todoIndex = todos.findIndex(t => t.id === id);
    
    if (todoIndex === -1) {
        return res.status(404).json({
            success: false,
            error: 'Todo not found'
        });
    }
    
    const deletedTodo = todos.splice(todoIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'Todo deleted successfully',
        data: deletedTodo
    });
});

app.get('/metrics', (req, res) => {
    const metrics = metricsTracker.getMetrics();
    
    res.json({
        success: true,
        timestamp: new Date().toISOString(),
        metrics: metrics
    });
});

app.post('/metrics/reset', (req, res) => {
    metricsTracker.reset();
    
    res.json({
        success: true,
        message: 'Metrics reset successfully',
        timestamp: new Date().toISOString()
    });
});

app.get('/metrics/requests', (req, res) => {
    const { limit = 50 } = req.query;
    const recentRequests = metricsTracker.requests
        .slice(-parseInt(limit))
        .reverse();
    
    res.json({
        success: true,
        count: recentRequests.length,
        requests: recentRequests,
        timestamp: new Date().toISOString()
    });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        todosCount: todos.length
    });
});

app.get('/error', (req, res) => {
    if (Math.random() > 0.5) {
        return res.status(500).json({
            success: false,
            error: 'Simulated server error'
        });
    }
    
    res.json({
        success: true,
        message: 'No error this time'
    });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.method} ${req.url} not found`,
        timestamp: new Date().toISOString()
    });
});

app.use((err, req, res, next) => {
    console.error('[Server Error]', err);
    
    res.status(500).json({
        success: false,
        error: {
            message: 'Internal server error',
            timestamp: new Date().toISOString()
        }
    });
});

app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('Request Logging & Metrics Server');
    console.log('='.repeat(50));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nMain Routes:');
    console.log('  GET    /todos           - Get all todos');
    console.log('  GET    /todos/:id       - Get todo by ID');
    console.log('  POST   /todos           - Create new todo');
    console.log('  PUT    /todos/:id       - Update todo');
    console.log('  DELETE /todos/:id       - Delete todo');
    console.log('\nMetrics Routes:');
    console.log('  GET    /metrics         - View metrics');
    console.log('  GET    /metrics/requests - View request log');
    console.log('  POST   /metrics/reset   - Reset metrics');
    console.log('  GET    /health          - Health check');
    console.log('  GET    /error           - Simulate error (for testing)');
    console.log('\nTry these commands:');
    console.log('  curl http://localhost:3004/todos');
    console.log('  curl -X POST http://localhost:3004/todos \\');
    console.log('       -H "Content-Type: application/json" \\');
    console.log('       -d \'{"title":"Test Metrics"}\'');
    console.log('  curl http://localhost:3004/metrics');
    console.log('  curl http://localhost:3004/metrics/requests?limit=5');
    console.log('  curl http://localhost:3004/error');
    console.log('='.repeat(50));
    console.log('\n. Metrics middleware is active on all routes');
    console.log('All requests are being logged and tracked');
    console.log('='.repeat(50));
});
