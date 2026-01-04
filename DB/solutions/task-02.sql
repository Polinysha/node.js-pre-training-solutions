=== TASK 02: SQL CRUD OPERATIONS ===

1. CREATE - INSERT DATA:

INSERT INTO users (username) VALUES ('john_doe');
INSERT INTO users (username) VALUES ('jane_smith');

INSERT INTO todos (title, description, status, user_id) 
VALUES ('Купить продукты', 'Молоко, хлеб, яйца', 'active', 1);

INSERT INTO todos (title, description, status, user_id) 
VALUES ('Сделать домашку', 'Выполнить задание по SQL', 'active', 1);

INSERT INTO todos (title, description, status, user_id) 
VALUES ('Позвонить маме', 'Обсудить планы на выходные', 'pending', 2);

INSERT INTO todos (title, description, status, user_id) 
VALUES ('Записаться к врачу', 'Стоматолог, четверг 15:00', 'completed', 2);

2. READ - SELECT DATA:

SELECT * FROM todos;

SELECT id, title, status FROM todos WHERE user_id = 1;

SELECT * FROM todos WHERE status = 'completed';

SELECT * FROM todos ORDER BY created_at DESC;

SELECT users.username, todos.title, todos.status 
FROM todos 
JOIN users ON todos.user_id = users.id;

3. UPDATE - MODIFY DATA:

UPDATE todos SET status = 'completed' WHERE id = 1;

UPDATE todos SET description = 'Молоко, хлеб, яйца, сыр' WHERE id = 1;

UPDATE todos SET status = 'active', title = 'Сделать домашку по SQL' WHERE id = 2;

4. DELETE - REMOVE DATA:

DELETE FROM todos WHERE id = 3;

DELETE FROM todos WHERE status = 'completed' AND user_id = 2;

DELETE FROM todos WHERE created_at < CURRENT_TIMESTAMP - INTERVAL '30 days';
