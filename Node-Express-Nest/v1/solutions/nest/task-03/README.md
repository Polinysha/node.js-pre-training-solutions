# Task 3: Request Lifecycle Exploration

Demonstrates NestJS request lifecycle with Guard, Pipe, and Interceptor.

## Features
- LoggingGuard: Checks for valid API key
- ValidationPipe: Validates request data
- LoggingInterceptor: Logs request/response timing
- LoggingMiddleware: Logs request start
- Execution order demonstration

## API Endpoints
- GET /public - Accessible without guard
- GET /protected - Requires valid API key
- POST /validate - Validates request body with DTO
