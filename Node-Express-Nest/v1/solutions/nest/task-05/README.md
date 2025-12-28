# Task 5: ORM Integration with TypeORM

ToDo API with TypeORM integration and proper DTO mapping.

## Features
- TodoModule with TypeORM integration
- TodoEntity with proper TypeORM decorators
- Repository pattern implementation
- DTO to Entity mapping
- SQLite database (for simplicity)

## Database Setup
Uses SQLite for simplicity. Database file: \database.sqlite\

## API Endpoints
Same as Task 4 but with persistent storage:
- POST /todos - Create new todo
- GET /todos - Get all todos
- GET /todos/:id - Get todo by ID
- PUT /todos/:id - Update todo
- DELETE /todos/:id - Delete todo
