# Task 4: ToDo CRUD with DTOs and Validation

Complete ToDo CRUD API with proper DTO structure and validation.

## Features
- TodoModule with TodoController and TodoService
- CreateTodoDto and UpdateTodoDto with class-validator
- Global ValidationPipe integration
- In-memory data store
- Full CRUD operations

## API Endpoints
- POST /todos - Create new todo
- GET /todos - Get all todos
- GET /todos/:id - Get todo by ID
- PUT /todos/:id - Update todo
- DELETE /todos/:id - Delete todo
- PATCH /todos/:id/complete - Mark todo as complete

## Validation Rules
- title: required, min 3 chars, max 100 chars
- description: optional, max 500 chars
- completed: boolean
