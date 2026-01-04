=== TASK 04: SQL RELATIONSHIPS ===

1. DATABASE CONNECTION:

docker exec -it todo-postgres psql -U postgres -d todo_app

2. CREATE USERS TABLE:

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

3. ALTER TODOS TABLE TO ADD FOREIGN KEY:

-- Добавляем столбец user_id
ALTER TABLE todos ADD COLUMN user_id INTEGER;

-- Добавляем foreign key constraint
ALTER TABLE todos 
ADD CONSTRAINT fk_todos_user_id 
FOREIGN KEY (user_id) 
REFERENCES users(id);

4. VERIFICATION QUERIES:

-- Проверяем созданные таблицы
\dt

-- Проверяем структуру таблицы users
\d users

-- Проверяем структуру таблицы todos
\d todos

-- Проверяем foreign key constraints
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu 
        ON tc.constraint_name = kcu.constraint_name 
    JOIN information_schema.constraint_column_usage AS ccu 
        ON ccu.constraint_name = tc.constraint_name 
WHERE 
    tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name = 'todos';

5. TEST DATA INSERTION:

-- Добавляем пользователей
INSERT INTO users (name, email) VALUES 
('Иван Петров', 'ivan@example.com'),
('Мария Сидорова', 'maria@example.com'),
('Алексей Иванов', 'alexey@example.com');

-- Добавляем задачи с привязкой к пользователям
INSERT INTO todos (title, description, status, user_id) VALUES
('Купить продукты', 'Молоко, хлеб, яйца', 'active', 1),
('Сделать домашку', 'Задание по математике', 'completed', 1),
('Позвонить маме', 'Поздравить с днем рождения', 'pending', 2),
('Подготовить отчет', 'Еженедельный отчет о работе', 'active', 2),
('Изучить SQL', 'Выполнить задания по SQL', 'active', 3),
('Запланировать отпуск', 'Выбрать даты и отель', 'pending', 3);

6. RELATIONSHIP TESTING QUERIES:

-- Выбираем все задачи с информацией о пользователях
SELECT 
    t.id,
    t.title,
    t.status,
    u.name as user_name,
    u.email as user_email
FROM todos t
JOIN users u ON t.user_id = u.id
ORDER BY t.id;

-- Задачи конкретного пользователя
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.created_at
FROM todos t
WHERE t.user_id = 1
ORDER BY t.created_at DESC;

-- Количество задач по пользователям
SELECT 
    u.name,
    u.email,
    COUNT(t.id) as total_todos,
    SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) as completed_todos
FROM users u
LEFT JOIN todos t ON u.id = t.user_id
GROUP BY u.id, u.name, u.email
ORDER BY total_todos DESC;

7. FOREIGN KEY CONSTRAINT TESTS:

-- Попытка добавить задачу с несуществующим user_id (должна завершиться ошибкой)
-- INSERT INTO todos (title, description, status, user_id) VALUES ('Test', 'Test', 'active', 999);

-- Удаление пользователя с существующими задачами (поведение зависит от настроек foreign key)
-- DELETE FROM users WHERE id = 1;
