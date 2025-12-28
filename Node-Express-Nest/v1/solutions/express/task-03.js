const express = require('express');
const app = express();
const PORT = 3002;

/**
 * Task 3: Centralized Error Handler
 * Throw errors from routes and handle them using a custom error middleware.
 * Format the output as `{ status, message, timestamp }`.
 */

// Custom Error Classes
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        
        Error.captureStackTrace(this, this.constructor);
    }
}

class NotFoundError extends AppError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

class ValidationError extends AppError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = 'Unauthorized access') {
        super(message, 401);
    }
}

// Global error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error(`[Error Handler] ${err.message}`);
    
    const statusCode = err.statusCode || 500;
    const status = err.status || 'error';
    
    const errorResponse = {
        status: status,
        message: err.message,
        timestamp: new Date().toISOString()
    };
    
    // Add stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = err.stack;
        errorResponse.name = err.name;
    }
    
    // Add validation errors if any
    if (err.errors) {
        errorResponse.errors = err.errors;
    }
    
    res.status(statusCode).json(errorResponse);
};

// Custom middleware to log requests
const requestLogger = (req, res, next) => {
    req.requestTime = new Date().toISOString();
    console.log(`[${req.requestTime}] ${req.method} ${req.url}`);
    next();
};

// Middleware to simulate authentication
const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    
    if (!token) {
        return next(new UnauthorizedError('Authorization token is required'));
    }
    
    // Simulate token validation
    if (token !== 'Bearer valid-token') {
        return next(new UnauthorizedError('Invalid authorization token'));
    }
    
    req.user = { id: 1, name: 'Authenticated User' };
    next();
};

// Middleware to validate request body
const validateCreateUser = (req, res, next) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return next(new ValidationError('Name and email are required'));
    }
    
    if (typeof name !== 'string' || name.length < 2) {
        return next(new ValidationError('Name must be a string with at least 2 characters'));
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return next(new ValidationError('Invalid email format'));
    }
    
    next();
};

app.use(express.json());
app.use(requestLogger);

// In-memory database
let users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' }
];
let nextId = 3;

// Routes that throw errors

// GET /users - Get all users
app.get('/users', (req, res, next) => {
    if (users.length === 0) {
        return next(new NotFoundError('No users found'));
    }
    
    res.json({
        success: true,
        data: users,
        count: users.length,
        timestamp: new Date().toISOString()
    });
});

// GET /users/:id - Get user by ID
app.get('/users/:id', (req, res, next) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
        return next(new ValidationError('Invalid user ID'));
    }
    
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        return next(new NotFoundError(`User with ID ${userId} not found`));
    }
    
    res.json({
        success: true,
        data: user,
        timestamp: new Date().toISOString()
    });
});

// POST /users - Create new user
app.post('/users', validateCreateUser, (req, res, next) => {
    const { name, email } = req.body;
    
    // Check if email already exists
    if (users.some(u => u.email === email)) {
        return next(new ValidationError(`User with email ${email} already exists`));
    }
    
    const newUser = {
        id: nextId++,
        name,
        email,
        createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: newUser,
        timestamp: new Date().toISOString()
    });
});

// PUT /users/:id - Update user
app.put('/users/:id', authenticate, (req, res, next) => {
    const userId = parseInt(req.params.id);
    const { name, email } = req.body;
    
    if (isNaN(userId)) {
        return next(new ValidationError('Invalid user ID'));
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return next(new NotFoundError(`User with ID ${userId} not found`));
    }
    
    // Validate update data
    if (!name && !email) {
        return next(new ValidationError('At least one field (name or email) must be provided for update'));
    }
    
    if (email && users.some((u, index) => index !== userIndex && u.email === email)) {
        return next(new ValidationError(`Email ${email} is already in use`));
    }
    
    // Update user
    users[userIndex] = {
        ...users[userIndex],
        ...(name && { name }),
        ...(email && { email }),
        updatedAt: new Date().toISOString()
    };
    
    res.json({
        success: true,
        message: 'User updated successfully',
        data: users[userIndex],
        timestamp: new Date().toISOString()
    });
});

// DELETE /users/:id - Delete user
app.delete('/users/:id', authenticate, (req, res, next) => {
    const userId = parseInt(req.params.id);
    
    if (isNaN(userId)) {
        return next(new ValidationError('Invalid user ID'));
    }
    
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return next(new NotFoundError(`User with ID ${userId} not found`));
    }
    
    const deletedUser = users.splice(userIndex, 1)[0];
    
    res.json({
        success: true,
        message: 'User deleted successfully',
        data: deletedUser,
        timestamp: new Date().toISOString()
    });
});

// GET /protected - Protected route
app.get('/protected', authenticate, (req, res) => {
    res.json({
        success: true,
        message: 'Welcome to protected route',
        user: req.user,
        timestamp: new Date().toISOString()
    });
});

// GET /error - Route that intentionally throws an error
app.get('/error', (req, res, next) => {
    // Simulate different types of errors
    const errorType = req.query.type || 'generic';
    
    switch (errorType) {
        case 'notfound':
            next(new NotFoundError('Custom not found error'));
            break;
        case 'validation':
            next(new ValidationError('Custom validation error'));
            break;
        case 'unauthorized':
            next(new UnauthorizedError('Custom unauthorized error'));
            break;
        case 'database':
            // Simulate database error
            const dbError = new Error('Database connection failed');
            dbError.statusCode = 503;
            next(dbError);
            break;
        default:
            next(new Error('Generic server error'));
    }
});

// 404 handler - catches all unhandled routes
app.all('*', (req, res, next) => {
    next(new NotFoundError(`Cannot ${req.method} ${req.url}`));
});

// Use the global error handler (must be last middleware)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('Centralized Error Handler Server');
    console.log('='.repeat(50));
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('\nRoutes:');
    console.log('  GET    /users                    - Get all users');
    console.log('  GET    /users/:id               - Get user by ID');
    console.log('  POST   /users                   - Create new user');
    console.log('  PUT    /users/:id               - Update user (requires auth)');
    console.log('  DELETE /users/:id               - Delete user (requires auth)');
    console.log('  GET    /protected               - Protected route (requires auth)');
    console.log('  GET    /error?type=notfound     - Test error handling');
    console.log('\nError Types: notfound, validation, unauthorized, database');
    console.log('\nTest Commands:');
    console.log('  # Test successful requests');
    console.log('  curl http://localhost:3002/users');
    console.log('  curl http://localhost:3002/users/1');
    console.log('  curl -X POST http://localhost:3002/users \\');
    console.log('       -H "Content-Type: application/json" \\');
    console.log('       -d \'{"name":"John","email":"john@example.com"}\'');
    console.log('');
    console.log('  # Test error handling');
    console.log('  curl http://localhost:3002/users/999');
    console.log('  curl http://localhost:3002/nonexistent');
    console.log('  curl http://localhost:3002/error?type=validation');
    console.log('  curl http://localhost:3002/protected');
    console.log('  curl -H "Authorization: Bearer valid-token" http://localhost:3002/protected');
    console.log('='.repeat(50));
});
