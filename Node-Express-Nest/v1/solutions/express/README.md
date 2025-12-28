# Express.js Solutions

This directory contains solutions for Express.js tasks.

## Tasks:

### Task 1: Middleware Playground
File: \	ask-01.js\
Port: 3000

- Demonstrates middleware execution order
- Implements logger, timer, and custom header middlewares
- Logs request/response details
- Shows middleware chain execution

### Task 2: Params and Queries Challenge with Validation
File: \	ask-02.js\
Port: 3001

- Validates route parameters and query strings
- Uses express-validator for validation
- Demonstrates filtering, pagination, and sorting
- Shows proper error handling for validation failures

### Task 3: Centralized Error Handler
File: \	ask-03.js\
Port: 3002

- Implements custom error classes
- Centralized error handling middleware
- Consistent error response format
- Demonstrates different error types

### Task 4: Wire Up ToDo REST API
File: \	ask-04.js\
Port: 3003

- Full CRUD operations for todos
- Request validation middleware
- Search and filtering capabilities
- Todo statistics endpoint

### Task 5: Request Logging and Metrics Middleware
File: \	ask-05.js\
Port: 3004

- Request logging middleware
- Metrics tracking and collection
- /metrics endpoint for statistics
- Request history viewing

## How to Run:

1. Install dependencies:
\\\ash
npm install
\\\

2. Run individual tasks:
\\\ash
node task-01.js  # Runs on port 3000
node task-02.js  # Runs on port 3001
node task-03.js  # Runs on port 3002
node task-04.js  # Runs on port 3003
node task-05.js  # Runs on port 3004
\\\

3. Test with curl:
\\\ash
# Task 1
curl http://localhost:3000/

# Task 2
curl http://localhost:3001/users/1?active=true

# Task 3
curl http://localhost:3002/users

# Task 4
curl http://localhost:3003/todos

# Task 5
curl http://localhost:3004/metrics
\\\

## Dependencies:
- express: ^4.18.2
- express-validator: ^7.0.1

## Notes:
- Each task runs on a different port to avoid conflicts
- All tasks include comprehensive logging
- Error handling is implemented in all tasks
- Code includes comments explaining key concepts

## Key Concepts Demonstrated:

1. Middleware architecture and execution order
2. Route parameter and query validation
3. Error handling patterns
4. REST API design
5. Request logging and metrics collection
6. Separation of concerns
7. Input validation and sanitization
