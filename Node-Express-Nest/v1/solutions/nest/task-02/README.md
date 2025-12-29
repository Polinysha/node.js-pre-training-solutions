# Task 2: Dependency Injection Chain

. AuditService depends on UserService
. UserService depends on LoggerService
. Constructor-based DI demonstrated

DI Chain: Controller → AuditService → UserService → LoggerService

Run: npm run dev
Port: 3001

Endpoint: GET / - Shows DI chain working
