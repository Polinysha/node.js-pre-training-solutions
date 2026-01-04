=== TASK 01: SQL SCHEMA ===

1. INSTALLATION:

Database: PostgreSQL via Docker

Commands:
docker run --name todo-postgres -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_DB=todo_app -p 5432:5432 -d postgres:15-alpine

2. DATABASE CREATION:

Database 'todo_app' created via POSTGRES_DB environment variable.

3. SQL FOR TABLE CREATION:

DROP TABLE IF EXISTS todos CASCADE;
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE todos (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id INTEGER REFERENCES users(id)
);

4. VERIFICATION:

Commands:
docker exec todo-postgres psql -U postgres -d todo_app -c "\dt"
docker exec todo-postgres psql -U postgres -d todo_app -c "\d users"
docker exec todo-postgres psql -U postgres -d todo_app -c "\d todos"

5. GUI TOOL:

Optional: DBeaver installed for database management.

6. EXECUTION RESULT:

Tables created successfully:
- users: id, name, email, created_at
- todos: id, title, description, status, created_at, user_id

Foreign key: todos.user_id references users.id

All requirements satisfied.
